import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AssetCreate } from '../assets/asset-create.dto';
import { ListingImage } from './listing-image.dto';
import { ValidateListingPublish } from '../../decorators/validate-listing-publish.decorator';

export class ListingImageCreate extends OmitType(ListingImage, [
  'assets',
  'description',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AssetCreate)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: AssetCreate })
  assets: AssetCreate;

  @Expose()
  @ValidateListingPublish('description', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional()
  description?: string;

  // Needed so class-transformer keeps requiredFields for nested validation
  @Expose()
  requiredFields?: string[];
}
