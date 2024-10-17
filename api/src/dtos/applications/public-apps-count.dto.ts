import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PublicAppsCount {
  @Expose()
  @ApiProperty()
  total: number;

  @Expose()
  @ApiProperty()
  lottery: number;

  @Expose()
  @ApiProperty()
  closed: number;

  @Expose()
  @ApiProperty()
  open: number;
}
