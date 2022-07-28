import { InjectQueue } from "@nestjs/bull"
import { Injectable } from "@nestjs/common"
import { Queue } from "bull"
import { AFSProcessingQueueNames } from "./constants/applications-flagged-sets-constants"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class ApplicationFlaggedSetsCronjobBoostrapService {
  constructor(
    @InjectQueue(AFSProcessingQueueNames.afsProcessing) private afsProcessingQueue: Queue,
    private readonly config: ConfigService
  ) {
    void this.afsProcessingQueue.add(null, {
      repeat: {
        cron: config.get<string>("AFS_PROCESSING_CRON_STRING"),
      },
      // NOTE: This is not unique on purpose because Bull will not add a job twice with an ID
      //  which already exists.
      id: "afs-process",
    })
  }
}
