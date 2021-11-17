import { Injectable } from "@nestjs/common"
import { User } from "../../auth/entities/user.entity"
import { ActivityLog } from "../entities/activity-log.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly repository: Repository<ActivityLog>
  ) {}
  public async log(module: string, action: string, recordId: string, user: User) {
    return await this.repository.save({ module, action, recordId, user })
  }
}
