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

  private validateApplicationAgainstAuthWeak(
    application: ApplicationCreateDto | ApplicationUpdateDto
  ) {
    // Allow unauthenticated users or make sure application user matches request authentication
    if (!this.request.user && !application.user) {
      return
    }
    if (application.user && application.user.id === this.request.user.id) {
      return
    }
    throw new UnauthorizedException()
  }

  private validateApplicationAgainstAuthStrong(
    application: ApplicationCreateDto | ApplicationUpdateDto
  ) {
    if (this.request.user && application.user && this.request.user.id == application.user.id) {
      return
    }
    throw new UnauthorizedException()
  }

  async create(applicationCreateDto: ApplicationCreateDto) {
    this.validateApplicationAgainstAuthWeak(applicationCreateDto)
    const application = plainToClass(Application, applicationCreateDto)
    await application.save()
    return application
  }

  async findOne(applicationId: string) {
    return await Application.findOneOrFail({
      where: {
        id: applicationId,
        user: { id: this.request.user.id },
      },
      relations: ["listing", "user"],
    })
  }

  async update(applicationUpdateDto: ApplicationUpdateDto) {
    this.validateApplicationAgainstAuthStrong(applicationUpdateDto)
    const application = await Application.findOneOrFail({
      where: { id: applicationUpdateDto.id, user: { id: this.request.user.id } },
      relations: ["user"],
    })
    Object.assign(application, applicationUpdateDto)
    await application.save()
    return application
  }

  async delete(applicationId: string) {
    await Application.findOneOrFail({
      where: { id: applicationId, user: { id: this.request.user.id } },
      relations: ["user"],
    })
    return await Application.delete({ id: applicationId })
  }
}
