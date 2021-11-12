import { Injectable } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"

@Injectable()
export class CronService {
  @Cron(CronExpression.EVERY_WEEK)
  handleCron() {
    // TODO: add a cron task here.
  }
}
