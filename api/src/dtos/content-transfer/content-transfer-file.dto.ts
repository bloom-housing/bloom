import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { LanguagesEnum, SiteEnum, TranslationOrigin } from '@prisma/client';

export const CONTENT_TRANSFER_FORMAT = 'bloom-content-transfer';
export const CONTENT_TRANSFER_VERSION = 1;

export class ContentTransferTranslation {
  @Expose()
  @ApiProperty({ enum: SiteEnum, enumName: 'SiteEnum', nullable: true })
  site: SiteEnum | null;

  @Expose()
  @ApiProperty({ enum: LanguagesEnum, enumName: 'LanguagesEnum' })
  language: LanguagesEnum;

  @Expose()
  @ApiProperty()
  key: string;

  @Expose()
  @ApiProperty()
  value: string;

  @Expose()
  @ApiProperty({
    enum: TranslationOrigin,
    enumName: 'TranslationOrigin',
    nullable: true,
  })
  origin: TranslationOrigin | null;

  @Expose()
  @ApiProperty({ nullable: true })
  sourceHash: string | null;
}

// Documents are exported as stored, including the `_sourceHashes` that mark stale translations.
export class ContentTransferContent {
  @Expose()
  @ApiProperty({ enum: LanguagesEnum, enumName: 'LanguagesEnum' })
  language: LanguagesEnum;

  @Expose()
  @ApiPropertyOptional({ type: Object, nullable: true })
  footer?: object | null;

  @Expose()
  @ApiPropertyOptional({ type: Object, nullable: true })
  faq?: object | null;

  @Expose()
  @ApiPropertyOptional({ type: Object, nullable: true })
  resources?: object | null;

  @Expose()
  @ApiPropertyOptional({ type: Object, nullable: true })
  disclaimers?: object | null;

  @Expose()
  @ApiPropertyOptional({ type: Object, nullable: true })
  contact?: object | null;
}

export class ContentTransferBrand {
  @Expose()
  @ApiProperty({ type: Object, nullable: true })
  brand: object | null;

  @Expose()
  @ApiProperty({ nullable: true })
  logoFileId: string | null;

  @Expose()
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
