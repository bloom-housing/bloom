import { Expose, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ApplicationCsvQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsUUID()
  id: string;

  @Expose()
  @ApiPropertyOptional({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (obj: any) => {
      return obj.value === 'true' || obj.value === true;
    },
    { toClassOnly: true },
  )
  includeDemographics?: boolean;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: process.env.TIME_ZONE,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  timeZone?: string;
}
