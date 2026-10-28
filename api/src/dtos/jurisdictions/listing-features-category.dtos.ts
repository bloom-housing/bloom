import { IsString, ValidateNested, IsArray, IsBoolean } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../../src/enums/shared/validation-groups-enum';
import { ListingFeatureField } from './listing-feature-field.dto';

export class ListingFeatureCategory {
  @Expose()
  @ApiProperty({
    example: 'mobility',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  id: string;

  @Expose()
  @ApiProperty({
    type: ListingFeatureField,
    isArray: true,
  })
  @ValidateNested({ each: true, groups: [ValidationsGroupsEnum.default] })
  @Type(() => ListingFeatureField)
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  fields: ListingFeatureField[];

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  required?: boolean;
}
