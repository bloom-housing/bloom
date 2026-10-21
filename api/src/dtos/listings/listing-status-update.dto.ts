import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IdDTO } from '../shared/id.dto';
import { IdOnlyDTO } from '../shared/id-only.dto';
import { IsDefined, IsEnum, ValidateNested } from 'class-validator';
import { ListingsStatusEnum } from '@prisma/client';
import { ValidateListingPublish } from '../../decorators/validate-listing-publish.decorator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ListingUpdateStatus extends IdOnlyDTO {
  @Expose()
  @ValidateListingPublish('status', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsEnum(ListingsStatusEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ListingsStatusEnum,
    enumName: 'ListingsStatusEnum',
  })
  status: ListingsStatusEnum;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiProperty({ type: IdDTO })
  jurisdictions: IdDTO;
}
