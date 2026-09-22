import { ValidateNested, IsArray } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ListingFeatureCategory } from './listing-features-category.dtos';
import { ListingFeatureField } from './listing-feature-field.dto';

export class ListingFeaturesConfiguration {
  @Expose()
  @ApiPropertyOptional({
    type: ListingFeatureCategory,
    isArray: true,
    description: 'Categorized features (use this or the flat list, not both)',
  })
  @ValidateNested({ each: true, groups: [ValidationsGroupsEnum.default] })
  @Type(() => ListingFeatureCategory)
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  categories?: ListingFeatureCategory[];

  @Expose()
  @ApiPropertyOptional({
    type: ListingFeatureField,
    isArray: true,
    description: 'Flat list of features (use this or the categories, not both)',
  })
  @ValidateNested({ each: true, groups: [ValidationsGroupsEnum.default] })
  @Type(() => ListingFeatureField)
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  fields?: ListingFeatureField[];
}
