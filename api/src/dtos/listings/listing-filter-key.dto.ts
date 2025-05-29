// This is a dummy dto created here and added to the listing.controller as an extra model
// to give the FE access to ListingFilterKeys which supports stronger typing throughout
// the filtering process
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ListingFilterKeys } from '../../enums/listings/filter-key-enum';

export class ListingFilterKeyDTO {
  @Expose()
  @ApiPropertyOptional({
    enum: ListingFilterKeys,
    enumName: 'ListingFilterKeys',
  })
  @IsEnum(ListingFilterKeys, {
    groups: [ValidationsGroupsEnum.default],
  })
  value?: ListingFilterKeys;
}
