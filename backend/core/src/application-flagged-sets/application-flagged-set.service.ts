import { Inject, Injectable } from "@nestjs/common"
import { REQUEST } from "@nestjs/core"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Request } from "express"
import { ApplicationFlaggedSet, Rule } from "./entities/application-flagged-set.entity"
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

    // Pulls all the duplicate applications with same Name and DOB
    // I will optimize the query to get the FirstName + LastName and DOB as mm/dd/yyyy in one where clause
    const nameDobRule = await this.applicationsRepository
      .createQueryBuilder("applications")
      .leftJoinAndSelect("applications.applicant", "applicant")
      .where("applicant.firstName = :firstName", { firstName: application.applicant.firstName })
      .andWhere("applicant.lastName = :lastName", { lastName: application.applicant.lastName })
      .andWhere("applicant.birthMonth = :birthMonth", { birthMonth: application.applicant.birthMonth })
      .andWhere("applicant.birthDay = :birthDay", { birthDay: application.applicant.birthDay })
      .andWhere("applicant.birthYear = :birthYear", { birthYear: application.applicant.birthYear })
      .getMany()

    // Pulls all the duplicate applications with Email Address
    const emailRule = await this.applicationsRepository
      .createQueryBuilder("applications")
      .leftJoinAndSelect("applications.applicant", "applicant")
      .where("applicant.emailAddress = :emailAddress", { emailAddress: application.applicant.emailAddress })
      .getMany()

    console.log("Name and DOB Rule Data", nameDobRule)
    console.log("Email Rule Data", emailRule)

    return this.repository.save({
      primaryApplicant: null,
      rule: Rule.email,
      resolved: false,
      applications: [{ id: application.id }],
    })
  }
}
