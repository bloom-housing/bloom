import { ApplicationMethod } from "../entity/application-method.entity"
import { plainToClass } from "class-transformer"
import { ApplicationMethodCreateDto } from "./application-method.create.dto"
import { ApplicationMethodUpdateDto } from "./application-method.update.dto"

export class ApplicationMethodsService {
  async list(): Promise<ApplicationMethod[]> {
    return ApplicationMethod.find()
  }

  async create(applicationMethodDto: ApplicationMethodCreateDto): Promise<ApplicationMethod> {
    const applicationMethod = plainToClass(ApplicationMethod, applicationMethodDto)
    await applicationMethod.save()
    return applicationMethod
  }

  async findOne(applicationMethodId: string): Promise<ApplicationMethod> {
    return ApplicationMethod.findOneOrFail({
      where: {
        id: applicationMethodId,
      },
    })
  }

  async delete(applicationMethodId: string) {
    await ApplicationMethod.delete(applicationMethodId)
  }

  async update(applicationMethodDto: ApplicationMethodUpdateDto) {
    const applicationMethod = await ApplicationMethod.findOneOrFail({
      where: {
        id: applicationMethodDto.id,
      },
    })
    Object.assign(applicationMethod, applicationMethodDto)
    await applicationMethod.save()
    return applicationMethod
  }
}
