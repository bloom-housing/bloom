import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SiteEnum } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from './prisma.service';
import { PermissionService } from './permission.service';
import { User } from '../dtos/users/user.dto';
import {
  CONTENT_TRANSFER_FORMAT,
  CONTENT_TRANSFER_VERSION,
  ContentTransferAsset,
  ContentTransferContent,
  ContentTransferFile,
  ContentTransferTranslation,
} from '../dtos/content-transfer/content-transfer-file.dto';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { brandAssetUrl } from '../utilities/brand-asset-url';

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
    for (const type of ['translation', 'jurisdictionContent']) {
      await this.permissionService.canOrThrow(
        user,
        type,
        permissionActions.read,
        { jurisdictionId },
      );
    }

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
        select: {
          language: true,
          footer: true,
          faq: true,
          resources: true,
          disclaimers: true,
          contact: true,
        },
        orderBy: { language: 'asc' },
      }),
    ]);

    const logoFileId = jurisdiction.brandLogo?.fileId ?? null;
    const faviconFileId = jurisdiction.brandFavicon?.fileId ?? null;
    const footerLogoFileIds = content.map(
      (row) =>
        (row.footer as { logo?: { logoFileId?: string } } | null)?.logo
          ?.logoFileId,
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

  // The target environment uses its own bucket, so the file itself goes in the export.
  private async readAsset(fileId: string): Promise<ContentTransferAsset> {
    const url = brandAssetUrl(fileId, 'original');
    try {
      if (!url) throw new Error('no storage url');
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
