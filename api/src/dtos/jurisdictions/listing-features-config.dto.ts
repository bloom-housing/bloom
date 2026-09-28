import { ValidateNested, IsArray } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ListingFeatureCategory } from './listing-features-category.dtos';
import { ListingFeatureField } from './listing-feature-field.dto';

export class ListingFeaturesConfiguration {
  @Expose()
  @ApiPropertyOptional({
    type: ListingFeatureCategory,
    isArray: true,
    description: 'Categorized features (use this or the flat list, not both)',
  })
  @ValidateNested({ each: true })
  @Type(() => ListingFeatureCategory)
  @IsArray()
  categories?: ListingFeatureCategory[];

  @Expose()
  @ApiPropertyOptional({
    type: ListingFeatureField,
    isArray: true,
    description: 'Flat list of features (use this or the categories, not both)',
  })
  @ValidateNested({ each: true })
  @Type(() => ListingFeatureField)
  @IsArray()
  fields?: ListingFeatureField[];
}
