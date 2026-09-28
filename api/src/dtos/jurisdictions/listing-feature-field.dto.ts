import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListingFeatureField {
  @Expose()
  @ApiProperty({
    example: 'wheelchairRamp',
  })
  @IsString()
  id: string;
}
