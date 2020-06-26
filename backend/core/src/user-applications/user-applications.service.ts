import { Injectable, UseGuards } from "@nestjs/common"
import { Application } from "../entity/application.entity"
import { ApplicationCreateDto } from "./application.create.dto"
import { ApplicationUpdateDto } from "./application.update.dto"
import { plainToClass } from "class-transformer"

@Injectable()
export class UserApplicationsService {
  async list(userId: string) {
    return Application.find({ userId: userId })
  }

  async create(userId: string, applicationCreateDto: ApplicationCreateDto) {
    const application = plainToClass(Application, applicationCreateDto)
    await application.save()
    return application
  }

  async findOne(userId: string, applicationId: string) {
    return Application.findOneOrFail({ userId: userId, id: applicationId })
  }

  async update(applicationUpdateDto: ApplicationUpdateDto) {
    const application = plainToClass(Application, applicationUpdateDto)
    await application.save()
    return application
  }

  async delete(userId: string, applicationId: string) {
    return Application.delete({ userId: userId, id: applicationId })
  }
}
