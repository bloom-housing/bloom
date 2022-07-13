import { Process, Processor } from "@nestjs/bull"
import { AFSProcessingQueueNames } from "./constants/applications-flagged-sets-constants"
import { Brackets, Repository, SelectQueryBuilder } from "typeorm"
import { Application } from "../applications/entities/application.entity"
import { Rule } from "./types/rule-enum"
import { InjectRepository } from "@nestjs/typeorm"
import { ListingRepository } from "../listings/repositories/listing.repository"
import { ListingStatus } from "../listings/types/listing-status-enum"
import Listing from "../listings/entities/listing.entity"
import { ApplicationFlaggedSet } from "./entities/application-flagged-set.entity"
import { FlaggedSetStatus } from "./types/flagged-set-status-enum"

@Processor(AFSProcessingQueueNames.afsProcessing)
export class ApplicationFlaggedSetsCronjobConsumer {
  constructor(
    @InjectRepository(ListingRepository) private readonly listingRepository: ListingRepository,
    @InjectRepository(ApplicationFlaggedSet)
    private readonly afsRepository: Repository<ApplicationFlaggedSet>,
    @InjectRepository(Application) private readonly applicationRepository: Repository<Application>,
  ) {}

  @Process({concurrency: 1})
  async process() {
    console.log("AFS processing has started")

    const rules = [Rule.nameAndDOB, Rule.email]
    const activeListings = await this.listingRepository.find({
      where: { status: ListingStatus.active },
    })

    console.log(`Found ${activeListings.length} active listings`)

    for (const activeListing of activeListings) {
      console.log(`Processing AFSes for Listing \"${activeListing.name}\"`)
      await this.removeAllAFSesForListing(activeListing)

      for (const rule of rules) {
        await this.generateAFSesForListingRule(activeListing, rule)
      }
    }
  }

  private async removeAllAFSesForListing(listing: Listing) {
    const afses = await this.afsRepository.find({ where: { listing } })
    await this.afsRepository.remove(afses)
  }

  private async generateAFSesForListingRule(listing: Listing, rule: Rule) {
    const applications = await this.applicationRepository.find({ where: { listing } })
    for(const application of applications) {
      await this.updateApplicationFlaggedSetsForRule(application, rule)
    }
  }

  async updateApplicationFlaggedSetsForRule(
    newApplication: Application,
    rule: Rule
  ) {
    const applicationsMatchingRule = await this.fetchDuplicatesMatchingRule(
      newApplication,
      rule
    )

    const visitedAfses = []

    const afses = await this.afsRepository
      .createQueryBuilder("afs")
      .leftJoin("afs.applications", "applications")
      .select(["afs", "applications.id"])
      .where(`afs.listing_id = :listingId`, { listingId: newApplication.listing.id })
      .andWhere(`rule = :rule`, { rule })
      .getMany()

    for (const matchedApplication of applicationsMatchingRule) {
      const afsesMatchingRule = afses.filter((afs) =>
        afs.applications.map((app) => app.id).includes(matchedApplication.id)
      )

      if (afsesMatchingRule.length === 0) {
        await this.afsRepository.save({
          rule: rule,
          resolvedTime: null,
          resolvingUser: null,
          status: FlaggedSetStatus.flagged,
          applications: [newApplication, matchedApplication],
          listing: newApplication.listing,
        })
      } else if (afsesMatchingRule.length === 1) {
        for (const afs of afsesMatchingRule) {
          if (visitedAfses.includes(afs.id)) {
            return
          }

          visitedAfses.push(afs.id)
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
  }

  private async fetchDuplicatesMatchingRule(
    application: Application,
    rule: Rule
  ) {
    switch (rule) {
      case Rule.nameAndDOB:
        return await this.fetchDuplicatesMatchingNameAndDOBRule(application)
      case Rule.email:
        return await this.fetchDuplicatesMatchingEmailRule(application)
    }
  }

  private async fetchDuplicatesMatchingEmailRule(
    newApplication: Application
  ) {
    return await this.applicationRepository.find({
      select: ["id"],
      where: (qb: SelectQueryBuilder<Application>) => {
        qb.where("Application.id != :id", {
          id: newApplication.id,
        })
          .andWhere("Application.listing.id = :listingId", {
            listingId: newApplication.listing.id,
          })
          .andWhere("Application__applicant.emailAddress = :emailAddress", {
            emailAddress: newApplication.applicant.emailAddress,
          })
          .andWhere("Application.status = :status", { status: "submitted" })
      },
    })
  }

  private async fetchDuplicatesMatchingNameAndDOBRule(
    newApplication: Application
  ) {
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
            listingId: newApplication.listing.id,
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
