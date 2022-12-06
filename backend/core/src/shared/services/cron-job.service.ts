import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { CronJob } from "../entities/cron-job.entity"

@Injectable()
export class CronJobService {
  constructor(
    @InjectRepository(CronJob)
    private readonly repository: Repository<CronJob>
  ) {}

  getCronJobByName(name: string): Promise<CronJob> {
    return this.repository.findOne({
      where: { name },
    })
  }

  async saveCronJobByName(name: string) {
    const existingCronJob = await this.getCronJobByName(name)
    const cronJobToSave = existingCronJob || { name: name }
    return await this.repository.save({ ...cronJobToSave, lastRunDate: new Date() })
  }
}
