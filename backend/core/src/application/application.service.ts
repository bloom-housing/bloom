import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Application } from "../entity/application.entity"
import { Repository } from "typeorm"

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application) private readonly applicationRepo: Repository<Application>
  ) {}
  async find(userId?: string, listingId?: string): Promise<Application[]> {
    return await this.applicationRepo.find({ userId, listingId })
  }
}
