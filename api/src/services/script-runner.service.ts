import {
  Injectable,
  BadRequestException,
  NotImplementedException,
  Inject,
  Logger,
} from '@nestjs/common';
import {
  ListingsStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
  Prisma,
  ReviewOrderTypeEnum,
} from '@prisma/client';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import dayjs from 'dayjs';
import { Request as ExpressRequest } from 'express';
import { AmiChartService } from './ami-chart.service';
import { EmailService } from './email.service';
import { FeatureFlagService } from './feature-flag.service';
import { MultiselectQuestionService } from './multiselect-question.service';
import { PrismaService } from './prisma.service';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { User } from '../dtos/users/user.dto';
import { mapTo } from '../utilities/mapTo';
import { BulkApplicationResendDTO } from '../dtos/script-runner/bulk-application-resend.dto';
import { Application } from '../dtos/applications/application.dto';
import { ApplicationMultiselectQuestion } from '../dtos/applications/application-multiselect-question.dto';
import { AmiChartImportDTO } from '../dtos/script-runner/ami-chart-import.dto';
import { AmiChartCreate } from '../dtos/ami-charts/ami-chart-create.dto';
import { AmiChartUpdate } from '../dtos/ami-charts/ami-chart-update.dto';
import MultiselectQuestion from '../dtos/multiselect-questions/multiselect-question.dto';
import { MultiselectOption } from '../dtos/multiselect-questions/multiselect-option.dto';
import { AmiChartUpdateImportDTO } from '../dtos/script-runner/ami-chart-update-import.dto';
import { calculateSkip, calculateTake } from '../utilities/pagination-helpers';

const TRANSLATION_FETCH_TIMEOUT_MS = 30_000;

/**
  this is the service for running scripts
  most functions in here will be unique, but each function should only be allowed to fire once
*/
@Injectable()
export class ScriptRunnerService {
  constructor(
    private amiChartService: AmiChartService,
    private emailService: EmailService,
    private featureFlagService: FeatureFlagService,
    private multiselectQuestionService: MultiselectQuestionService,
    private prisma: PrismaService,
    private httpService: HttpService,
    @Inject(Logger)
    private logger = new Logger(ScriptRunnerService.name),
  ) {}

  /**
   *
   * @param req incoming request object
   * @param bulkApplicationResendDTO bulk resend arg. Should contain listing id
   * @returns successDTO
   * @description resends a confirmation email to all applicants on a listing with an email
   */
  async bulkApplicationResend(
    req: ExpressRequest,
    bulkApplicationResendDTO: BulkApplicationResendDTO,
  ): Promise<SuccessDTO> {
    // script runner standard start up
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart('bulk application resend', requestingUser);

    // gather listing data
    const listing = await this.prisma.listings.findUnique({
      select: {
        id: true,
        jurisdictions: {
          select: {
            id: true,
          },
        },
      },
      where: {
        id: bulkApplicationResendDTO.listingId,
      },
    });

    if (!listing || !listing.jurisdictions) {
      throw new BadRequestException('Listing does not exist');
    }

    // gather up all applications for that listing
    const rawApplications = await this.prisma.applications.findMany({
      select: {
        id: true,
        language: true,
        confirmationCode: true,
        applicant: {
          select: {
            id: true,
            emailAddress: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      },
      where: {
        listingId: bulkApplicationResendDTO.listingId,
        deletedAt: null,
        applicant: {
          emailAddress: {
            not: null,
          },
        },
      },
    });
    const applications = mapTo(Application, rawApplications);

    // send emails
    for (const application of applications) {
      await this.emailService.applicationScriptRunner(
        mapTo(Application, application),
        { id: listing.jurisdictions.id },
      );
    }

    // script runner standard spin down
    await this.markScriptAsComplete('bulk application resend', requestingUser);
    return { success: true };
  }

  /**
   *
   * @param amiChartImportDTO this is a string in a very specific format like:
   * percentOfAmiValue_1 householdSize_1_income_value householdSize_2_income_value \n percentOfAmiValue_2 householdSize_1_income_value householdSize_2_income_value
   *
   * Copying and pasting from google sheets will not match the format above. You will need to perform the following:
   * 1) Find and delete all instances of "%"
   * 2) Using the Regex option in the Find and Replace tool, replace /\t with " " and /\n with "\\n"
   * See "How to format AMI data for script runner import" in Notion for a more detailed example
   * @returns successDTO
   * @description takes the incoming AMI Chart string and stores it as a new AMI Chart in the database
   */
  async amiChartImport(
    req: ExpressRequest,
    amiChartImportDTO: AmiChartImportDTO,
  ): Promise<SuccessDTO> {
    // script runner standard start up
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      `AMI Chart ${amiChartImportDTO.name}`,
      requestingUser,
    );

    // parse incoming string into an amichart create dto
    const createDTO: AmiChartCreate = {
      items: [],
      name: amiChartImportDTO.name,
      jurisdictions: {
        id: amiChartImportDTO.jurisdictionId,
      },
    };

    const rows = amiChartImportDTO.values.split('\n');
    rows.forEach((row: string) => {
      const values = row.split(' ');
      const percentage = values[0];
      values.forEach((value: string, index: number) => {
        if (index > 0) {
          createDTO.items.push({
            percentOfAmi: Number(percentage),
            householdSize: index,
            income: Number(value),
          });
        }
      });
    });

    await this.amiChartService.create(createDTO);

    // script runner standard spin down
    await this.markScriptAsComplete(
      `AMI Chart ${amiChartImportDTO.name}`,
      requestingUser,
    );
    return { success: true };
  }

  /**
   *
   * @param amiChartUpdateImportDTO this is a string in a very specific format like:
   * percentOfAmiValue_1 householdSize_1_income_value householdSize_2_income_value \n percentOfAmiValue_2 householdSize_1_income_value householdSize_2_income_value
   *
   * Copying and pasting from google sheets will not match the format above. You will need to perform the following:
   * 1) Find and delete all instances of "%"
   * 2) Using the Regex option in the Find and Replace tool, replace /\t with " " and /\n with "\\n"
   * See "How to format AMI data for script runner import" in Notion for a more detailed example
   * @returns successDTO
   * @description takes the incoming AMI Chart string and updates existing AMI Chart in the database
   */
  async amiChartUpdateImport(
    req: ExpressRequest,
    amiChartUpdateImportDTO: AmiChartUpdateImportDTO,
  ): Promise<SuccessDTO> {
    // script runner standard start up
    const scriptName = `AMI Chart ${
      amiChartUpdateImportDTO.amiId
    } update ${new Date()}`;
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(scriptName, requestingUser);

    const ami = await this.amiChartService.findOne(
      amiChartUpdateImportDTO.amiId,
    );

    // parse incoming string into an amichart create dto
    const updateDTO: AmiChartUpdate = {
      id: amiChartUpdateImportDTO.amiId,
      items: [],
      name: ami.name,
    };

    const rows = amiChartUpdateImportDTO.values.split('\n');
    rows.forEach((row: string) => {
      const values = row.split(' ');
      const percentage = values[0];
      values.forEach((value: string, index: number) => {
        if (index > 0) {
          updateDTO.items.push({
            percentOfAmi: Number(percentage),
            householdSize: index,
            income: Number(value),
          });
        }
      });
    });

    await this.amiChartService.update(updateDTO);

    // script runner standard spin down
    await this.markScriptAsComplete(scriptName, requestingUser);
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @returns successDTO
   * @description opts out existing lottery listings
   */
  async optOutExistingLotteries(req: ExpressRequest): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      'opt out existing lotteries',
      requestingUser,
    );

    const { count } = await this.prisma.listings.updateMany({
      data: {
        lotteryOptIn: false,
      },
      where: {
        reviewOrderType: ReviewOrderTypeEnum.lottery,
        lotteryOptIn: null,
      },
    });

    console.log(`updated lottery opt in for ${count} listings`);

    await this.markScriptAsComplete(
      'opt out existing lotteries',
      requestingUser,
    );
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @param jurisdictionIdDTO id containing the jurisdiction id we are creating the new community type for
   * @param name name of the community type
   * @param name description of the community type
   * @returns successDTO
   * @description creates a new reserved community type. Reserved community types also need translations added
   */
  async createNewReservedCommunityType(
    req: ExpressRequest,
    jurisdictionId: string,
    name: string,
    description?: string,
  ): Promise<SuccessDTO> {
    // script runner standard start up
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(`${name} Type`, requestingUser);

    // create new reserved community type using the passed in params
    await this.prisma.reservedCommunityTypes.create({
      data: {
        name: name,
        description: description,
        jurisdictions: {
          connect: {
            id: jurisdictionId,
          },
        },
      },
    });

    // script runner standard spin down
    await this.markScriptAsComplete(`${name} Type`, requestingUser);
    return { success: true };
  }

  /**
    Marks all program multiselect questions as hidden from listings so they don't show on the public site details page
  */
  async hideProgramsFromListings(req: ExpressRequest): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart('hideProgramsFromListings', requestingUser);
    await this.prisma.multiselectQuestions.updateMany({
      data: {
        hideFromListing: true,
      },
      where: {
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
      },
    });
    await this.markScriptAsComplete('hideProgramsFromListings', requestingUser);
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @returns successDTO
   * @description Adds all existing feature flags across Bloom to the database
   */
  async addFeatureFlags(req: ExpressRequest): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart('add feature flags', requestingUser);

    const results = await Promise.all(
      this.featureFlags.map(async (flag) => {
        try {
          await this.featureFlagService.create(flag);
        } catch (e) {
          console.log(
            `feature flag ${flag.name} failed to be created. Error: ${e}`,
          );
        }
      }),
    );

    console.log(`Number of feature flags created: ${results.length}`);

    await this.markScriptAsComplete('add feature flags', requestingUser);
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @returns successDTO
   * @description migrates the preferences and programs in Detroit to the multiselectQuestions table
   */
  async migrateDetroitToMultiselectQuestions(
    req: ExpressRequest,
  ): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      'migrate Detroit to multiselect questions',
      requestingUser,
    );
    const translationURLs = [
      {
        url: 'https://raw.githubusercontent.com/bloom-housing/bloom/dev/ui-components/src/locales/general.json',
        key: 'generalCore',
      },
      {
        url: 'https://raw.githubusercontent.com/bloom-housing/bloom/dev/sites/partners/page_content/locale_overrides/general.json',
        key: 'generalPartners',
      },
      {
        url: 'https://raw.githubusercontent.com/bloom-housing/bloom/dev/sites/public/page_content/locale_overrides/general.json',
        key: 'generalPublic',
      },
      {
        url: 'https://raw.githubusercontent.com/CityOfDetroit/bloom/9f2084c107ec865e3c13393e600a5ac45ee5f424/detroit-ui-components/src/locales/general.json',
        key: 'detroitCore',
      },
      {
        url: 'https://raw.githubusercontent.com/CityOfDetroit/bloom/dev/sites/partners/src/page_content/locale_overrides/general.json',
        key: 'detroitPartners',
      },
      {
        url: 'https://raw.githubusercontent.com/CityOfDetroit/bloom/dev/sites/public/src/page_content/locale_overrides/general.json',
        key: 'detroitPublic',
      },
    ];

    const translations = {};

    for (let i = 0; i < translationURLs.length; i++) {
      const { url, key } = translationURLs[i];
      translations[key] = await this.getTranslationFile(url);
    }

    // begin migration from preferences
    const preferences: {
      id;
      title;
      subtitle;
      description;
      links;
      form_metadata;
    }[] = await this.prisma.$queryRawUnsafe(`
      SELECT 
        p.id,
        p.title,
        p.subtitle,
        p.description,
        p.links,
        p.form_metadata
      FROM preferences p
    `);

    for (let i = 0; i < preferences.length; i++) {
      const pref = preferences[i];
      const jurisInfo: { id; name }[] = await this.prisma.$queryRawUnsafe(`
          SELECT
            j.id,
            j.name
          FROM jurisdictions_preferences_preferences jp
            JOIN jurisdictions j ON jp.jurisdictions_id = j.id
          WHERE jp.preferences_id = '${pref.id}'
      `);
      const { optOutText, options } = this.resolveOptionValues(
        pref.form_metadata,
        'preferences',
        jurisInfo?.length ? jurisInfo[0].name : '',
        translations,
      );
      await this.multiselectQuestionService.create(
        {
          text: pref.title,
          subText: pref.subtitle,
          description: pref.description,
          links: pref.links ?? null,
          hideFromListing: this.resolveHideFromListings(pref),
          optOutText: optOutText ?? null,
          options: options,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.preferences,
          jurisdictions: jurisInfo.map((juris) => {
            return { id: juris.id };
          }),
          status: 'draft',
        },
        requestingUser,
      );
    }

    // begin migration from programs
    const programs: {
      id;
      title;
      subtitle;
      description;
      form_metadata;
    }[] = await this.prisma.$queryRawUnsafe(`
      SELECT 
        p.id,
        p.title,
        p.subtitle,
        p.description,
        p.form_metadata
      FROM programs p
    `);

    for (let i = 0; i < programs.length; i++) {
      const prog = programs[i];
      const jurisInfo: { id; name }[] = await this.prisma.$queryRawUnsafe(`
          SELECT
            j.id,
            j.name
          FROM jurisdictions_programs_programs jp
            JOIN jurisdictions j ON jp.jurisdictions_id = j.id
          WHERE jp.programs_id = '${prog.id}'
        `);

      const res: MultiselectQuestion =
        await this.multiselectQuestionService.create(
          {
            text: prog.title,
            subText: prog.subtitle,
            description: prog.description,
            links: null,
            hideFromListing: this.resolveHideFromListings(prog),
            optOutText: null,
            options: null,
            applicationSection:
              MultiselectQuestionsApplicationSectionEnum.programs,
            jurisdictions: jurisInfo.map((juris) => {
              return { id: juris.id };
            }),
            status: 'draft',
          },
          requestingUser,
        );

      const listingsInfo: { ordinal; listing_id }[] = await this.prisma
        .$queryRawUnsafe(`
        SELECT
          ordinal,
          listing_id
        FROM listing_programs
        WHERE program_id = '${prog.id}';
      `);
      for (const listingInfo of listingsInfo) {
        await this.prisma.listings.update({
          data: {
            listingMultiselectQuestions: {
              create: {
                ordinal: listingInfo.ordinal,
                multiselectQuestionId: res.id,
              },
            },
          },
          where: {
            id: listingInfo.listing_id,
          },
        });
      }
    }

    await this.markScriptAsComplete(
      'migrate Detroit to multiselect questions',
      requestingUser,
    );
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @returns successDTO
   * @description pulls in all multiselect questions, updates new fields
   * and moves option data out of JSON format and into MultiselectOptions table
   */
  async migrateMultiselectDataToRefactor(
    req: ExpressRequest,
  ): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      'migrate multiselect data to refactor',
      requestingUser,
    );

    const multiselectQuestions =
      await this.prisma.multiselectQuestions.findMany({
        include: {
          listings: {
            include: {
              listings: {
                select: {
                  status: true,
                },
              },
            },
          },
        },
      });

    for (const msq of multiselectQuestions) {
      const id = msq.id;

      const hasPublishedListing = msq.listings.some(({ listings }) => {
        return (
          listings.status === ListingsStatusEnum.active ||
          listings.status === ListingsStatusEnum.closed
        );
      });
      const status: MultiselectQuestionsStatusEnum = hasPublishedListing
        ? MultiselectQuestionsStatusEnum.active
        : MultiselectQuestionsStatusEnum.visible;

      const options = msq.options as unknown[] as MultiselectOption[];

      const isExclusive = options.some((options) => {
        return options.exclusive;
      });
      await this.prisma.multiselectQuestions.update({
        data: { isExclusive: isExclusive, status: status },
        where: { id: id },
      });

      await this.prisma.multiselectOptions.createMany({
        data: options.map((option) => {
          return {
            description:
              option.description?.trim() === '' ? null : option.description,
            isOptOut: false,
            links: option.links
              ? (option.links as unknown as Prisma.InputJsonArray)
              : undefined,
            mapLayerId: option.mapLayerId,
            mapPinPosition: option.mapPinPosition,
            multiselectQuestionId: id,
            name: option.text,
            ordinal: option.ordinal,
            radiusSize: option.radiusSize,
            shouldCollectAddress: option.collectAddress,
            shouldCollectName: option.collectName,
            shouldCollectRelationship: option.collectRelationship,
            validationMethod: option.validationMethod,
          };
        }),
      });

      if (msq.optOutText) {
        await this.prisma.multiselectOptions.create({
          data: {
            isOptOut: true,
            multiselectQuestionId: id,
            name: msq.optOutText,
            ordinal: options.length + 1,
          },
        });
      }
    }

    await this.markScriptAsComplete(
      'migrate multiselect data to refactor',
      requestingUser,
    );
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @param page which page of the application table to query from
   * @param pageSize size of the page of the application table being quieried
   * @returns successDTO
   * @description pulls all applications within a given range, loops over the
   * preferences and programs jsons to find the correct MSQ and option, and maps
   * the data to the ApplicationSelections and ApplicationSelectionOptions tables.
   */
  async migrateMultiselectApplicationDataToRefactor(
    req: ExpressRequest,
    page?: number,
    pageSize?: number,
  ): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      `migrate multiselect application data to refactor with page ${
        page || 1
      } of size ${pageSize || 5_000}`,
      requestingUser,
    );

    const skip = calculateSkip(pageSize || 5_000, page || 1);
    const take = calculateTake(pageSize || 5_000);
    console.log(`START OF RUN ${page ? skip : 1}:${skip + take}\n\n\n\n`);
    const applications = await this.prisma.applications.findMany({
      include: {
        listings: {
          include: {
            jurisdictions: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      where: {
        OR: [
          {
            AND: [
              { preferences: { not: null } },
              { preferences: { not: {} } },
              { preferences: { not: [] } },
              { preferences: { not: '{}' } },
              { preferences: { not: '[]' } },
            ],
          },
          {
            AND: [
              { programs: { not: null } },
              { programs: { not: {} } },
              { programs: { not: [] } },
              { programs: { not: '{}' } },
              { programs: { not: '[]' } },
            ],
          },
        ],
      },
      skip: skip,
      take: take,
      orderBy: { createdAt: 'asc' },
    });

    console.log(
      `updating ${applications.length} application's multiselect data`,
    );

    for (const { id, listings, preferences, programs } of applications) {
      const preferencesAndPrograms = (
        preferences as unknown[] as ApplicationMultiselectQuestion[]
      ).concat(
        programs
          ? (programs as unknown[] as ApplicationMultiselectQuestion[])
          : [],
      );

      for (const {
        key,
        claimed,
        options,
        multiselectQuestionId = null,
      } of preferencesAndPrograms as unknown[] as ApplicationMultiselectQuestion[]) {
        if (!claimed) {
          continue;
        }
        let multiselectQuestion;
        if (multiselectQuestionId) {
          multiselectQuestion =
            await this.prisma.multiselectQuestions.findFirst({
              include: { multiselectOptions: true },
              where: { id: multiselectQuestionId },
            });
        } else {
          multiselectQuestion =
            await this.prisma.multiselectQuestions.findFirst({
              include: { multiselectOptions: true },
              where: {
                text: { equals: key, mode: Prisma.QueryMode.insensitive },
              },
            });
        }
        let hasOptedOut = false;
        const selectedOptions = [];
        if (!multiselectQuestion) {
          console.log(
            `Could not find MSQ with id: "${multiselectQuestionId}" or key: "${key}" for application with id: "${id}"`,
          );
          continue;
        }

        for (const selected of options.filter(({ checked }) => checked)) {
          const selectedName = selected.key
            ?.trim()
            ?.replaceAll('%{county}', listings.jurisdictions.name)
            ?.replaceAll('  ', ' ')
            ?.replaceAll("'", '')
            ?.replaceAll('.', '')
            ?.toLowerCase();
          const multiselectOption = multiselectQuestion.multiselectOptions.find(
            (option: MultiselectOption) =>
              option.name
                ?.trim()
                ?.replaceAll('  ', ' ')
                ?.replaceAll("'", '')
                ?.replaceAll('.', '')
                ?.toLowerCase() === selectedName,
          );
          if (!multiselectOption) {
            console.log(
              `Could not match MSQ option with key: "${selected.key}" for MSQ with id: "${multiselectQuestion.id}"`,
            );
            continue;
          }

          if (multiselectOption.isOptOut) {
            hasOptedOut = true;
          }

          const selectedOptionBody = {
            addressHolderAddressId: null,
            addressHolderName: null,
            addressHolderRelationship: null,
            isGeocodingVerified: null,
            multiselectOptionId: multiselectOption.id,
          };

          for (const { key, value } of selected.extraData) {
            if (key === 'addressHolderAddress' || key === 'address') {
              const address = await this.prisma.address.create({ data: value });
              selectedOptionBody.addressHolderAddressId = address.id;
            } else if (key === 'addressHolderName' || key === 'name') {
              selectedOptionBody.addressHolderName = value;
            } else if (
              key === 'addressHolderRelationship' ||
              key === 'relationship'
            ) {
              selectedOptionBody.addressHolderRelationship = value;
            } else if (key === 'geocodingVerified') {
              selectedOptionBody.isGeocodingVerified = Boolean(value);
            }
          }
          selectedOptions.push(selectedOptionBody);
        }
        const selectedBody = {
          applicationId: id,
          hasOptedOut: hasOptedOut,
          multiselectQuestionId: multiselectQuestion.id,
          selections: { createMany: { data: selectedOptions } },
        };
        await this.prisma.applicationSelections.create({
          data: selectedBody,
        });
      }
    }
    console.log(`END OF RUN ${page ? skip : 1}:${skip + take}\n\n\n\n`);

    await this.markScriptAsComplete(
      `migrate multiselect application data to refactor with page ${
        page || 1
      } of size ${pageSize || 5_000}`,
      requestingUser,
    );
    return { success: true };
  }

  /**
   * @param req incoming request object
   * @returns successDTO
   * @description for all closed listings populate the expire_after on applications
   */
  async setInitialExpireAfterValues(req: ExpressRequest): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    if (!process.env.APPLICATION_DAYS_TILL_EXPIRY) {
      throw new NotImplementedException(
        'APPLICATION_DAYS_TILL_EXPIRY env variable is not set',
      );
    }
    await this.markScriptAsRunStart(
      'set initial expire_after value',
      requestingUser,
    );

    // Set the expire_after field on applications tied to closed listings
    const closedListings = await this.prisma.listings.findMany({
      select: { id: true, closedAt: true },
      where: { status: ListingsStatusEnum.closed, closedAt: { not: null } },
    });
    this.logger.log(
      `updating expireAfter for ${closedListings.length} closed listings`,
    );
    for (const listing of closedListings) {
      const expireAfter = dayjs(listing.closedAt)
        .add(Number(process.env.APPLICATION_DAYS_TILL_EXPIRY), 'days')
        .toDate();
      const updatedApplications = await this.prisma.applications.updateMany({
        data: { expireAfter: expireAfter },
        where: { listingId: listing.id },
      });
      this.logger.log(
        `updated ${updatedApplications.count} applications for ${listing.id}`,
      );
    }

    await this.markScriptAsComplete(
      'set initial expire_after value',
      requestingUser,
    );
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @returns successDTO
   * @description Set the is_newest field on application if newest application for applicant
   */
  async setIsNewestApplicationValues(req: ExpressRequest): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      'set is_newest field on applications',
      requestingUser,
    );

    const userCount = await this.prisma.userAccounts.count({
      where: { userRoles: { is: null } },
    });
    this.logger.log(`total public user count ${userCount}`);
    // Batch in groups of 1000
    for (let currentCount = 0; currentCount < userCount; currentCount += 1000) {
      const applicationsToUpdate: {
        user_id: string;
        application_id: string;
      }[] = await this.prisma
        .$queryRaw`select a.user_id, (a.application_ids::jsonb)[0]::text as application_id from (
                    select a.user_id, json_agg(a.id ORDER BY a.created_at DESC) as application_ids from applications a
                    GROUP BY a.user_id) a
                    OFFSET ${currentCount}
                    LIMIT 1000;`;
      this.logger.log(`updating ${applicationsToUpdate.length} applications`);
      await this.prisma.applications.updateMany({
        data: { isNewest: true },
        where: {
          id: {
            in: applicationsToUpdate.map((app) =>
              app.application_id.replace('"', '').replace('"', ''),
            ),
          },
        },
      });
    }

    await this.markScriptAsComplete(
      'set is_newest field on applications',
      requestingUser,
    );
    return { success: true };
  }

  /**
    this is simply an example
  */
  async example(req: ExpressRequest): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart('example', requestingUser);
    const rawJurisdictions = await this.prisma.jurisdictions.findMany();
    await this.markScriptAsComplete('example', requestingUser);
    return { success: !!rawJurisdictions.length };
  }

  // |------------------ HELPERS GO BELOW ------------------ | //

  /**
   *
   * @param scriptName the name of the script that is going to be run
   * @param userTriggeringTheRun the user that is attempting to trigger the script run
   * @description this checks to see if the script has already ran, if not marks the script in the db
   */
  async markScriptAsRunStart(
    scriptName: string,
    userTriggeringTheRun: User,
  ): Promise<void> {
    // check to see if script is already ran in db
    const storedScriptRun = await this.prisma.scriptRuns.findUnique({
      where: {
        scriptName,
      },
    });

    if (storedScriptRun?.didScriptRun) {
      // if script run has already successfully completed throw already succeed error
      throw new BadRequestException(
        `${scriptName} has already been run and succeeded`,
      );
    } else if (storedScriptRun?.didScriptRun === false) {
      // if script run was attempted but failed, throw attempt already failed error
      throw new BadRequestException(
        `${scriptName} has an attempted run and it failed, or is in progress. If it failed, please delete the db entry and try again`,
      );
    } else {
      // if no script run has been attempted create script run entry
      await this.prisma.scriptRuns.create({
        data: {
          scriptName,
          triggeringUser: userTriggeringTheRun.id,
        },
      });
    }
  }

  /**
   *
   * @param scriptName the name of the script that is going to be run
   * @param userTriggeringTheRun the user that is setting the script run as successfully completed
   * @description this marks the script run entry in the db as successfully completed
   */
  async markScriptAsComplete(
    scriptName: string,
    userTriggeringTheRun: User,
  ): Promise<void> {
    await this.prisma.scriptRuns.update({
      data: {
        didScriptRun: true,
        triggeringUser: userTriggeringTheRun.id,
      },
      where: {
        scriptName,
      },
    });
  }

  featureFlags = [
    {
      name: 'enableSingleUseCode',
      description:
        'When true, the backend allows for logging into this jurisdiction using the single use code flow',
      active: false,
    },
    {
      name: 'enableAccessibiliyFeatures',
      description:
        "When true, the 'accessibility features' section is displayed in listing creation/edit and the public listing view",
      active: false,
    },
    {
      name: 'enableGeocodingPreferences',
      description:
        'When true, preferences can be created with geocoding functionality and when an application is created/updated on a listing that is geocoding then the application gets geocoded',
      active: false,
    },
    {
      name: 'enableGeocodingRadiusMethod',
      description:
        'When true, preferences can be created with geocoding functionality that verifies via a mile radius',
      active: false,
    },
    {
      name: 'enableListingOpportunity',
      description:
        "When true, any newly published listing will send a gov delivery email to everyone that has signed up for the 'listing alerts'",
      active: false,
    },
    {
      name: 'enablePartnerDemographics',
      description:
        'When true, demographics data is included in application or lottery exports for partners',
      active: false,
    },
    {
      name: 'enablePartnerSettings',
      description:
        "When true, the 'settings' tab in the partner site is visible",
      active: false,
    },
    {
      name: 'enableUtilitiesIncluded',
      description:
        "When true, the 'utilities included' section is displayed in listing creation/edit and the public listing view",
      active: false,
    },
    {
      name: 'enableNeighborhoodAmenities',
      description:
        "When true, the 'neighborhood amenities' section is displayed in listing creation/edit and the public listing view",
      active: false,
    },
    {
      name: 'exportApplicationAsSpreadsheet',
      description:
        'When true, the application export is done as an Excel spreadsheet',
      active: false,
    },
    {
      name: 'limitClosedListingActions',
      description:
        'When true, availability of edit, republish, and reopen functionality is limited for closed listings',
      active: false,
    },
    {
      name: 'showLottery',
      description:
        'When true, show lottery tab on lottery listings on the partners site',
      active: false,
    },
    {
      name: 'showMandatedAccounts',
      description:
        'When true, require users to be logged in to submit an application on the public site',
      active: false,
    },
    {
      name: 'showProfessionalPartners',
      description:
        'When true, show a navigation bar link to professional partners',
      active: false,
    },
    {
      name: 'showPublicLottery',
      description:
        'When true, show lottery section on the user applications page',
      active: false,
    },
    {
      name: 'showPwdless',
      description:
        "When true, show the 'get code to sign in' button on public sign in page for the pwdless flow",
      active: false,
    },
    {
      name: 'showSmsMfa',
      description:
        "When true, show the 'sms' button option when a user goes through multi factor authentication",
      active: false,
    },
  ];

  resolveHideFromListings(pref): boolean {
    if (pref.form_metadata && 'hideFromListing' in pref.form_metadata) {
      if (pref.form_metadata.hideFromListing) {
        return true;
      }
      return false;
    }
    return null;
  }

  resolveOptionValues(formMetaData, type, juris, translations) {
    let optOutText = null;
    const options = [];
    let shouldPush = true;

    formMetaData?.options?.forEach((option, index) => {
      const toPush: Record<string, any> = {
        ordinal: index + 1,
        text: this.getTranslated(
          type,
          formMetaData.key,
          option.key === 'preferNotToSay'
            ? 'preferNotToSay'
            : `${option.key}.label`,
          juris,
          translations,
        ),
      };

      if (
        option.exclusive &&
        formMetaData.hideGenericDecline &&
        index !== formMetaData.options.length - 1
      ) {
        // for all but the last exlusive option push into options array
        toPush.exclusive = true;
      } else if (
        option.exclusive &&
        formMetaData.hideGenericDecline &&
        index === formMetaData.options.length - 1
      ) {
        // for the last exclusive option add as optOutText
        optOutText = this.getTranslated(
          type,
          formMetaData.key,
          option.key === 'preferNotToSay'
            ? 'preferNotToSay'
            : `${option.key}.label`,
          juris,
          translations,
        );
        shouldPush = false;
      }

      if (option.description) {
        toPush.description = this.getTranslated(
          type,
          formMetaData.key,
          option.key === 'preferNotToSay'
            ? 'preferNotToSay'
            : `${option.key}.description`,
          juris,
          translations,
        );
      }

      if (option?.extraData.some((extraData) => extraData.type === 'address')) {
        toPush.collectAddress = true;
      }

      if (shouldPush) {
        options.push(toPush);
      } else {
        shouldPush = true;
      }
    });

    return {
      optOutText,
      options: options.length ? options : null,
    };
  }

  getTranslated(type, prefKey, translationKey, juris, translations) {
    let searchKey = `application.${type}.${prefKey}.${translationKey}`;
    if (translationKey === 'preferNotToSay') {
      searchKey = 't.preferNotToSay';
    }

    if (juris === 'Detroit') {
      if (translations['detroitPublic'][searchKey]) {
        return translations['detroitPublic'][searchKey];
      } else if (translations['detroitPartners'][searchKey]) {
        return translations['detroitPartners'][searchKey];
      } else if (translations['detroitCore'][searchKey]) {
        return translations['detroitCore'][searchKey];
      }
    }

    if (translations['generalPublic'][searchKey]) {
      return translations['generalPublic'][searchKey];
    } else if (translations['generalPartners'][searchKey]) {
      return translations['generalPartners'][searchKey];
    } else if (translations['generalCore'][searchKey]) {
      return translations['generalCore'][searchKey];
    }
    return 'no translation';
  }

  async getTranslationFile(
    url: string,
    timeoutMs = TRANSLATION_FETCH_TIMEOUT_MS,
  ): Promise<Record<string, unknown>> {
    const { data } = await firstValueFrom(
      this.httpService
        .get(url, { signal: AbortSignal.timeout(timeoutMs) })
        .pipe(
          catchError((error: AxiosError) => {
            throw new Error(
              `failed fetching ${url}: ${
                error.code === 'ERR_CANCELED'
                  ? `timed out after ${timeoutMs}ms`
                  : error.message
              }`,
            );
          }),
        ),
    );

    if (!data || typeof data !== 'object') {
      throw new Error(`${url} did not return json`);
    }
    return data as Record<string, unknown>;
  }
}
