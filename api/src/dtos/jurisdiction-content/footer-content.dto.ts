import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { sanitize } from '../../decorators/sanitize-html.decorator';
import { IsSafeUrl } from '../../decorators/is-safe-url.decorator';

// Sanitizes each rich-text entry of a string array, leaving non-strings untouched.
const sanitizeArray = () =>
  Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((entry) =>
          typeof entry === 'string' ? sanitize(entry) : entry,
        )
      : value,
  );

export class FooterLinkDTO {
  // Stable id so a language row's link merges over the English link by identity.
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  id: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  text: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsSafeUrl({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  href: string;

  // Tombstone: a non-English row sets this to drop the English link from the merge.
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  _deleted?: boolean;
}

export class FooterLogoDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsSafeUrl({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  logoSrc: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  logoAltText?: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsSafeUrl({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  logoUrl?: string;
}

export class FooterContentDTO {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(256, { groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @sanitizeArray()
  @ApiPropertyOptional({ type: [String] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default], each: true })
  textSectionsHtml?: string[];

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(256, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => FooterLinkDTO)
  @ApiPropertyOptional({ type: FooterLinkDTO, isArray: true })
  links?: FooterLinkDTO[];

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => FooterLogoDTO)
  @ApiPropertyOptional({ type: FooterLogoDTO })
  logo?: FooterLogoDTO;
}
