import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreatePresignedUploadMetadataResponse {
  @Expose()
  @ApiProperty()
  signature: string;
}
