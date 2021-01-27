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
    private readonly repository: Repository<ApplicationFlaggedSet>
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
    return this.repository.save({
      primaryApplicant: null,
      rule: Rule.email,
      resolved: false,
      applications: [{ id: application.id }],
    })
  }
}
