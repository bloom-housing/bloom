import { Inject, Injectable } from "@nestjs/common"
import { Application } from "../entity/application.entity"
import { ABACTypeOrmCrudService } from "../shared/abac-typeorm-crud.service"
import { Repository } from "typeorm"
import { AuthzService } from "../auth/authz.service"
import { InjectRepository } from "@nestjs/typeorm"
import { REQUEST } from "@nestjs/core"

@Injectable()
export class ApplicationsService extends ABACTypeOrmCrudService<Application> {
  public constructor(
    @InjectRepository(Application) public readonly repo: Repository<Application>,
    @Inject(REQUEST) public readonly req,
    public readonly authzService: AuthzService
  ) {
    super(repo, req, authzService, "application")
  }
}
