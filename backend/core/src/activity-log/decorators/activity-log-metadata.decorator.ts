import { SetMetadata } from "@nestjs/common"
import { ActivityLogMetadataType } from "../types/activity-log-metadata-type"

export const ActivityLogMetadata = (metadata: ActivityLogMetadataType) =>
  SetMetadata("activity_log_metadata", metadata)
