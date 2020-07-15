import { Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { Application } from "../entity/application.entity"
import { ApplicationCreateDto } from "./application.create.dto"
import { ApplicationUpdateDto } from "./application.update.dto"
import { plainToClass } from "class-transformer"
import { REQUEST } from "@nestjs/core"
import { ApplicationsListQueryParams } from "./applications.dto"

@Injectable()
export class ApplicationsService {
  constructor(@Inject(REQUEST) private readonly request: any) {}

  async list(params: ApplicationsListQueryParams) {
    return Application.find({
      where: {
        user: { id: this.request.user.id },
        // Workaround for params.listingId resulting in:
        // listing: {id: undefined}
        // and query responding with 0 applications.
        ...(params.listingId && { listing: { id: params.listingId } }),
      },
      relations: ["listing", "user"],
    })
  }

  async create(applicationCreateDto: ApplicationCreateDto) {
    if (applicationCreateDto.user.id !== this.request.user.id) {
      throw new UnauthorizedException()
    }
    const application = plainToClass(Application, applicationCreateDto)
    await application.save()
    return application
  }

  async findOne(applicationId: string) {
    return await Application.findOneOrFail({
      where: {
        id: applicationId,
        user: { id: this.request.user.id },
        relations: ["listing", "user"],
      },
    })
  }

  async update(applicationUpdateDto: ApplicationUpdateDto) {
    if (applicationUpdateDto.user.id !== this.request.user.id) {
      throw new UnauthorizedException()
    }
    const application = plainToClass(Application, applicationUpdateDto)
    await application.save()
    return application
  }

  async delete(applicationId: string) {
    const application = await Application.findOneOrFail({
      where: { id: applicationId },
      relations: ["user"],
    })
    if (application.user.id !== this.request.user.id) {
      throw new UnauthorizedException()
    }
    return await Application.delete({ id: applicationId })
  }
}
