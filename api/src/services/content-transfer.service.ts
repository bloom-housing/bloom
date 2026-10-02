import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { LanguagesEnum, Prisma, SiteEnum } from '@prisma/client';
import { validate } from 'class-validator';
import * as lodash from 'lodash';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from './prisma.service';
import { PermissionService } from './permission.service';
import {
  assertFileIdsAreUsable,
  brandAssetWrite,
  storableBrand,
} from './jurisdiction.service';
import {
  CONTENT_FIELDS,
  CONTENT_SELECT,
  footerLogo,
  withoutDerivedLogoSrc,
} from './jurisdiction-content.service';
import { User } from '../dtos/users/user.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { JurisdictionContentFields } from '../dtos/jurisdiction-content/jurisdiction-content-fields.dto';
import { JurisdictionBrandUpdate } from '../dtos/jurisdictions/jurisdiction-brand-update.dto';
import {
  CONTENT_TRANSFER_FORMAT,
  CONTENT_TRANSFER_VERSION,
  ContentTransferAsset,
  ContentTransferBrandChanges,
  ContentTransferChange,
  ContentTransferContent,
  ContentTransferContentChange,
  ContentTransferFile,
  ContentTransferImport,
  ContentTransferPreview,
  ContentTransferTranslation,
  ContentTransferTranslationChanges,
} from '../dtos/content-transfer/content-transfer-file.dto';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { ValidationsGroupsEnum } from '../enums/shared/validation-groups-enum';
import { brandAssetUrl, isUsableFileId } from '../utilities/brand-asset-url';
import { assertFontIsAvailable } from '../utilities/font-availability';
import { mapTo } from '../utilities/mapTo';
import { sourceHash } from '../utilities/translation-source-hash';

const ASSET_TIMEOUT_MS = 10000;

const GLOBAL_SITES = [SiteEnum.partners, SiteEnum.email];

const TRANSLATION_SELECT = {
  site: true,
  language: true,
  key: true,
  value: true,
  origin: true,
  sourceHash: true,
} as const;

const TRANSLATION_ORDER = [
  { site: 'asc' },
  { language: 'asc' },
  { key: 'asc' },
] as const;

// The footer logo editor's limit, applied to the key an upload produced.
const MAX_FILE_ID_LENGTH = 256;

type ContentField = (typeof CONTENT_FIELDS)[number];

const SOURCE_HASHES = '_sourceHashes';
const SOURCE_HASH = /^[0-9a-f]{64}$/;

type ImportedBrand = {
  brand: Prisma.InputJsonObject | typeof Prisma.DbNull;
  logoFileId: string | null;
  faviconFileId: string | null;
};

type TargetJurisdiction = {
  id: string;
  brand: Prisma.JsonValue;
  brandLogo: { fileId: string } | null;
  brandFavicon: { fileId: string } | null;
};

type PreparedImport = {
  jurisdictionId: string | null;
  jurisdictionName: string | null;
  target?: TargetJurisdiction;
  translations: ContentTransferTranslation[];
  content?: ContentTransferContent[];
  brand?: ImportedBrand;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const plain = (value: unknown): unknown =>
  JSON.parse(JSON.stringify(value ?? null));

// Sanitizing turns a missing html field into null, and the editors read null as unset.
const withoutNulls = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(withoutNulls);
  if (!isPlainObject(value)) return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, child]) => child !== null)
      .map(([key, child]) => [key, withoutNulls(child)]),
  );
};

const footerLogoFileId = (footer: unknown): string | undefined =>
  footerLogo(footer)?.logoFileId;

const invalid = (message: string) => new BadRequestException(message);

// Removes `_sourceHashes` at every depth, after checking that each one maps a field the object has to a hash.
const withoutSourceHashes = (value: unknown, path: string): unknown => {
  if (Array.isArray(value)) {
    return value.map((item, index) =>
      withoutSourceHashes(item, `${path}[${index}]`),
    );
  }
  if (!isPlainObject(value)) return value;

  const result: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === SOURCE_HASHES) {
      const wellFormed =
        isPlainObject(child) &&
        Object.entries(child).every(
          ([field, hash]) =>
            Object.prototype.hasOwnProperty.call(value, field) &&
            typeof hash === 'string' &&
            SOURCE_HASH.test(hash),
        );
      if (!wellFormed) throw invalid(`${path} has malformed source hashes`);
      continue;
    }
    result[key] = withoutSourceHashes(child, `${path}.${key}`);
  }
  return result;
};

// Storage keys differ between environments, so a footer logo's key is left out of comparisons.
const withoutLogoKey = (footer: unknown): unknown => {
  if (!isPlainObject(footer) || !isPlainObject(footer.logo)) return footer;
  const { logoFileId, [SOURCE_HASHES]: hashes, ...logo } = footer.logo;
  void logoFileId;
  const otherHashes = isPlainObject(hashes)
    ? lodash.omit(hashes, 'logoFileId')
    : {};
  return {
    ...footer,
    logo: Object.keys(otherHashes).length
      ? { ...logo, [SOURCE_HASHES]: otherHashes }
      : logo,
  };
};

const asJson = (value: unknown) =>
  value == null ? Prisma.DbNull : (value as Prisma.InputJsonValue);

const translationKey = (row: {
  site?: SiteEnum | null;
  language: LanguagesEnum;
  key: string;
}) => `${row.site ?? ''}|${row.language}|${row.key}`;

@Injectable()
export class ContentTransferService {
  constructor(
    private prisma: PrismaService,
    private readonly permissionService: PermissionService,
    private readonly httpService: HttpService,
  ) {}

  async exportJurisdiction(
    jurisdictionId: string,
    user: User,
  ): Promise<ContentTransferFile> {
    await Promise.all(
      ['translation', 'jurisdictionContent'].map((type) =>
        this.permissionService.canOrThrow(user, type, permissionActions.read, {
          jurisdictionId,
        }),
      ),
    );

    const jurisdiction = await this.prisma.jurisdictions.findFirst({
      where: { id: jurisdictionId },
      select: {
        name: true,
        brand: true,
        brandLogo: { select: { fileId: true } },
        brandFavicon: { select: { fileId: true } },
      },
    });
    if (!jurisdiction) {
      throw new NotFoundException(
        `jurisdiction ${jurisdictionId} was requested but not found`,
      );
    }

    const [translations, content] = await Promise.all([
      this.prisma.translationStrings.findMany({
        where: { jurisdictionId },
        select: TRANSLATION_SELECT,
        orderBy: [...TRANSLATION_ORDER],
      }),
      this.prisma.jurisdictionContent.findMany({
        where: { jurisdictionId },
        select: { language: true, ...CONTENT_SELECT },
        orderBy: { language: 'asc' },
      }),
    ]);

    const logoFileId = jurisdiction.brandLogo?.fileId ?? null;
    const faviconFileId = jurisdiction.brandFavicon?.fileId ?? null;
    const footerLogoFileIds = content.map((row) =>
      footerLogoFileId(row.footer),
    );
    const fileIds = [
      ...new Set(
        [logoFileId, faviconFileId, ...footerLogoFileIds].filter(
          (fileId): fileId is string => !!fileId,
        ),
      ),
    ];

    return {
      format: CONTENT_TRANSFER_FORMAT,
      version: CONTENT_TRANSFER_VERSION,
      exportedAt: new Date(),
      jurisdictionName: jurisdiction.name,
      translations: translations as ContentTransferTranslation[],
      content: content as ContentTransferContent[],
      brand: {
        brand: (jurisdiction.brand as object | null) ?? null,
        logoFileId,
        faviconFileId,
      },
      assets: await Promise.all(
        fileIds.map((fileId) => this.readAsset(fileId)),
      ),
    };
  }

  async exportGlobal(user: User): Promise<ContentTransferFile> {
    await this.permissionService.canOrThrow(
      user,
      'translation',
      permissionActions.read,
      { jurisdictionId: undefined },
    );

    const translations = await this.prisma.translationStrings.findMany({
      where: { jurisdictionId: null, site: { in: GLOBAL_SITES } },
      select: TRANSLATION_SELECT,
      orderBy: [...TRANSLATION_ORDER],
    });

    return {
      format: CONTENT_TRANSFER_FORMAT,
      version: CONTENT_TRANSFER_VERSION,
      exportedAt: new Date(),
      jurisdictionName: null,
      translations: translations as ContentTransferTranslation[],
      assets: [],
    };
  }

  async previewImport(
    dto: ContentTransferImport,
    user: User,
  ): Promise<ContentTransferPreview> {
    const prepared = await this.prepareImport(dto, user);
    const [translations, content, brand] = await Promise.all([
      this.translationChanges(prepared),
      this.contentChanges(prepared),
      this.brandChanges(prepared),
    ]);
    return {
      jurisdictionName: prepared.jurisdictionName,
      translations,
      content,
      ...(brand ? { brand } : {}),
    };
  }

  async applyImport(
    dto: ContentTransferImport,
    user: User,
  ): Promise<SuccessDTO> {
    const prepared = await this.prepareImport(dto, user);
    const uploadedKey = this.uploadedKeys(prepared, dto.fileIds ?? {});
    await this.prisma.$transaction(this.importWrites(prepared, uploadedKey));
    return { success: true };
  }

  private async prepareImport(
    dto: ContentTransferImport,
    user: User,
  ): Promise<PreparedImport> {
    if (
      dto.format !== CONTENT_TRANSFER_FORMAT ||
      dto.version !== CONTENT_TRANSFER_VERSION
    ) {
      throw invalid(
        `the file is not a version ${CONTENT_TRANSFER_VERSION} ${CONTENT_TRANSFER_FORMAT} export`,
      );
    }

    let target: TargetJurisdiction | undefined;
    if (dto.jurisdictionName) {
      target = await this.prisma.jurisdictions.findFirst({
        where: { name: dto.jurisdictionName },
        select: {
          id: true,
          brand: true,
          brandLogo: { select: { fileId: true } },
          brandFavicon: { select: { fileId: true } },
        },
      });
      if (!target) {
        throw invalid(
          `jurisdiction ${dto.jurisdictionName} does not exist in this environment`,
        );
      }
    }
    const jurisdictionId = target?.id ?? null;

    const types = jurisdictionId
      ? ['translation', 'jurisdictionContent', 'jurisdiction']
      : ['translation'];
    await Promise.all(
      types.map((type) =>
        this.permissionService.canOrThrow(
          user,
          type,
          permissionActions.update,
          {
            jurisdictionId: jurisdictionId ?? undefined,
          },
        ),
      ),
    );

    this.assertTranslations(dto.translations, jurisdictionId);

    return {
      jurisdictionId,
      jurisdictionName: dto.jurisdictionName ?? null,
      target,
      translations: dto.translations,
      ...(jurisdictionId && dto.content
        ? { content: await this.checkedContent(dto.content) }
        : {}),
      ...(jurisdictionId && dto.brand
        ? { brand: await this.checkedBrand(dto.brand) }
        : {}),
    };
  }

  private assertTranslations(
    rows: ContentTransferTranslation[],
    jurisdictionId: string | null,
  ): void {
    const seen = new Set<string>();

    for (const row of rows) {
      const name = translationKey(row);
      if (seen.has(name)) throw invalid(`translation ${name} appears twice`);
      seen.add(name);

      if (!jurisdictionId && !GLOBAL_SITES.some((site) => site === row.site)) {
        throw invalid(
          `global translation ${name} is not for the partners or email site`,
        );
      }
    }
  }

  // A document is imported only if the content editor would store it unchanged.
  private async checkedContent(
    rows: ContentTransferContent[],
  ): Promise<ContentTransferContent[]> {
    const seen = new Set<LanguagesEnum>();

    for (const row of rows) {
      if (seen.has(row.language)) {
        throw invalid(`content for ${row.language} appears twice`);
      }
      seen.add(row.language);

      for (const field of CONTENT_FIELDS) {
        if (row[field] == null) continue;
        const path = `content ${row.language}.${field}`;
        const document = withoutSourceHashes(row[field], path);
        const mapped = mapTo(JurisdictionContentFields, { [field]: document });
        const errors = await validate(mapped, {
          groups: [ValidationsGroupsEnum.default],
          skipMissingProperties: true,
          forbidUnknownValues: false,
        });
        if (
          errors.length ||
          !lodash.isEqual(
            withoutNulls(plain(mapped[field])),
            withoutNulls(plain(document)),
          )
        ) {
          throw invalid(
            `${path} does not match what the content editor stores`,
          );
        }
      }

      assertFileIdsAreUsable([footerLogoFileId(row.footer)]);
    }
    return rows.map((row) => withoutDerivedLogoSrc(row));
  }

  private async checkedBrand(
    incoming: ContentTransferImport['brand'],
  ): Promise<ImportedBrand> {
    const update = mapTo(JurisdictionBrandUpdate, {
      brand: incoming.brand ?? null,
    });
    const errors = await validate(update, {
      groups: [ValidationsGroupsEnum.default],
      skipMissingProperties: true,
      forbidUnknownValues: false,
    });
    if (errors.length) throw invalid('the brand is not valid');
    await assertFontIsAvailable(this.httpService, update.brand);

    assertFileIdsAreUsable([incoming.logoFileId, incoming.faviconFileId]);
    return {
      brand: storableBrand(update.brand) ?? Prisma.DbNull,
      logoFileId: incoming.logoFileId ?? null,
      faviconFileId: incoming.faviconFileId ?? null,
    };
  }

  private uploadedKeys(
    prepared: PreparedImport,
    fileIds: Record<string, string>,
  ): (sourceKey: string | null) => string | null {
    const referenced = [
      prepared.brand?.logoFileId,
      prepared.brand?.faviconFileId,
      ...(prepared.content ?? []).map((row) => footerLogoFileId(row.footer)),
    ].filter((fileId): fileId is string => !!fileId);

    for (const sourceKey of referenced) {
      const key = fileIds[sourceKey];
      if (
        typeof key !== 'string' ||
        key.length > MAX_FILE_ID_LENGTH ||
        !isUsableFileId(key)
      ) {
        throw invalid(`file ${sourceKey} was not uploaded`);
      }
    }
    return (sourceKey) => (sourceKey ? fileIds[sourceKey] : null);
  }

  private translationScope(
    jurisdictionId: string | null,
  ): Prisma.TranslationStringsWhereInput {
    return jurisdictionId
      ? { jurisdictionId }
      : { jurisdictionId: null, site: { in: GLOBAL_SITES } };
  }

  private importWrites(
    prepared: PreparedImport,
    uploadedKey: (sourceKey: string | null) => string | null,
  ): Prisma.PrismaPromise<unknown>[] {
    const { jurisdictionId, content, brand } = prepared;
    const writes: Prisma.PrismaPromise<unknown>[] = [
      this.prisma.translationStrings.deleteMany({
        where: this.translationScope(jurisdictionId),
      }),
      this.prisma.translationStrings.createMany({
        data: prepared.translations.map((row) => ({
          jurisdictionId,
          site: row.site ?? null,
          language: row.language,
          key: row.key,
          value: row.value,
          origin: row.origin ?? null,
          sourceHash: row.sourceHash ?? null,
        })),
      }),
    ];

    if (jurisdictionId && content) {
      const englishKey = footerLogoFileId(
        content.find((row) => row.language === LanguagesEnum.en)?.footer,
      );
      const withUploadedLogo = (footer: unknown) => {
        const sourceKey = footerLogoFileId(footer);
        if (!sourceKey) return footer;
        const typed = footer as { logo: Record<string, unknown> };
        const hashes = typed.logo[SOURCE_HASHES] as
          | Record<string, unknown>
          | undefined;
        const current =
          !!englishKey && hashes?.logoFileId === sourceHash(englishKey);
        return {
          ...typed,
          logo: {
            ...typed.logo,
            logoFileId: uploadedKey(sourceKey),
            ...(current
              ? {
                  [SOURCE_HASHES]: {
                    ...hashes,
                    logoFileId: sourceHash(uploadedKey(englishKey)),
                  },
                }
              : {}),
          },
        };
      };
      writes.push(
        this.prisma.jurisdictionContent.deleteMany({
          where: { jurisdictionId },
        }),
        this.prisma.jurisdictionContent.createMany({
          data: content.map((row) => ({
            jurisdictionId,
            language: row.language,
            ...(Object.fromEntries(
              CONTENT_FIELDS.map((field) => [
                field,
                asJson(
                  field === 'footer'
                    ? withUploadedLogo(row.footer)
                    : row[field],
                ),
              ]),
            ) as Record<ContentField, Prisma.InputJsonValue>),
          })),
        }),
      );
    }

    if (jurisdictionId && brand) {
      writes.push(
        this.prisma.jurisdictions.update({
          where: { id: jurisdictionId },
          data: {
            brand: brand.brand,
            brandLogo: brandAssetWrite(
              uploadedKey(brand.logoFileId),
              'brandLogo',
            ),
            brandFavicon: brandAssetWrite(
              uploadedKey(brand.faviconFileId),
              'brandFavicon',
            ),
          },
        }),
      );
    }
    return writes;
  }

  private async translationChanges(
    prepared: PreparedImport,
  ): Promise<ContentTransferTranslationChanges[]> {
    const current = await this.prisma.translationStrings.findMany({
      where: this.translationScope(prepared.jurisdictionId),
      select: TRANSLATION_SELECT,
    });

    const groups = new Map<string, ContentTransferTranslationChanges>();
    const count = (
      row: { site?: SiteEnum | null; language: LanguagesEnum },
      change: ContentTransferChange,
    ) => {
      const name = `${row.site ?? ''}|${row.language}`;
      const group = groups.get(name) ?? {
        site: row.site ?? null,
        language: row.language,
        added: 0,
        changed: 0,
        removed: 0,
      };
      group[change] += 1;
      groups.set(name, group);
    };

    const currentByKey = new Map(
      current.map((row) => [translationKey(row), row]),
    );
    const incomingKeys = new Set<string>();
    for (const row of prepared.translations) {
      incomingKeys.add(translationKey(row));
      const existing = currentByKey.get(translationKey(row));
      if (!existing) count(row, ContentTransferChange.added);
      else if (
        existing.value !== row.value ||
        (existing.origin ?? null) !== (row.origin ?? null) ||
        (existing.sourceHash ?? null) !== (row.sourceHash ?? null)
      ) {
        count(row, ContentTransferChange.changed);
      }
    }
    for (const row of current) {
      if (!incomingKeys.has(translationKey(row))) {
        count(row, ContentTransferChange.removed);
      }
    }

    return [...groups.values()].sort((a, b) =>
      `${a.site ?? ''}|${a.language}`.localeCompare(
        `${b.site ?? ''}|${b.language}`,
      ),
    );
  }

  private async contentChanges(
    prepared: PreparedImport,
  ): Promise<ContentTransferContentChange[]> {
    if (!prepared.jurisdictionId || !prepared.content) return [];

    const current = await this.prisma.jurisdictionContent.findMany({
      where: { jurisdictionId: prepared.jurisdictionId },
      select: { language: true, ...CONTENT_SELECT },
    });
    const comparable = (
      row: Partial<Record<ContentField, unknown>>,
      field: ContentField,
    ) => plain(field === 'footer' ? withoutLogoKey(row[field]) : row[field]);
    const currentByLanguage = new Map(
      current.map((row) => [row.language, row]),
    );
    const incomingLanguages = new Set(
      prepared.content.map((row) => row.language),
    );

    const changes: ContentTransferContentChange[] = [];
    for (const row of prepared.content) {
      const existing = currentByLanguage.get(row.language);
      if (!existing) {
        changes.push({
          language: row.language,
          change: ContentTransferChange.added,
        });
      } else if (
        CONTENT_FIELDS.some(
          (field) =>
            !lodash.isEqual(
              comparable(row, field),
              comparable(existing, field),
            ),
        )
      ) {
        changes.push({
          language: row.language,
          change: ContentTransferChange.changed,
        });
      }
    }
    for (const row of current) {
      if (!incomingLanguages.has(row.language)) {
        changes.push({
          language: row.language,
          change: ContentTransferChange.removed,
        });
      }
    }
    return changes.sort((a, b) => a.language.localeCompare(b.language));
  }

  private async brandChanges(
    prepared: PreparedImport,
  ): Promise<ContentTransferBrandChanges | undefined> {
    if (!prepared.target || !prepared.brand) return undefined;

    const current = prepared.target;
    const incomingBrand = isPlainObject(prepared.brand.brand)
      ? prepared.brand.brand
      : {};
    const currentBrand = isPlainObject(current.brand) ? current.brand : {};
    const fields = [
      ...new Set([...Object.keys(incomingBrand), ...Object.keys(currentBrand)]),
    ]
      .filter(
        (field) =>
          !lodash.isEqual(
            plain(incomingBrand[field]),
            plain(currentBrand[field]),
          ),
      )
      .sort();

    // Storage keys differ between environments, so a file present on both sides counts as changed.
    const fileChange = (incoming: string | null, existing?: string | null) => {
      if (incoming && existing) return ContentTransferChange.changed;
      if (incoming) return ContentTransferChange.added;
      if (existing) return ContentTransferChange.removed;
      return null;
    };

    return {
      fields,
      logo: fileChange(prepared.brand.logoFileId, current.brandLogo?.fileId),
      favicon: fileChange(
        prepared.brand.faviconFileId,
        current.brandFavicon?.fileId,
      ),
    };
  }

  // The target environment uses its own bucket, so the file itself goes in the export.
  private async readAsset(fileId: string): Promise<ContentTransferAsset> {
    const url = brandAssetUrl(fileId, 'original');
    if (!url) {
      throw new BadGatewayException(`file ${fileId} has no storage url`);
    }
    try {
      const response = await firstValueFrom(
        this.httpService.get<ArrayBuffer>(url, {
          responseType: 'arraybuffer',
          timeout: ASSET_TIMEOUT_MS,
        }),
      );
      return {
        fileId,
        contentType: String(
          response.headers['content-type'] ?? 'application/octet-stream',
        ),
        data: Buffer.from(response.data).toString('base64'),
      };
    } catch {
      throw new BadGatewayException(
        `file ${fileId} could not be read from storage`,
      );
    }
  }
}
