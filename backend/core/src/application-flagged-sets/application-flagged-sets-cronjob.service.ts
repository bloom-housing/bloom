import {
  Brackets,
  FindOptionsWhere,
  LessThan,
  MoreThanOrEqual,
  Not,
  Raw,
  Repository,
} from "typeorm"
import { Application } from "../applications/entities/application.entity"
import { Rule } from "./types/rule-enum"
import { InjectRepository } from "@nestjs/typeorm"
import { createQueryBuilder } from "../listings/db/listing-helpers"
import { Listing } from "../listings/entities/listing.entity"
import { ApplicationFlaggedSet } from "./entities/application-flagged-set.entity"
import { FlaggedSetStatus } from "./types/flagged-set-status-enum"
import { getView } from "../applications/views/view"
import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common"
import { SchedulerRegistry } from "@nestjs/schedule"
import { CronJob } from "cron"
import { ConfigService } from "@nestjs/config"
import { CronJobService } from "../shared/services/cron-job.service"
import dayjs from "dayjs"
import { ApplicationStatus } from "../applications/types/application-status-enum"

const CRON_JOB_NAME = "AFS_CRON_JOB"
const CRON_CONFIG_VALUE = "AFS_PROCESSING_CRON_STRING"
@Injectable()
export class ApplicationFlaggedSetsCronjobService implements OnModuleInit {
  constructor(
    @InjectRepository(Listing) private readonly listingRepository: Repository<Listing>,
    @InjectRepository(ApplicationFlaggedSet)
    private readonly afsRepository: Repository<ApplicationFlaggedSet>,
    @InjectRepository(Application) private readonly applicationRepository: Repository<Application>,
    @Inject(Logger) private readonly logger = new Logger(ApplicationFlaggedSetsCronjobService.name),
    private schedulerRegistry: SchedulerRegistry,
    private readonly config: ConfigService,
    private readonly cronJobService: CronJobService
  ) {}

  onModuleInit() {
    // Take the cron job frequency from .env and add a random seconds to it.
    // That way when there are multiple instances running they won't run at the exact same time.
    const repeatCron = this.config.get<string>(CRON_CONFIG_VALUE)
    const randomSecond = Math.floor(Math.random() * 60)
    const newCron = `${randomSecond} ${repeatCron}`
    const job = new CronJob(newCron, () => {
      void (async () => {
        const currentCronJob = await this.cronJobService.getCronJobByName(CRON_JOB_NAME)
        // To prevent multiple overlapped jobs only run if one hasn't started in the last 5 minutes
        if (
          !currentCronJob ||
          currentCronJob.lastRunDate < dayjs(new Date()).subtract(5, "minutes").toDate()
        ) {
          try {
            await this.process()
          } catch (e) {
            this.logger.error(`${CRON_JOB_NAME} failed to run`)
          }
        }
      })()
    })
    this.schedulerRegistry.addCronJob(CRON_JOB_NAME, job)
    job.start()
  }

  public async process() {
    this.logger.warn("running the Application flagged sets cron job")
    await this.cronJobService.saveCronJobByName(CRON_JOB_NAME)
    const outOfDateListings = await createQueryBuilder(this.listingRepository, "listings")
      .select(["listings.id", "listings.afsLastRunAt"])
      .where("listings.lastApplicationUpdateAt IS NOT NULL")
      .andWhere(
        new Brackets((qb) => {
          qb.where("listings.afsLastRunAt IS NULL").orWhere(
            "listings.afsLastRunAt <= listings.lastApplicationUpdateAt"
          )
        })
      )
      .getMany()

    this.logger.warn(`updating the flagged sets for ${outOfDateListings.length} listings`)
    for (const outOfDateListing of outOfDateListings) {
      try {
        await this.generateAFSesForListingRules(outOfDateListing)
        outOfDateListing.afsLastRunAt = new Date()
        await this.listingRepository.save(outOfDateListing)
      } catch (e) {
        console.error(e)
      }
    }
  }

  private async generateAFSesForListingRules(listing: Pick<Listing, "id" | "afsLastRunAt">) {
    const qbView = getView(this.applicationRepository.createQueryBuilder("application"))
    const qb = qbView.getViewQb(true)
    qb.where("application.listing_id = :id", { id: listing.id })
    qb.andWhere("application.updatedAt >= :afsLastRunAt", {
      afsLastRunAt: listing.afsLastRunAt,
    })
    const newApplications = await qb.getMany()

    for (const newApplication of newApplications) {
      await this.addApplication(newApplication)
    }

    const existingApplications = await this.applicationRepository.find({
      where: {
        listing: {
          id: listing.id,
        },
        createdAt: LessThan(listing.afsLastRunAt),
        updatedAt: MoreThanOrEqual(listing.afsLastRunAt),
      },
    })

    for (const existingApplication of existingApplications) {
      await this.updateApplication(existingApplication)
    }
  }

  async updateApplication(application: Application) {
    application.markedAsDuplicate = false
    await this.applicationRepository.save(application)

    let afses = await this.afsRepository
      .createQueryBuilder("afs")
      .leftJoin("afs.applications", "applications")
      .select(["afs", "applications.id"])
      .where(`afs.listing_id = :listingId`, { listingId: application.listingId })
      .getMany()

    afses = afses.filter((afs) => afs.applications.map((app) => app.id).includes(application.id))

    const afsesToBeSaved: Array<ApplicationFlaggedSet> = []
    const afsesToBeRemoved: Array<ApplicationFlaggedSet> = []

    for (const afs of afses) {
      afs.status = FlaggedSetStatus.pending
      afs.resolvedTime = null
      afs.resolvingUser = null

      const applicationIndex = afs.applications.findIndex((app) => app.id === application.id)

      if (applicationIndex == -1) {
        continue
      }

      afs.applications.splice(applicationIndex, 1)

      if (afs.applications.length > 1) {
        afsesToBeSaved.push(afs)
      } else {
        afsesToBeRemoved.push(afs)
      }
    }
    if (afsesToBeSaved.length) {
      await this.afsRepository.save(afsesToBeSaved)
    }
    if (afsesToBeRemoved.length) {
      await this.afsRepository.remove(afsesToBeRemoved)
    }

    await this.addApplication(application)
  }

  /**
   *
   * This method checks if the new application matches others based on the rules.
   * If there are applications that match, this application is added to the AFS set (creating a new one or updating an existing set)
   */
  async addApplication(newApplication: Application): Promise<void> {
    const rules = [Rule.email, Rule.nameAndDOB]

    for (const rule of rules) {
      const applicationsMatchingRule = await this.fetchDuplicatesMatchingRule(newApplication, rule)
      if (applicationsMatchingRule.length === 0) {
        // continue to the next rule
        continue
      }

      const afses = await this.afsRepository
        .createQueryBuilder("afs")
        .leftJoin("afs.applications", "applications")
        .select(["afs", "applications.id"])
        .where(`afs.ruleKey = :ruleKey`, { ruleKey: this.getRuleKeyForRule(newApplication, rule) })
        .getMany()

      if (afses.length === 0) {
        await this.afsRepository.save({
          rule: rule,
          ruleKey: this.getRuleKeyForRule(newApplication, rule),
          resolvedTime: null,
          resolvingUser: null,
          status: FlaggedSetStatus.pending,
          applications: [newApplication, ...applicationsMatchingRule],
          listing: { id: newApplication.listingId },
        })
      } else if (afses.length === 1) {
        const afs = afses[0]

        if (!afs.applications.map((app) => app.id).includes(newApplication.id)) {
          afs.applications.push(newApplication)
          await this.afsRepository.save(afs)
        }
      } else {
        console.error(
          "There should be up to one AFS matching a rule for given application, " +
            "probably a logic error when creating AFSes"
        )
      }
      // there was a match so we don't need to check the next rule
      break
    }
  }

  private async fetchDuplicatesMatchingRule(application: Application, rule: Rule) {
    switch (rule) {
      case Rule.nameAndDOB:
        return await this.fetchDuplicatesMatchingNameAndDOBRule(application)
      case Rule.email:
        return await this.fetchDuplicatesMatchingEmailRule(application)
    }
  }

  private async fetchDuplicatesMatchingEmailRule(newApplication: Application) {
    // TODO: investigate .find
    const whereClause: FindOptionsWhere<Application> = {
      id: newApplication.id,
      status: ApplicationStatus.submitted,
      listing: {
        id: Not(newApplication.listingId),
      },
      applicant: {
        emailAddress: newApplication.applicant.emailAddress,
      },
    }
    return await this.applicationRepository.find({
      select: ["id"],
      where: whereClause,
    })
  }

  private getRuleKeyForRule(newApplication: Application, rule: Rule): string {
    if (rule == Rule.email) {
      return `${newApplication.listingId}-email-${newApplication.applicant.emailAddress}`
    } else if (rule == Rule.nameAndDOB) {
      return (
        `${newApplication.listingId}-nameAndDOB-${newApplication.applicant.firstName}-${newApplication.applicant.lastName}-${newApplication.applicant.birthMonth}-` +
        `${newApplication.applicant.birthDay}-${newApplication.applicant.birthYear}`
      )
    } else {
      throw new Error("Invalid rule")
    }
  }

  private async fetchDuplicatesMatchingNameAndDOBRule(newApplication: Application) {
    const firstNames = [
      newApplication.applicant.firstName,
      ...newApplication.householdMembers.map((householdMember) => householdMember.firstName),
    ]

    const lastNames = [
      newApplication.applicant.lastName,
      ...newApplication.householdMembers.map((householdMember) => householdMember.lastName),
    ]

    const birthMonths = [
      newApplication.applicant.birthMonth,
      ...newApplication.householdMembers.map((householdMember) => householdMember.birthMonth),
    ]

    const birthDays = [
      newApplication.applicant.birthDay,
      ...newApplication.householdMembers.map((householdMember) => householdMember.birthDay),
    ]

    const birthYears = [
      newApplication.applicant.birthYear,
      ...newApplication.householdMembers.map((householdMember) => householdMember.birthYear),
    ]

    // TODO: investigate .find
    const whereClause: FindOptionsWhere<Application> = {
      id: Not(newApplication.id),
      status: ApplicationStatus.submitted,
      listing: {
        id: newApplication.listingId,
      },
      householdMembers: {
        firstName: Raw(
          (alias) =>
            `(${alias} IN (:...firstNames) OR Application__applicant.firstName IN (:...firstNames))`,
          {
            firstNames,
          }
        ),
        lastName: Raw(
          (alias) =>
            `(${alias} IN (:...lastNames) OR Application__applicant.lastName IN (:...lastNames))`,
          {
            lastNames,
          }
        ),
        birthMonth: Raw(
          (alias) =>
            `(${alias} IN (:...birthMonths) OR Application__applicant.birthMonth IN (:...birthMonths))`,
          {
            birthMonths,
          }
        ),
        birthDay: Raw(
          (alias) =>
            `(${alias} IN (:...birthDays) OR Application__applicant.birthDay IN (:...birthDays))`,
          {
            birthDays,
          }
        ),
        birthYear: Raw(
          (alias) =>
            `(${alias} IN (:...birthYears) OR Application__applicant.birthYear IN (:...birthYears))`,
          {
            birthYears,
          }
        ),
      },
    }
    return await this.applicationRepository.find({
      select: ["id"],
      where: whereClause,
    })
  }
}
