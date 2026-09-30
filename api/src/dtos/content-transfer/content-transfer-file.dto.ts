import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { LanguagesEnum, SiteEnum, TranslationOrigin } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export const CONTENT_TRANSFER_FORMAT = 'bloom-content-transfer';
export const CONTENT_TRANSFER_VERSION = 1;

export class ContentTransferTranslation {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(SiteEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: SiteEnum, enumName: 'SiteEnum', nullable: true })
  site: SiteEnum | null;

  @Expose()
  @IsEnum(LanguagesEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: LanguagesEnum, enumName: 'LanguagesEnum' })
  language: LanguagesEnum;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  key: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  value: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(TranslationOrigin, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: TranslationOrigin,
    enumName: 'TranslationOrigin',
    nullable: true,
  })
  origin: TranslationOrigin | null;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ nullable: true })
  sourceHash: string | null;
}

// Documents are exported as stored, including the `_sourceHashes` that mark stale translations.
export class ContentTransferContent {
  @Expose()
  @IsEnum(LanguagesEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: LanguagesEnum, enumName: 'LanguagesEnum' })
  language: LanguagesEnum;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsObject({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ type: Object, nullable: true })
  footer?: object | null;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsObject({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ type: Object, nullable: true })
  faq?: object | null;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsObject({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ type: Object, nullable: true })
  resources?: object | null;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsObject({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ type: Object, nullable: true })
  disclaimers?: object | null;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsObject({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ type: Object, nullable: true })
  contact?: object | null;
}

export class ContentTransferBrand {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsObject({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: Object, nullable: true })
  brand: object | null;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ nullable: true })
  logoFileId: string | null;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ nullable: true })
  faviconFileId: string | null;
}

// An uploaded file the export references by its source storage key.
export class ContentTransferAsset {
  @Expose()
  @ApiProperty()
  fileId: string;

  @Expose()
  @ApiProperty()
  contentType: string;

  @Expose()
  @ApiProperty({ description: 'The file, base64 encoded' })
  data: string;
}

export class ContentTransferFile {
  @Expose()
  @ApiProperty({ example: CONTENT_TRANSFER_FORMAT })
  format: string;

  @Expose()
  @ApiProperty({ example: CONTENT_TRANSFER_VERSION })
  version: number;

  @Expose()
  @Type(() => Date)
  @ApiProperty()
  exportedAt: Date;

  // Null for an export of the global strings.
  @Expose()
  @ApiProperty({ nullable: true })
  jurisdictionName: string | null;

  @Expose()
  @Type(() => ContentTransferTranslation)
  @ApiProperty({ type: ContentTransferTranslation, isArray: true })
  translations: ContentTransferTranslation[];

  @Expose()
  @Type(() => ContentTransferContent)
  @ApiPropertyOptional({ type: ContentTransferContent, isArray: true })
  content?: ContentTransferContent[];

  @Expose()
  @Type(() => ContentTransferBrand)
  @ApiPropertyOptional({ type: ContentTransferBrand })
  brand?: ContentTransferBrand;

  @Expose()
  @Type(() => ContentTransferAsset)
  @ApiProperty({ type: ContentTransferAsset, isArray: true })
  assets: ContentTransferAsset[];
}

// The file as the import sends it. The browser uploads the files first and sends their new
// storage keys in `fileIds`, keyed by the source key.
export class ContentTransferImport {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ example: CONTENT_TRANSFER_FORMAT })
  format: string;

  @Expose()
  @IsInt({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ example: CONTENT_TRANSFER_VERSION })
  version: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ nullable: true })
  jurisdictionName: string | null;

  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ContentTransferTranslation)
  @ApiProperty({ type: ContentTransferTranslation, isArray: true })
  translations: ContentTransferTranslation[];

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ContentTransferContent)
  @ApiPropertyOptional({ type: ContentTransferContent, isArray: true })
  content?: ContentTransferContent[];

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ContentTransferBrand)
  @ApiPropertyOptional({ type: ContentTransferBrand })
  brand?: ContentTransferBrand;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsObject({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: { type: 'string' },
  })
  fileIds?: Record<string, string>;
}

export enum ContentTransferChange {
  added = 'added',
  changed = 'changed',
  removed = 'removed',
}

export class ContentTransferTranslationChanges {
  @Expose()
  @ApiProperty({ enum: SiteEnum, enumName: 'SiteEnum', nullable: true })
  site: SiteEnum | null;

  @Expose()
  @ApiProperty({ enum: LanguagesEnum, enumName: 'LanguagesEnum' })
  language: LanguagesEnum;

  @Expose()
  @ApiProperty()
  added: number;

  @Expose()
  @ApiProperty()
  changed: number;

  @Expose()
  @ApiProperty()
  removed: number;
}

export class ContentTransferContentChange {
  @Expose()
  @ApiProperty({ enum: LanguagesEnum, enumName: 'LanguagesEnum' })
  language: LanguagesEnum;

  @Expose()
  @ApiProperty({
    enum: ContentTransferChange,
    enumName: 'ContentTransferChange',
  })
  change: ContentTransferChange;
}

export class ContentTransferBrandChanges {
  // Top-level brand settings whose value differs, such as `primary` or `fontFamily`.
  @Expose()
  @ApiProperty({ type: String, isArray: true })
  fields: string[];

  @Expose()
  @ApiProperty({
    enum: ContentTransferChange,
    enumName: 'ContentTransferChange',
    nullable: true,
  })
  logo: ContentTransferChange | null;

  @Expose()
  @ApiProperty({
    enum: ContentTransferChange,
    enumName: 'ContentTransferChange',
    nullable: true,
  })
  favicon: ContentTransferChange | null;
}

export class ContentTransferPreview {
  @Expose()
  @ApiProperty({ nullable: true })
  jurisdictionName: string | null;

  @Expose()
  @ApiProperty({ type: ContentTransferTranslationChanges, isArray: true })
  translations: ContentTransferTranslationChanges[];

  @Expose()
  @ApiProperty({ type: ContentTransferContentChange, isArray: true })
  content: ContentTransferContentChange[];

  @Expose()
  @ApiPropertyOptional({ type: ContentTransferBrandChanges })
  brand?: ContentTransferBrandChanges;
}
