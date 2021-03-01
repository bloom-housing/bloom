import { Inject, Injectable } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { InjectRepository } from "@nestjs/typeorm"
import { Brackets, DeepPartial, Repository, SelectQueryBuilder } from "typeorm"
import { Request } from "express"
import {
  ApplicationFlaggedSet,
  FlaggedSetStatus,
  Rule,
} from "./entities/application-flagged-set.entity"
import { paginate } from "nestjs-typeorm-paginate"
import { ApplicationsListQueryParams } from "../applications/applications.controller"
import { Application } from "../applications/entities/application.entity"
import { User } from "../user/entities/user.entity"

@Injectable()
export class ApplicationFlaggedSetService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(ApplicationFlaggedSet)
    private readonly afsRepository: Repository<ApplicationFlaggedSet>,
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>
  ) {}

  async list(params: ApplicationsListQueryParams) {
    return paginate(
      this.afsRepository,
      { limit: params.limit, page: params.page },
      {
        relations: ["applications"],
      }
    )
  }

  public async listCsv(listingId: string | null, user?: User) {
    return this.applicationsRepository.find({
      where: {
        ...(user && { user: { id: user.id } }),
        // Workaround for params.listingId resulting in:
        // listing: {id: undefined}
        // and query responding with 0 applications.
        ...(listingId && { listing: { id: listingId } }),
        status: "duplicate",
      },
      relations: ["listing", "user"],
      order: {
        createdAt: "DESC",
      },
    })
  }

  async handleInsert(newApplication: Application) {
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

    const nameDobRuleSet = await this.applicationsRepository.find({
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
      join: {
        alias: "Application",
        leftJoinAndSelect: {
          afs: "Application.applicationFlaggedSets",
          afsApplications: "afs.applications",
        },
      },
    })

    const emailRuleSet = await this.applicationsRepository.find({
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
      join: {
        alias: "Application",
        leftJoinAndSelect: {
          afs: "Application.applicationFlaggedSets",
          afsApplications: "afs.applications",
        },
      },
    })

    console.log(" NETRA EMAILRILESET ", emailRuleSet)
    const queries: Record<Rule, Application[]> = {
      [Rule.nameAndDOB]: nameDobRuleSet,
      [Rule.email]: emailRuleSet,
    }

    for (const [queryRule, exApplications] of Object.entries(queries)) {
      const visitedAfses = []
      console.log("NETRA RULE ", queryRule)
      for (const exApplication of exApplications) {
        console.log("NETRA EXAPP ", exApplication)
        const afsesMatchingRule = exApplication.applicationFlaggedSets.filter(
          (afs) => afs.rule === queryRule
        )
        console.log("netra afsesMatchingRule", afsesMatchingRule)
        if (afsesMatchingRule.length === 0) {
          const newAfs: DeepPartial<ApplicationFlaggedSet> = {
            rule: queryRule,
            resolved: false,
            resolvedTime: null,
            resolvingUserId: null,
            status: FlaggedSetStatus.flagged,
            applications: [newApplication, exApplication],
          }
          await this.afsRepository.save(newAfs)
        } else {
          for (const afs of afsesMatchingRule) {
            if (visitedAfses.includes(afs.id)) {
              return
            }
            visitedAfses.push(afs.id)
            afs.applications.push(newApplication)
            await this.afsRepository.save(afs)
          }
        }
        if (afsesMatchingRule.length > 1) {
          console.debug(
            "There should be up to one AFS matching a rule for given application, " +
              "probably a logic error when creating AFSes"
          )
        }
      }
    }
  }

  // Add resolved logic here
  // Not able to image how data is coming in and in what form?
  // I have no idea what have I written here
  // async update(afsUpdateDto: ApplicationFlaggedSetUpdateDto) {
  //   const resolvedafs = await this.afsRepository.findOneOrFail({
  //     where: { id: afsUpdateDto.id },
  //     relations: ["applications"],
  //   })
  //   resolvedafs.resolved = true
  //   resolvedafs.resolvedTime = new Date()
  //   const applicatonsInAFS = []
  //   for (const application of applicatonsInAFS) {
  //     const nonResolvedAfses = application.applicationFlaggedSets.filter(
  //       (afs) => afs.id != afsUpdateDto.id
  //     )
  //     for (const afs of nonResolvedAfses) {
  //       afs.remove(application.id)
  //     }
  //   }
  //   await this.afsRepository.save(resolvedafs)
  // }

  async unresolvedList(afsId: string) {
    return await this.afsRepository.findOneOrFail({
      where: {
        id: afsId,
      },
      relations: ["applications"],
      order: {
        createdAt: "DESC",
      },
    })
  }
}
