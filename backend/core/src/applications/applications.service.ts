import { Injectable } from "@nestjs/common"
import { Application } from "../entity/application.entity"
import { pickBy } from "lodash"

@Injectable()
export class ApplicationsService {
  async find(userId?: string, listingId?: string): Promise<Application[]> {
    return await Application.find(pickBy({ userId, listingId }))
  }
}
