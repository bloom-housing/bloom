import { Inject, Injectable } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, SelectQueryBuilder } from "typeorm"
import { Request } from "express"
import { ApplicationFlaggedSet } from "./entities/application-flagged-set.entity"
import { paginate } from "nestjs-typeorm-paginate"
import { ApplicationsListQueryParams } from "../applications/applications.controller"
import { Application } from "../applications/entities/application.entity"

@Injectable()
export class ApplicationFlaggedSetService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(ApplicationFlaggedSet)
    private readonly repository: Repository<ApplicationFlaggedSet>,
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>
  ) {}

  private getQueryBuilder() {
    return this.applicationsRepository
      .createQueryBuilder("application")
      .leftJoinAndSelect("application.applicant", "applicant")
  }

  async list(params: ApplicationsListQueryParams) {
    return paginate(
      this.repository,
      { limit: params.limit, page: params.page },
      {
        relations: ["applications"],
      }
    )
  }

  async handleInsert(application: Application) {
    console.log("Whats in Application ??", application)
    const nameDobRule = await this.applicationsRepository.find({
      where: (qb: SelectQueryBuilder<Application>) => {
        qb.where("Application__applicant.firstName = :firstName", {
          firstName: application.applicant.firstName,
        })
        qb.andWhere("Application__applicant.lastName = :lastName", {
          lastName: application.applicant.lastName,
        })
        qb.andWhere("Application__applicant.birthMonth = :birthMonth", {
          birthMonth: application.applicant.birthMonth,
        })
        qb.andWhere("Application__applicant.birthDay = :birthDay", {
          birthDay: application.applicant.birthDay,
        })
        qb.andWhere("Application__applicant.birthYear = :birthYear", {
          birthYear: application.applicant.birthYear,
        })
        qb.andWhere("Application.status = :status", { status: "submitted" })
      },
    })
    nameDobRule["rule"] = "Name and DOB"

    const emailRule = await this.applicationsRepository.find({
      where: (qb: SelectQueryBuilder<Application>) => {
        qb.where("Application__applicant.emailAddress = :emailAddress", {
          emailAddress: application.applicant.emailAddress,
        })
        qb.andWhere("Application.status = :status", { status: "submitted" })
      },
    })
    emailRule["rule"] = "Email"

    // console.log("Name and DOB Rule Data", nameDobRule)
    // console.log("Email Rule Data", emailRule)

    // testing purpose only
    let primaryApplicant = null
    let rule = null
    const duplicateApplications = []
    for (const apps of nameDobRule) {
      primaryApplicant = apps.applicant.id
      rule = nameDobRule["rule"]
      duplicateApplications.push(apps.id)
      console.log("APPLICATIONSSSS ", duplicateApplications)
    }

    return this.repository.save({
      primaryApplicant: primaryApplicant,
      rule: rule,
      resolved: false,
      applications: duplicateApplications,
    })
  }
}
