import { Injectable } from "@nestjs/common"
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { ApplicationMethod } from "../entity/application-method.entity"

@Injectable()
export class ApplicationMethodsService extends TypeOrmCrudService<ApplicationMethod> {
  constructor(@InjectRepository(ApplicationMethod) repo) {
    super(repo)
  }
}
