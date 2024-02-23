import { Expose, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
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
}
