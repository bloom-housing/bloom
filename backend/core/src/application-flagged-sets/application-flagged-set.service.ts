import { Inject, Injectable } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { InjectRepository } from "@nestjs/typeorm"
import { DeepPartial, In, Repository, SelectQueryBuilder } from "typeorm"
import { Request } from "express"
import {
  ApplicationFlaggedSet,
  FlaggedSetStatus,
  Rule,
} from "./entities/application-flagged-set.entity"
import { paginate } from "nestjs-typeorm-paginate"
import { ApplicationsListQueryParams } from "../applications/applications.controller"
import { Application } from "../applications/entities/application.entity"
import { ApplicationFlaggedSetUpdateDto } from "./dto/application-flagged-set.dto"
import { createQueryBuilder } from "typeorm"

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

  async handleInsert(newApplication: Application) {
    const nameDobRuleSet = await this.applicationsRepository.find({
      where: (qb: SelectQueryBuilder<Application>) => {
        qb.where("Application.id != :id", {
          id: newApplication.id,
        })
          .andWhere("Application.listing.id = :listingId", {
            listingId: newApplication.listing.id,
          })
          .andWhere("Application__applicant.firstName = :firstName", {
            firstName: newApplication.applicant.firstName,
          })
          .andWhere("Application__applicant.lastName = :lastName", {
            lastName: newApplication.applicant.lastName,
          })
          .andWhere("Application__applicant.birthMonth = :birthMonth", {
            birthMonth: newApplication.applicant.birthMonth,
          })
          .andWhere("Application__applicant.birthDay = :birthDay", {
            birthDay: newApplication.applicant.birthDay,
          })
          .andWhere("Application__applicant.birthYear = :birthYear", {
            birthYear: newApplication.applicant.birthYear,
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
