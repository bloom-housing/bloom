import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateS3UploadMetadata {
  @Expose()
  @ApiPropertyOptional()
  contentType?: string;

  @Expose()
  @ApiPropertyOptional()
  contentDisposition?: string;
}
