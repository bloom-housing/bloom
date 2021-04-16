import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common"
import { PaginatedApplicationFlaggedSetQueryParams } from "./application-flagged-sets.controller"
import { AuthzService } from "../auth/authz.service"
import {
  ApplicationFlaggedSet,
  FlaggedSetStatus,
  Rule,
} from "./entities/application-flagged-set.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Brackets, DeepPartial, Repository, SelectQueryBuilder } from "typeorm"
import { paginate } from "nestjs-typeorm-paginate"
import { Application } from "../applications/entities/application.entity"
import {
  ApplicationFlaggedSetResolveDto,
  PaginatedApplicationFlaggedSetDto,
} from "./dto/application-flagged-set.dto"
import { REQUEST } from "@nestjs/core"
import { Request as ExpressRequest } from "express"
import { User } from "../user/entities/user.entity"

@Injectable({ scope: Scope.REQUEST })
export class ApplicationFlaggedSetsService {
  constructor(
    @Inject(REQUEST) private request: ExpressRequest,
    private readonly authzService: AuthzService,
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
    @InjectRepository(ApplicationFlaggedSet)
    private readonly afsRepository: Repository<ApplicationFlaggedSet>
  ) {}
  async listPaginated(queryParams: PaginatedApplicationFlaggedSetQueryParams) {
    const results = await paginate<ApplicationFlaggedSet>(
      this.afsRepository,
      { limit: queryParams.limit, page: queryParams.page },
      {
        relations: ["listing", "applications"],
        where: {
          ...(queryParams.listingId && { listingId: queryParams.listingId }),
        },
      }
    )
    const countTotalFlagged = await this.afsRepository.count({
      where: { status: FlaggedSetStatus.flagged },
    })
    return {
      ...results,
      meta: {
        ...results.meta,
        totalFlagged: countTotalFlagged,
      },
    }
  }

  async findOneById(afsId: string) {
    return await this.afsRepository.findOneOrFail({
      relations: ["listing", "applications"],
      where: {
        id: afsId,
      },
    })
  }

  async resolve(dto: ApplicationFlaggedSetResolveDto) {
    const afs = await this.afsRepository.findOne({
      where: { id: dto.afsId },
      relations: ["applications"],
    })
    if (!afs) {
      throw new NotFoundException()
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    afs.resolvingUser = this.request.user as User
    afs.resolvedTime = new Date()
    afs.status = FlaggedSetStatus.resolved
    const appsToBeResolved = afs.applications.filter((afsApp) =>
      dto.applications.map((appIdDto) => appIdDto.id).includes(afsApp.id)
    )
    const appsNotToBeResolved = afs.applications.filter(
      (afsApp) => !dto.applications.map((appIdDto) => appIdDto.id).includes(afsApp.id)
    )

    for (const appToBeResolved of appsToBeResolved) {
      appToBeResolved.markedAsDuplicate = true
      await this.applicationsRepository.save(appToBeResolved)
    }

    for (const appNotToBeResolved of appsNotToBeResolved) {
      appNotToBeResolved.markedAsDuplicate = false
      await this.applicationsRepository.save(appNotToBeResolved)
    }
    appsToBeResolved.forEach((app) => (app.markedAsDuplicate = true))
    await this.afsRepository.save(afs)
    return afs
  }

  async onApplicationSave(newApplication: Application) {
    for (const rule of [Rule.email, Rule.nameAndDOB]) {
      await this.updateApplicationFlaggedSetsForRule(newApplication, rule)
    }
  }

  async fetchDuplicatesMatchingRule(application: Application, rule: Rule) {
    switch (rule) {
      case Rule.nameAndDOB:
        return await this.fetchDuplicatesMatchingNameAndDOBRule(application)
      case Rule.email:
        return await this.fetchDuplicatesMatchingEmailRule(application)
    }
  }

  async updateApplicationFlaggedSetsForRule(newApplication: Application, rule: Rule) {
    const applicationsMatchingRule = await this.fetchDuplicatesMatchingRule(newApplication, rule)
    const visitedAfses = []
    for (const matchedApplication of applicationsMatchingRule) {
      // NOTE: Optimize it because of N^2 complexity,
      //  for each matched application we create a query returning a list of matching sets
      // TODO: Add filtering into the query, right now all AFSes are fetched for each
      //  matched application which will become a performance problem soon
      const afsesMatchingRule = (
        await this.afsRepository.find({
          join: {
            alias: "afs",
            leftJoinAndSelect: {
              applications: "afs.applications",
            },
          },
          where: {
            listingId: newApplication.listing.id,
            rule: rule,
          },
        })
      ).filter((afs) => afs.applications.map((app) => app.id).includes(matchedApplication.id))

      if (afsesMatchingRule.length === 0) {
        const newAfs: DeepPartial<ApplicationFlaggedSet> = {
          rule: rule,
          resolvedTime: null,
          resolvingUser: null,
          status: FlaggedSetStatus.flagged,
          applications: [newApplication, matchedApplication],
          listing: newApplication.listing,
        }
        await this.afsRepository.save(newAfs)
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

  private async fetchDuplicatesMatchingEmailRule(newApplication: Application) {
    return await this.applicationsRepository.find({
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

    return await this.applicationsRepository.find({
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
