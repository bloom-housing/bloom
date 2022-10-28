import { InjectQueue } from "@nestjs/bull"
import { Inject, Injectable, Logger } from "@nestjs/common"
import { Queue } from "bull"
import { AFSProcessingQueueNames } from "./constants/applications-flagged-sets-constants"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class ApplicationFlaggedSetsCronjobBoostrapService {
  constructor(
    @InjectQueue(AFSProcessingQueueNames.afsProcessing) private afsProcessingQueue: Queue,
    private readonly config: ConfigService,
    @Inject(Logger)
    private readonly logger = new Logger(ApplicationFlaggedSetsCronjobBoostrapService.name)
  ) {
    const repeatCron = this.config.get<string>("AFS_PROCESSING_CRON_STRING")
    this.logger.warn(`Setting up AFS processing cron to frequency ${repeatCron}`)
    void this.afsProcessingQueue.empty()
    void this.afsProcessingQueue.add(null, {
      repeat: {
        cron: repeatCron,
      },
    })
  }
}
