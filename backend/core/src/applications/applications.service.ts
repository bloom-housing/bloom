import { Injectable } from "@nestjs/common"
import { Application } from "../entity/application.entity"

@Injectable()
export class ApplicationsService {
  async find(userId?: string, listingId?: string): Promise<Application[]> {
    return await Application.find({ userId, listingId })
  }
}
