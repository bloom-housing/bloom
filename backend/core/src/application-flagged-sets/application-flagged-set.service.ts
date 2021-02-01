import { Inject, Injectable } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { InjectRepository } from "@nestjs/typeorm"
import { DeepPartial, Repository, SelectQueryBuilder } from "typeorm"
import { Request } from "express"
import {
  ApplicationFlaggedSet,
  FlaggedSetStatus,
  Rule,
} from "./entities/application-flagged-set.entity"
import { paginate } from "nestjs-typeorm-paginate"
import { ApplicationsListQueryParams } from "../applications/applications.controller"
import { Application } from "../applications/entities/application.entity"

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

    const queries: Record<Rule, Application[]> = {
      [Rule.nameAndDOB]: nameDobRuleSet,
      [Rule.email]: [],
      [Rule.address]: [],
    }

    for (const [queryRule, exApplications] of Object.entries(queries)) {
      const visitedAfses = []
      for (const exApplication of exApplications) {
        const afsesMatchingRule = exApplication.applicationFlaggedSets.filter(
          (afs) => afs.rule === queryRule
        )
        if (afsesMatchingRule.length === 0) {
          const newAfs: DeepPartial<ApplicationFlaggedSet> = {
            rule: Rule.nameAndDOB,
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
}
