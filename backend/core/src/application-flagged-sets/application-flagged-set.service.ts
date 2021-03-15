import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { InjectRepository } from "@nestjs/typeorm"
import { Brackets, DeepPartial, In, Repository, SelectQueryBuilder } from "typeorm"
import { Request } from "express"
import {
  ApplicationFlaggedSet,
  FlaggedSetStatus,
  Rule,
} from "./entities/application-flagged-set.entity"
import { paginate } from "nestjs-typeorm-paginate"
import { ApplicationsListQueryParams } from "../applications/applications.controller"
import { Application, ApplicationStatus } from "../applications/entities/application.entity"
import { User } from "src/user/entities/user.entity"
import { ApplicationFlaggedSetResolveDto } from "./dto/application-flagged-set.dto"

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
        relations: ["applications"]
      }
    )
  }

  // async list(params: ApplicationsListQueryParams) {
  //   return paginate(
  //     this.afsRepository,
  //     { limit: params.limit, page: params.page },
  //     {
  //       where: (qb: SelectQueryBuilder<ApplicationFlaggedSet>) => {
  //         qb.where("applicationFlaggedSet__applications.listingId = :id", {
  //           id: params.listingId,
  //         })
  //       },
  //       join: {
  //         alias: "applicationFlaggedSet",
  //         leftJoinAndSelect: {
  //           afs: "applicationFlaggedSet.applications",
  //         },
  //       },
  //     }
  //   )
  // }

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

    const queries: Record<Rule, Application[]> = {
      [Rule.nameAndDOB]: nameDobRuleSet,
      [Rule.email]: emailRuleSet,
    }

    for (const [queryRule, exApplications] of Object.entries(queries)) {
      const visitedAfses = []
      for (const exApplication of exApplications) {
        const afsesMatchingRule = exApplication.applicationFlaggedSets.filter(
          (afs) => afs.rule === queryRule
        )
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
          console.error(
            "There should be up to one AFS matching a rule for given application, " +
              "probably a logic error when creating AFSes"
          )
        }
      }
    }
  }

  // async getResolvedApplications(afsId: string, applicationIds: [], user: User) {
  //   // get the afs based on afsID
  //   const resolvedSet = await this.afsRepository.find({
  //     where: {
  //       id: afsId
  //       // applications: In(applicationId)
  //     }
  //     // relations: ["applications"],
  //   })
    
  //   // get the applications based on applicationIds
  //   const resolvedApplicationsList = await this.applicationsRepository.find({
  //     where: {
  //       id: In(applicationIds)
  //       // applications: In(applicationId)
  //     },
  //     relations: ["applicationFlaggedSets"],
  //   })

  //   // Update the AFS for resolved details
  //   const resolveAfs: DeepPartial<ApplicationFlaggedSet> = {
  //     resolved: true,
  //     resolvedTime: new Date(),
  //     resolvingUserId: user,
  //     status: FlaggedSetStatus.resolved,
  //     resolvedApplications: resolvedApplicationsList
  //   }
  //   await this.afsRepository.save(resolvedafs)
  // }

  async getResolvedApplications(afsId: string, applicationIds: [], user: User) {
    const resolvedSet = await this.afsRepository.find({
      where: {
        id: afsId,
        // applications: In(applicationId)
      },
      // relations: ["applications"],
    })
    console.log("netra resolvedSet ", resolvedSet)
    const resolvedApplicationsList = await this.applicationsRepository.find({
      where: {
        id: In(applicationIds),
        // applications: In(applicationId)
      },
      // relations: ["applications"],
    })
    console.log("netra resolvedApplicationsList ", resolvedApplicationsList)

    const resolveAfs: DeepPartial<ApplicationFlaggedSet> = {
      resolved: true,
      resolvedTime: new Date(),
      resolvingUserId: user,
      status: FlaggedSetStatus.resolved,
    }
    await this.afsRepository.save(resolveAfs)
  }
  //   for (const [applications] of Object.entries(resolvedSet)) {
  //     const afsesMatchingRule = exApplication.applicationFlaggedSets.filter(
  //       (afs) => afs.rule === queryRule
  //     )
  //   }
  //   await this.afsRepository.save(resolveAfs)
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

  async resolve(dto: ApplicationFlaggedSetResolveDto, user: User) {
    // TODO Make it a transaction
    const afs = await this.afsRepository.findOne({
      where: {
        id: dto.afsId,
      },
      join: {
        alias: "AFS",
        leftJoinAndSelect: {
          afs: "AFS.applications",
          afsApplications: "AFS.resolvedApplications",
        },
      },
    })
    if (!afs) {
      throw new NotFoundException()
    }
    afs.resolved = true
    afs.resolvingUserId = user
    afs.resolvedTime = new Date()
    await this.afsRepository.save(afs)
    for (const appId of dto.applicationIds.map((app) => app.id)) {
      const application = await this.applicationsRepository.findOne({
        where: {
          id: appId,
        },
        join: {
          alias: "Application",
          leftJoinAndSelect: {
            afs: "Application.applicationFlaggedSets",
            afsApplications: "afs.applications",
            afsResolvedApplications: "afs.resolvedApplications",
          },
        },
      })
      if (!application) {
        // TODO Abort transaction here
        throw new NotFoundException()
      }
      application.status = ApplicationStatus.duplicate
      for (const afsToBeResolved of application.applicationFlaggedSets) {
        afsToBeResolved.applications = afsToBeResolved.applications.filter(
          (app) => app.id !== application.id
        )
        if (!afsToBeResolved.resolvedApplications.map((app) => app.id).includes(application.id)) {
          afsToBeResolved.resolvedApplications.push(application)
        }
        await this.afsRepository.save(afsToBeResolved)
      }
    }
  }
}
