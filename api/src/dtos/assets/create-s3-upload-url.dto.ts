import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateS3UploadUrl {
  @Expose()
  @ApiProperty()
  fileId: string;

  @Expose()
  @ApiProperty()
  uploadUrl: string;

  @Expose()
  @ApiProperty()
  publicUrl: string;
}
