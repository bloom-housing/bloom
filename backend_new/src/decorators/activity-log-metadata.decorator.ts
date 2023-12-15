import { SetMetadata } from '@nestjs/common';

export type ActivityLogMetadataType = Array<{
  targetPropertyName: string;
  propertyPath: string;
}>;

export const ActivityLogMetadata = (metadata: ActivityLogMetadataType) =>
  SetMetadata('activity_log_metadata', metadata);
