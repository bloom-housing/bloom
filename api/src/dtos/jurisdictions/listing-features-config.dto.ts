import { IsString, ValidateNested, IsArray, IsBoolean } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../../src/enums/shared/validation-groups-enum';

export class ListingFeatureField {
  @Expose()
  @ApiProperty({
    example: 'wheelchairRamp',
  })
  @IsString()
  id: string;
}

export class ListingFeatureCategory {
  @Expose()
  @ApiProperty({
    example: 'mobility',
  })
  @IsString()
  id: string;

  @Expose()
  @ApiProperty({
    type: ListingFeatureField,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => ListingFeatureField)
  @IsArray()
  fields: ListingFeatureField[];

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  required?: boolean;
}

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
