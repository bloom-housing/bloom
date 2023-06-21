import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ListingViews } from '../../enums/listings/view-enum';

export class ListingsRetrieveParams {
  @Expose()
  @ApiProperty({
    enum: ListingViews,
    required: false,
    enumName: 'ListingViews',
    example: 'full',
  })
  @IsEnum(ListingViews, {
    groups: [ValidationsGroupsEnum.default],
  })
  view?: ListingViews;
}
