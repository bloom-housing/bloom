import { Expose, Transform, Type } from 'class-transformer';
import {
  IsDefined,
  IsHexColor,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

const toUpperHex = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.toUpperCase() : value;

export class BrandRampDTO {
  @Expose()
  @Transform(toUpperHex)
  @IsHexColor({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ example: '#773E98' })
  base: string;

  @Expose()
  @Transform(toUpperHex)
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsHexColor({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ example: '#693786' })
  dark?: string;

  @Expose()
  @Transform(toUpperHex)
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsHexColor({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ example: '#4C2861' })
  darker?: string;

  @Expose()
  @Transform(toUpperHex)
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsHexColor({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ example: '#EFE6F5' })
  light?: string;

  @Expose()
  @Transform(toUpperHex)
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsHexColor({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ example: '#F8F4FB' })
  lighter?: string;
}

export class BrandDTO {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => BrandRampDTO)
  @ApiProperty({ type: BrandRampDTO })
  primary: BrandRampDTO;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => BrandRampDTO)
  @ApiPropertyOptional({ type: BrandRampDTO })
  secondary?: BrandRampDTO;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ example: 'Inter' })
  fontFamily?: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUrl({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    example: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
  })
  fontUrl?: string;

  // Response-only: built from the asset foreign keys at read time, never stored.
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  logoUrl?: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  faviconUrl?: string;
}
