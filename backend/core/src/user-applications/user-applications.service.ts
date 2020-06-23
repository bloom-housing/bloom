import { Injectable } from "@nestjs/common"
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
  }

  async findOne(userId: string, applicationId: string) {
    return Application.findOne({ userId: userId, id: applicationId })
  }

  async update(applicationUpdateDto: ApplicationUpdateDto) {
    const application = plainToClass(Application, applicationUpdateDto)
    await application.save()
  }

  async delete(userId: string, applicationId: string) {
    return Application.findOne({ userId: userId, id: applicationId })
  }
}
