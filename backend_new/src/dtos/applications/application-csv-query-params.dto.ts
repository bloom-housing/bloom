import { Expose, Transform } from 'class-transformer';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { AbstractDTO } from '../shared/abstract.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ApplicationCsvQueryParams extends OmitType(AbstractDTO, [
  'id',
  'createdAt',
  'updatedAt',
]) {
  @Expose()
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsUUID()
  listingId: string;

  @Expose()
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  timeZone?: string;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value: any) => {
      return value === 'true' || value === true;
    },
    { toClassOnly: true },
  )
  includeDemographics?: boolean;
}
