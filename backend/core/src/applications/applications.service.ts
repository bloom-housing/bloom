import { Inject, Injectable } from "@nestjs/common"
import { Application } from "../entity/application.entity"
import { ApplicationCreateDto } from "./application.create.dto"
import { ApplicationUpdateDto } from "./application.update.dto"
import { plainToClass } from "class-transformer"
import { ApplicationsListQueryParams } from "./applications.dto"
import { User } from "../entity/user.entity"
import { REQUEST } from "@nestjs/core"

@Injectable()
export class ApplicationsService {
  constructor(@Inject(REQUEST) private readonly request: any) {}

  async list(params: ApplicationsListQueryParams, user?: User) {
    return Application.find({
      where: {
        ...(user && { user: { id: user.id } }),
        // Workaround for params.listingId resulting in:
        // listing: {id: undefined}
        // and query responding with 0 applications.
        ...(params.listingId && { listing: { id: params.listingId } }),
      },
      relations: ["listing", "user"],
    })
  }

  async create(applicationCreateDto: ApplicationCreateDto, user?: User) {
    const application = plainToClass(Application, applicationCreateDto)
    application.user = user
    await application.save()
    return application
  }

  async findOne(applicationId: string) {
    return await Application.findOneOrFail({
      where: {
        id: applicationId,
      },
      relations: ["listing", "user"],
    })
  }

  async update(applicationUpdateDto: ApplicationUpdateDto, existing?: Application) {
    const application =
      existing ||
      (await Application.findOneOrFail({
        where: { id: applicationUpdateDto.id },
        relations: ["user"],
      }))
    Object.assign(application, applicationUpdateDto)
    await application.save()
    return application
  }

  async delete(applicationId: string) {
    return await Application.delete({ id: applicationId })
  }
}
