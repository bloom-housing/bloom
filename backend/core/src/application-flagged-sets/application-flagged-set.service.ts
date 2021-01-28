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
    const nameDobRule = await this.repository.find({
      where: {
        firstName: application.applicant.firstName,
        lastName: application.applicant.lastName,
        dob: application.applicant.birthDay,
      },
      relations: ["applications"],
    })

    const emailRule = await this.repository.find({
      where: {
        emailAddress: application.applicant.emailAddress,
      },
      relations: ["applications"],
    })

    console.log("Name and DOB Rule ", nameDobRule)
    console.log("Email Rule ", emailRule)

    return this.repository.save({
      primaryApplicant: null,
      rule: Rule.email,
      resolved: false,
      applications: [{ id: application.id }],
    })
  }
}
