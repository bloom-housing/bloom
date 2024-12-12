import { Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ListingViews } from '../../enums/listings/view-enum';

export class ListingsRetrieveParams {
  @Expose()
  @ApiPropertyOptional({
    enum: ListingViews,
    enumName: 'ListingViews',
    example: 'full',
  })
  @IsEnum(ListingViews, {
    groups: [ValidationsGroupsEnum.default],
  })
  view?: ListingViews;

  @Expose()
  @ApiPropertyOptional({
    type: Boolean,
    example: true,
  })
  combined?: boolean;
}
