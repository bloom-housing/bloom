import { InjectQueue } from "@nestjs/bull"
import { Injectable } from "@nestjs/common"
import { Queue } from "bull"
import { AFSProcessingQueueNames } from "./constants/applications-flagged-sets-constants"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class ApplicationFlaggedSetsCronjobBoostrapService {
  constructor(
    @InjectQueue(AFSProcessingQueueNames.afsProcessing) private afsProcessingQueue: Queue,
    private readonly config:  ConfigService,
  ) {
    this.afsProcessingQueue.add(
      null,
      {
        repeat: {
          every: +config.get<string>("AFS_PROCESSING_INTERVAL_MS")
        }
      })
  }
}
