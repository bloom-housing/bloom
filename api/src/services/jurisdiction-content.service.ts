import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LanguagesEnum, Prisma } from '@prisma/client';
import { validate } from 'class-validator';
import { PrismaService } from './prisma.service';
import { PermissionService } from './permission.service';
import { User } from '../dtos/users/user.dto';
import { JurisdictionContent } from '../dtos/jurisdiction-content/jurisdiction-content.dto';
import { JurisdictionContentFields } from '../dtos/jurisdiction-content/jurisdiction-content-fields.dto';
import { JurisdictionContentUpdate } from '../dtos/jurisdiction-content/jurisdiction-content-update.dto';
import { mergeContent, MergeableContent } from '../utilities/content-merge';
import { mapTo } from '../utilities/mapTo';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { ValidationsGroupsEnum } from '../enums/shared/validation-groups-enum';

const CONTENT_SELECT = {
  footer: true,
  faq: true,
  resources: true,
  disclaimers: true,
  contact: true,
} as const;

@Injectable()
export class JurisdictionContentService {
  constructor(
    private prisma: PrismaService,
    private readonly permissionService: PermissionService,
  ) {}

  // Public read: the jurisdiction's content for a language
  public async getMergedContent(
    jurisdictionId: string,
    language?: LanguagesEnum,
  ): Promise<JurisdictionContentFields | null> {
    await this.resolveJurisdictionId({ id: jurisdictionId }, jurisdictionId);

    const useLanguage = !!language && language !== LanguagesEnum.en;
    const languages = useLanguage
      ? [LanguagesEnum.en, language]
      : [LanguagesEnum.en];

    const rows = await this.prisma.jurisdictionContent.findMany({
      where: { jurisdictionId, language: { in: languages } },
      select: { language: true, ...CONTENT_SELECT },
    });
    if (!rows.length) {
      return null;
    }

    const contentFor = (lang: LanguagesEnum): MergeableContent =>
      (rows.find((row) => row.language === lang) as MergeableContent) ?? {};

    const merged = mergeContent(
      contentFor(LanguagesEnum.en),
      useLanguage ? contentFor(language) : undefined,
    );
    const mapped = mapTo(JurisdictionContentFields, merged);
    await this.warnOnShapeMismatch(mapped, jurisdictionId, language);
    return mapped;
  }

  public async getMergedContentByName(
    jurisdictionName: string,
    language?: LanguagesEnum,
  ): Promise<JurisdictionContentFields | null> {
    const jurisdictionId = await this.resolveJurisdictionId(
      { name: jurisdictionName },
      jurisdictionName,
    );
    return this.getMergedContent(jurisdictionId, language);
  }

  // Admin: every content row for the jurisdiction, one per language, for the editor's language list.
  public async listContent(
    jurisdictionId: string,
    user: User,
  ): Promise<JurisdictionContent[]> {
    await this.authorizeJurisdiction(
      user,
      jurisdictionId,
      permissionActions.read,
    );
    const rows = await this.prisma.jurisdictionContent.findMany({
      where: { jurisdictionId },
      orderBy: { language: 'asc' },
    });
    return mapTo(JurisdictionContent, rows);
  }

  // Admin: one language's row
  public async getContent(
    jurisdictionId: string,
    language: LanguagesEnum,
    user: User,
  ): Promise<JurisdictionContent | null> {
    await this.authorizeJurisdiction(
      user,
      jurisdictionId,
      permissionActions.read,
    );
    const row = await this.prisma.jurisdictionContent.findFirst({
      where: { jurisdictionId, language },
    });
    return row ? mapTo(JurisdictionContent, row) : null;
  }

  // Admin: upsert one (jurisdiction, language) row
  public async updateContent(
    jurisdictionId: string,
    language: LanguagesEnum,
    dto: JurisdictionContentUpdate,
    user: User,
  ): Promise<JurisdictionContent> {
    await this.authorizeJurisdiction(
      user,
      jurisdictionId,
      permissionActions.update,
    );

    const where = { jurisdictionId, language };
    const data = this.contentData(dto);

    if (dto.lastUpdatedAt) {
      const result = await this.prisma.jurisdictionContent.updateMany({
        where: { ...where, updatedAt: dto.lastUpdatedAt },
        data,
      });
      if (result.count === 0) {
        // The row either moved since the client read it (a conflict) or was deleted; in the latter
        // case re-create it, treating a concurrent create as a conflict too.
        const exists = await this.prisma.jurisdictionContent.findFirst({
          where,
          select: { id: true },
        });
        if (exists || !(await this.createIfAbsent(where, data))) {
          throw new ConflictException({
            message: 'jurisdictionContentConflict',
          });
        }
      }
    } else if (!(await this.createIfAbsent(where, data))) {
      // No lock sent, but a row already exists: another writer created it first.
      throw new ConflictException({ message: 'jurisdictionContentConflict' });
    }

    const row = await this.prisma.jurisdictionContent.findFirst({ where });
    return mapTo(JurisdictionContent, row);
  }

  private contentData(
    dto: JurisdictionContentUpdate,
  ): Prisma.JurisdictionContentUncheckedUpdateManyInput {
    const asJson = (value: unknown) =>
      value == null
        ? Prisma.DbNull
        : (JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue);
    return {
      footer: asJson(dto.footer),
      faq: asJson(dto.faq),
      resources: asJson(dto.resources),
      disclaimers: asJson(dto.disclaimers),
      contact: asJson(dto.contact),
    };
  }

  // Creates the row, returning false if another writer created the same (jurisdiction, language)
  // first
  private async createIfAbsent(
    where: { jurisdictionId: string; language: LanguagesEnum },
    data: Prisma.JurisdictionContentUncheckedUpdateManyInput,
  ): Promise<boolean> {
    try {
      await this.prisma.jurisdictionContent.create({
        data: {
          ...where,
          ...data,
        } as Prisma.JurisdictionContentUncheckedCreateInput,
      });
      return true;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return false;
      }
      throw error;
    }
  }

  private async authorizeJurisdiction(
    user: User,
    jurisdictionId: string,
    action: permissionActions,
  ): Promise<void> {
    await this.permissionService.canOrThrow(
      user,
      'jurisdictionContent',
      action,
      {
        jurisdictionId,
      },
    );
    await this.resolveJurisdictionId({ id: jurisdictionId }, jurisdictionId);
  }

  private async resolveJurisdictionId(
    where: Prisma.JurisdictionsWhereInput,
    label: string,
  ): Promise<string> {
    const jurisdiction = await this.prisma.jurisdictions.findFirst({
      where,
      select: { id: true },
    });
    if (!jurisdiction) {
      throw new NotFoundException(
        `jurisdiction ${label} was requested but not found`,
      );
    }
    return jurisdiction.id;
  }

  // Read-time guard: content is stored as unconstrained JSON, so a hand-edited or malformed row can
  // drift from the DTO shape. Log a warning rather than throw, so a bad row degrades to a warning
  // instead of a broken page.
  private async warnOnShapeMismatch(
    content: JurisdictionContentFields,
    jurisdictionId: string,
    language?: LanguagesEnum,
  ): Promise<void> {
    const errors = await validate(content, {
      groups: [ValidationsGroupsEnum.default],
      skipMissingProperties: false,
      forbidUnknownValues: false,
    });
    if (errors.length) {
      console.warn(
        `jurisdiction content for ${jurisdictionId} (${
          language ?? LanguagesEnum.en
        }) does not match the expected shape: ${errors
          .map((error) => error.property)
          .join(', ')}`,
      );
    }
  }
}
