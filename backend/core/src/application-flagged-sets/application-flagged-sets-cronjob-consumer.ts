import { OnQueueActive, Process, Processor } from "@nestjs/bull"
import { AFSProcessingQueueNames } from "./constants/applications-flagged-sets-constants"
import { Job } from "bull"

@Processor(AFSProcessingQueueNames.afsProcessing)
export class ApplicationFlaggedSetsCronjobConsumer {
  @Process()
  async process(job: Job<unknown>) {

  }
}
