import { Process, Processor } from "@nestjs/bull"
import { AFSProcessingQueueNames } from "./constants/applications-flagged-sets-constants"
import { Brackets, LessThan, MoreThanOrEqual, Repository, SelectQueryBuilder } from "typeorm"
import { Application } from "../applications/entities/application.entity"
import { Rule } from "./types/rule-enum"
import { InjectRepository } from "@nestjs/typeorm"
import { ListingRepository } from "../listings/db/listing.repository"
import { Listing } from "../listings/entities/listing.entity"
import { ApplicationFlaggedSet } from "./entities/application-flagged-set.entity"
import { FlaggedSetStatus } from "./types/flagged-set-status-enum"

@Processor(AFSProcessingQueueNames.afsProcessing)
export class ApplicationFlaggedSetsCronjobConsumer {
  constructor(
    @InjectRepository(ListingRepository) private readonly listingRepository: ListingRepository,
    @InjectRepository(ApplicationFlaggedSet)
    private readonly afsRepository: Repository<ApplicationFlaggedSet>,
    @InjectRepository(Application) private readonly applicationRepository: Repository<Application>
  ) {}

  @Process({ concurrency: 1 })
  async process() {
    const rules = [Rule.nameAndDOB, Rule.email]
    const outOfDateListings = await this.listingRepository
      .createQueryBuilder("listings")
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

    for (const outOfDateListing of outOfDateListings) {
      try {
        for (const rule of rules) {
          await this.generateAFSesForListingRule(outOfDateListing, rule)
        }
      } catch (e) {
        console.error(e)
      }

      outOfDateListing.afsLastRunAt = new Date()
      await this.listingRepository.save(outOfDateListing)
    }
  }

  private async generateAFSesForListingRule(
    listing: Pick<Listing, "id" | "afsLastRunAt">,
    rule: Rule
  ) {
    const newApplications = await this.applicationRepository.find({
      where: {
        listing: {
          id: listing.id,
        },
        createdAt: MoreThanOrEqual(listing.afsLastRunAt),
      },
    })

    for (const newApplication of newApplications) {
      await this.addApplication(newApplication, rule)
    }

    const existingApplications = await this.applicationRepository.find({
      select: ["listingId"],
      where: {
        listing: {
          id: listing.id,
        },
        createdAt: LessThan(listing.afsLastRunAt),
        updatedAt: MoreThanOrEqual(listing.afsLastRunAt),
      },
    })

    for (const existingApplication of existingApplications) {
      await this.updateApplication(existingApplication, rule)
    }
  }

  async updateApplication(application: Application, rule: Rule) {
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
      afs.status = FlaggedSetStatus.flagged
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

    await this.afsRepository.save(afsesToBeSaved)
    await this.afsRepository.remove(afsesToBeRemoved)

    await this.addApplication(application, rule)
  }

  async addApplication(newApplication: Application, rule: Rule) {
    const applicationsMatchingRule = await this.fetchDuplicatesMatchingRule(newApplication, rule)

    if (applicationsMatchingRule.length == 0) {
      return
    }

    const afses = await this.afsRepository
      .createQueryBuilder("afs")
      .leftJoin("afs.applications", "applications")
      .select(["afs", "applications.id"])
      .where(`afs.ruleKey = :ruleKey`, { ruleKey: this.getRuleKeyForRule(newApplication, rule) })
      .getMany()

    if (afses.length == 0) {
      await this.afsRepository.save({
        rule: rule,
        ruleKey: this.getRuleKeyForRule(newApplication, rule),
        resolvedTime: null,
        resolvingUser: null,
        status: FlaggedSetStatus.flagged,
        applications: [newApplication, ...applicationsMatchingRule],
        listing: { id: newApplication.listingId },
      })
    } else if (afses.length == 1) {
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
    return await this.applicationRepository.find({
      select: ["id"],
      where: (qb: SelectQueryBuilder<Application>) => {
        qb.where("Application.id != :id", {
          id: newApplication.id,
        })
          .andWhere("Application.listing.id = :listingId", {
            listingId: newApplication.listingId,
          })
          .andWhere("Application__applicant.emailAddress = :emailAddress", {
            emailAddress: newApplication.applicant.emailAddress,
          })
          .andWhere("Application.status = :status", { status: "submitted" })
      },
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

    return await this.applicationRepository.find({
      select: ["id"],
      where: (qb: SelectQueryBuilder<Application>) => {
        qb.where("Application.id != :id", {
          id: newApplication.id,
        })
          .andWhere("Application.listing.id = :listingId", {
            listingId: newApplication.listingId,
          })
          .andWhere("Application.status = :status", { status: "submitted" })
          .andWhere(
            new Brackets((subQb) => {
              subQb.where("Application__householdMembers.firstName IN (:...firstNames)", {
                firstNames: firstNames,
              })
              subQb.orWhere("Application__applicant.firstName IN (:...firstNames)", {
                firstNames: firstNames,
              })
            })
          )
          .andWhere(
            new Brackets((subQb) => {
              subQb.where("Application__householdMembers.lastName IN (:...lastNames)", {
                lastNames: lastNames,
              })
              subQb.orWhere("Application__applicant.lastName IN (:...lastNames)", {
                lastNames: lastNames,
              })
            })
          )
          .andWhere(
            new Brackets((subQb) => {
              subQb.where("Application__householdMembers.birthMonth IN (:...birthMonths)", {
                birthMonths: birthMonths,
              })
              subQb.orWhere("Application__applicant.birthMonth IN (:...birthMonths)", {
                birthMonths: birthMonths,
              })
            })
          )
          .andWhere(
            new Brackets((subQb) => {
              subQb.where("Application__householdMembers.birthDay IN (:...birthDays)", {
                birthDays: birthDays,
              })
              subQb.orWhere("Application__applicant.birthDay IN (:...birthDays)", {
                birthDays: birthDays,
              })
            })
          )
          .andWhere(
            new Brackets((subQb) => {
              subQb.where("Application__householdMembers.birthYear IN (:...birthYears)", {
                birthYears: birthYears,
              })
              subQb.orWhere("Application__applicant.birthYear IN (:...birthYears)", {
                birthYears: birthYears,
              })
            })
          )
      },
    })
  }
}
