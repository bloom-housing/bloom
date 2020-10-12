import { InjectRepository } from "@nestjs/typeorm"
import { AbstractService } from "../shared/abstract-service"
import { ApplicationMethod } from "../entity/application-method.entity"
import { ApplicationMethodCreateDto } from "./application-method.create.dto"
import { ApplicationMethodUpdateDto } from "./application-method.update.dto"
import { Repository } from "typeorm"

export class ApplicationMethodsService extends AbstractService<
  ApplicationMethod,
  ApplicationMethodCreateDto,
  ApplicationMethodUpdateDto
> {
  constructor(
    @InjectRepository(ApplicationMethod)
    protected readonly repository: Repository<ApplicationMethod>
  ) {
    super(repository)
  }
}
