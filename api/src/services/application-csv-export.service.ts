import fs, { createReadStream } from 'fs';
import { join } from 'path';
import {
  BadRequestException,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { view } from './application.service';
import { PrismaService } from './prisma.service';
import {
  ApplicationSubmissionTypeEnum,
  LotteryStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from '@prisma/client';
import { MultiselectQuestionService } from './multiselect-question.service';
import { ApplicationCsvQueryParams } from '../dtos/applications/application-csv-query-params.dto';
import { UnitType } from '../dtos/unit-types/unit-type.dto';
import { Address } from '../dtos/addresses/address.dto';
import { ApplicationMultiselectQuestion } from '../dtos/applications/application-multiselect-question.dto';
import MultiselectQuestion from '../dtos/multiselect-questions/multiselect-question.dto';
import { ApplicationFlaggedSet } from '../dtos/application-flagged-sets/application-flagged-set.dto';
import { User } from '../dtos/users/user.dto';
import { ListingService } from './listing.service';
import { PermissionService } from './permission.service';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { formatLocalDate } from '../utilities/format-local-date';
import {
  CsvExporterServiceInterface,
  CsvHeader,
} from '../types/CsvExportInterface';
import { mapTo } from '../utilities/mapTo';
import { Application } from '../dtos/applications/application.dto';
import { OrderByEnum } from '../enums/shared/order-by-enum';
import { ApplicationLotteryPosition } from '../dtos/applications/application-lottery-position.dto';
import { SuccessDTO } from 'src/dtos/shared/success.dto';

view.csv = {
  ...view.details,
  applicationFlaggedSet: {
    select: {
      id: true,
    },
  },
  listings: false,
};

export const typeMap = {
  SRO: 'SRO',
  studio: 'Studio',
  oneBdrm: 'One Bedroom',
  twoBdrm: 'Two Bedroom',
  threeBdrm: 'Three Bedroom',
  fourBdrm: 'Four+ Bedroom',
  fiveBdrm: 'Five Bedroom',
};

const NUMBER_TO_PAGINATE_BY = 500;

@Injectable()
export class ApplicationCsvExporterService
  implements CsvExporterServiceInterface
{
  readonly dateFormat: string = 'MM-DD-YYYY hh:mm:ssA z';
  constructor(
    private prisma: PrismaService,
    private multiselectQuestionService: MultiselectQuestionService,
    private listingService: ListingService,
    private permissionService: PermissionService,
  ) {}

  /**
   *
   * @param queryParams
   * @param req
   * @returns a promise containing a streamable file
   */
  async exportFile<QueryParams extends ApplicationCsvQueryParams>(
    req: ExpressRequest,
    res: Response,
    queryParams: QueryParams,
  ): Promise<StreamableFile> {
    const user = mapTo(User, req['user']);
    await this.authorizeCSVExport(user, queryParams.listingId);

    const filename = join(
      process.cwd(),
      `src/temp/listing-${queryParams.listingId}-applications-${
        user.id
      }-${new Date().getTime()}.csv`,
    );

    await this.createCsv(filename, queryParams);
    const file = createReadStream(filename);
    return new StreamableFile(file);
  }

  /**
   *
   * @param filename
   * @param queryParams
   * @returns a promise with SuccessDTO
   */
  async createCsv<QueryParams extends ApplicationCsvQueryParams>(
    filename: string,
    queryParams: QueryParams,
  ): Promise<void> {
    const applications = await this.prisma.applications.findMany({
      select: {
        id: true,
        householdMember: {
          select: {
            id: true,
          },
        },
      },
      where: {
        listingId: queryParams.listingId,
        deletedAt: null,
      },
    });

    // get all multiselect questions for a listing to build csv headers
    const multiSelectQuestions =
      await this.multiselectQuestionService.findByListingId(
        queryParams.listingId,
      );

    // get maxHouseholdMembers associated to the selected applications
    let maxHouseholdMembers = 0;
    applications.forEach((app) => {
      if (app.householdMember?.length > maxHouseholdMembers) {
        maxHouseholdMembers = app.householdMember.length;
      }
    });

    const csvHeaders = await this.getCsvHeaders(
      maxHouseholdMembers,
      multiSelectQuestions,
      queryParams.timeZone,
      queryParams.includeDemographics,
    );

    return this.csvExportHelper(
      filename,
      mapTo(Application, applications),
      csvHeaders,
      queryParams,
    );
  }

  getHouseholdCsvHeaders(maxHouseholdMembers: number): CsvHeader[] {
    const headers = [];
    for (let i = 0; i < maxHouseholdMembers; i++) {
      const j = i + 1;
      headers.push(
        {
          path: `householdMember.${i}.firstName`,
          label: `Household Member (${j}) First Name`,
        },
        {
          path: `householdMember.${i}.middleName`,
          label: `Household Member (${j}) Middle Name`,
        },
        {
          path: `householdMember.${i}.lastName`,
          label: `Household Member (${j}) Last Name`,
        },
        {
          path: `householdMember.${i}.firstName`,
          label: `Household Member (${j}) First Name`,
        },
        {
          path: `householdMember.${i}.birthDay`,
          label: `Household Member (${j}) Birth Day`,
        },
        {
          path: `householdMember.${i}.birthMonth`,
          label: `Household Member (${j}) Birth Month`,
        },
        {
          path: `householdMember.${i}.birthYear`,
          label: `Household Member (${j}) Birth Year`,
        },
        {
          path: `householdMember.${i}.sameAddress`,
          label: `Household Member (${j}) Same as Primary Applicant`,
        },
        {
          path: `householdMember.${i}.relationship`,
          label: `Household Member (${j}) Relationship`,
        },
        {
          path: `householdMember.${i}.workInRegion`,
          label: `Household Member (${j}) Work in Region`,
        },
        {
          path: `householdMember.${i}.householdMemberAddress.street`,
          label: `Household Member (${j}) Street`,
        },
        {
          path: `householdMember.${i}.householdMemberAddress.street2`,
          label: `Household Member (${j}) Street 2`,
        },
        {
          path: `householdMember.${i}.householdMemberAddress.city`,
          label: `Household Member (${j}) City`,
        },
        {
          path: `householdMember.${i}.householdMemberAddress.state`,
          label: `Household Member (${j}) State`,
        },
        {
          path: `householdMember.${i}.householdMemberAddress.zipCode`,
          label: `Household Member (${j}) Zip Code`,
        },
      );
    }

    return headers;
  }

  constructMultiselectQuestionHeaders(
    applicationSection: string,
    labelString: string,
    multiSelectQuestions: MultiselectQuestion[],
  ): CsvHeader[] {
    const headers: CsvHeader[] = [];

    multiSelectQuestions
      .filter((question) => question.applicationSection === applicationSection)
      .forEach((question) => {
        headers.push({
          path: `${applicationSection}.${question.text}.claimed`,
          label: `${labelString} ${question.text}`,
          format: (val: any): string => {
            const claimedString: string[] = [];
            val?.options?.forEach((option) => {
              if (option.checked) {
                claimedString.push(option.key);
              }
            });
            return claimedString.join(', ');
          },
        });
        /**
         * there are other input types for extra data besides address
         * that are not used on the old backend, but could be added here
         */
        question.options
          ?.filter((option) => option.collectAddress)
          .forEach((option) => {
            headers.push({
              path: `${applicationSection}.${question.text}.address`,
              label: `${labelString} ${question.text} - ${option.text} - Address`,
              format: (val: ApplicationMultiselectQuestion): string => {
                return this.multiselectQuestionFormat(
                  val,
                  option.text,
                  'address',
                );
              },
            });
            if (option.validationMethod) {
              headers.push({
                path: `${applicationSection}.${question.text}.address`,
                label: `${labelString} ${question.text} - ${option.text} - Passed Address Check`,
                format: (val: ApplicationMultiselectQuestion): string => {
                  return this.multiselectQuestionFormat(
                    val,
                    option.text,
                    'geocodingVerified',
                  );
                },
              });
            }
            if (option.collectName) {
              headers.push({
                path: `${applicationSection}.${question.text}.address`,
                label: `${labelString} ${question.text} - ${option.text} - Name of Address Holder`,
                format: (val: ApplicationMultiselectQuestion): string => {
                  return this.multiselectQuestionFormat(
                    val,
                    option.text,
                    'addressHolderName',
                  );
                },
              });
            }
            if (option.collectRelationship) {
              headers.push({
                path: `${applicationSection}.${question.text}.address`,
                label: `${labelString} ${question.text} - ${option.text} - Relationship to Address Holder`,
                format: (val: ApplicationMultiselectQuestion): string => {
                  return this.multiselectQuestionFormat(
                    val,
                    option.text,
                    'addressHolderRelationship',
                  );
                },
              });
            }
          });
      });

    return headers;
  }

  async getCsvHeaders(
    maxHouseholdMembers: number,
    multiSelectQuestions: MultiselectQuestion[],
    timeZone: string,
    includeDemographics = false,
    forLottery = false,
  ): Promise<CsvHeader[]> {
    const headers: CsvHeader[] = [
      {
        path: 'id',
        label: 'Application Id',
      },
      {
        path: 'confirmationCode',
        label: 'Application Confirmation Code',
      },
      {
        path: 'submissionType',
        label: 'Application Type',
        format: (val: string): string =>
          val === ApplicationSubmissionTypeEnum.electronical
            ? 'electronic'
            : val,
      },
      {
        path: 'submissionDate',
        label: 'Application Submission Date',
        format: (val: string): string =>
          formatLocalDate(
            val,
            this.dateFormat,
            timeZone ?? process.env.TIME_ZONE,
          ),
      },
      {
        path: 'applicant.firstName',
        label: 'Primary Applicant First Name',
      },
      {
        path: 'applicant.middleName',
        label: 'Primary Applicant Middle Name',
      },
      {
        path: 'applicant.lastName',
        label: 'Primary Applicant Last Name',
      },
      {
        path: 'applicant.birthDay',
        label: 'Primary Applicant Birth Day',
      },
      {
        path: 'applicant.birthMonth',
        label: 'Primary Applicant Birth Month',
      },
      {
        path: 'applicant.birthYear',
        label: 'Primary Applicant Birth Year',
      },
      {
        path: 'applicant.emailAddress',
        label: 'Primary Applicant Email Address',
      },
      {
        path: 'applicant.phoneNumber',
        label: 'Primary Applicant Phone Number',
      },
      {
        path: 'applicant.phoneNumberType',
        label: 'Primary Applicant Phone Type',
      },
      {
        path: 'additionalPhoneNumber',
        label: 'Primary Applicant Additional Phone Number',
      },
      {
        path: 'contactPreferences',
        label: 'Primary Applicant Preferred Contact Type',
      },
      {
        path: 'applicant.applicantAddress.street',
        label: `Primary Applicant Street`,
      },
      {
        path: 'applicant.applicantAddress.street2',
        label: `Primary Applicant Street 2`,
      },
      {
        path: 'applicant.applicantAddress.city',
        label: `Primary Applicant City`,
      },
      {
        path: 'applicant.applicantAddress.state',
        label: `Primary Applicant State`,
      },
      {
        path: 'applicant.applicantAddress.zipCode',
        label: `Primary Applicant Zip Code`,
      },
      {
        path: 'applicationsMailingAddress.street',
        label: `Primary Applicant Mailing Street`,
      },
      {
        path: 'applicationsMailingAddress.street2',
        label: `Primary Applicant Mailing Street 2`,
      },
      {
        path: 'applicationsMailingAddress.city',
        label: `Primary Applicant Mailing City`,
      },
      {
        path: 'applicationsMailingAddress.state',
        label: `Primary Applicant Mailing State`,
      },
      {
        path: 'applicationsMailingAddress.zipCode',
        label: `Primary Applicant Mailing Zip Code`,
      },
      {
        path: 'applicant.applicantWorkAddress.street',
        label: `Primary Applicant Work Street`,
      },
      {
        path: 'applicant.applicantWorkAddress.street2',
        label: `Primary Applicant Work Street 2`,
      },
      {
        path: 'applicant.applicantWorkAddress.city',
        label: `Primary Applicant Work City`,
      },
      {
        path: 'applicant.applicantWorkAddress.state',
        label: `Primary Applicant Work State`,
      },
      {
        path: 'applicant.applicantWorkAddress.zipCode',
        label: `Primary Applicant Work Zip Code`,
      },
      {
        path: 'alternateContact.firstName',
        label: 'Alternate Contact First Name',
      },
      {
        path: 'alternateContact.lastName',
        label: 'Alternate Contact Last Name',
      },
      {
        path: 'alternateContact.type',
        label: 'Alternate Contact Type',
      },
      {
        path: 'alternateContact.agency',
        label: 'Alternate Contact Agency',
      },
      {
        path: 'alternateContact.otherType',
        label: 'Alternate Contact Other Type',
      },
      {
        path: 'alternateContact.emailAddress',
        label: 'Alternate Contact Email Address',
      },
      {
        path: 'alternateContact.phoneNumber',
        label: 'Alternate Contact Phone Number',
      },
      {
        path: 'alternateContact.address.street',
        label: `Alternate Contact Street`,
      },
      {
        path: 'alternateContact.address.street2',
        label: `Alternate Contact Street 2`,
      },
      {
        path: 'alternateContact.address.city',
        label: `Alternate Contact City`,
      },
      {
        path: 'alternateContact.address.state',
        label: `Alternate Contact State`,
      },
      {
        path: 'alternateContact.address.zipCode',
        label: `Alternate Contact Zip Code`,
      },
      {
        path: 'income',
        label: 'Income',
      },
      {
        path: 'incomePeriod',
        label: 'Income Period',
        format: (val: string): string =>
          val === 'perMonth' ? 'per month' : 'per year',
      },
      {
        path: 'accessibility.mobility',
        label: 'Accessibility Mobility',
      },
      {
        path: 'accessibility.vision',
        label: 'Accessibility Vision',
      },
      {
        path: 'accessibility.hearing',
        label: 'Accessibility Hearing',
      },
      {
        path: 'householdExpectingChanges',
        label: 'Expecting Household Changes',
      },
      {
        path: 'householdStudent',
        label: 'Household Includes Student or Member Nearing 18',
      },
      {
        path: 'incomeVouchers',
        label: 'Vouchers or Subsidies',
      },
      {
        path: 'preferredUnitTypes',
        label: 'Requested Unit Types',
        format: (val: UnitType[]): string => {
          return val
            .map((unit) => this.unitTypeToReadable(unit.name))
            .join(',');
        },
      },
    ];

    // add preferences to csv headers
    const preferenceHeaders = this.constructMultiselectQuestionHeaders(
      'preferences',
      'Preference',
      multiSelectQuestions,
    );
    headers.push(...preferenceHeaders);

    // add programs to csv headers
    const programHeaders = this.constructMultiselectQuestionHeaders(
      'programs',
      'Program',
      multiSelectQuestions,
    );
    headers.push(...programHeaders);

    headers.push({
      path: 'householdSize',
      label: 'Household Size',
    });

    // add household member headers to csv
    if (maxHouseholdMembers) {
      headers.push(...this.getHouseholdCsvHeaders(maxHouseholdMembers));
    }

    headers.push(
      {
        path: 'markedAsDuplicate',
        label: 'Marked As Duplicate',
      },
      {
        path: 'applicationFlaggedSet',
        label: 'Flagged As Duplicate',
        format: (val: ApplicationFlaggedSet[]): boolean => {
          return val.length > 0;
        },
      },
    );

    if (includeDemographics) {
      headers.push(
        {
          path: 'demographics.ethnicity',
          label: 'Ethnicity',
        },
        {
          path: 'demographics.race',
          label: 'Race',
          format: (val: string[]): string =>
            val
              .map((race) => this.convertDemographicRaceToReadable(race))
              .join(','),
        },
        {
          path: 'demographics.howDidYouHear',
          label: 'How did you Hear?',
        },
      );
    }

    // if its for the lottery insert the lottery position
    if (forLottery) {
      headers.unshift({
        path: 'applicationLotteryPositions',
        label: 'Lottery Position',
        format: (val: ApplicationLotteryPosition[]): number => {
          if (val?.length) {
            return val[0].ordinal;
          }
        },
      });
    }
    return headers;
  }

  addressToString(address: Address): string {
    return `${address.street}${address.street2 ? ' ' + address.street2 : ''} ${
      address.city
    }, ${address.state} ${address.zipCode}`;
  }

  multiselectQuestionFormat(
    question: ApplicationMultiselectQuestion,
    optionText: string,
    key: string,
  ): string {
    if (!question) return '';
    const selectedOption = question.options.find(
      (option) => option.key === optionText,
    );
    const extraData = selectedOption?.extraData.find(
      (data) => data.key === key,
    );
    if (!extraData) {
      return '';
    }
    if (key === 'address') {
      return this.addressToString(extraData.value as Address);
    }
    if (key === 'geocodingVerified') {
      return extraData.value === 'unknown'
        ? 'Needs Manual Verification'
        : extraData.value.toString();
    }
    return extraData.value as string;
  }

  convertDemographicRaceToReadable(type: string): string {
    const [rootKey, customValue = ''] = type.split(':');
    const typeMap = {
      americanIndianAlaskanNative: 'American Indian / Alaskan Native',
      asian: 'Asian',
      'asian-asianIndian': 'Asian[Asian Indian]',
      'asian-otherAsian': `Asian[Other Asian:${customValue}]`,
      blackAfricanAmerican: 'Black / African American',
      'asian-chinese': 'Asian[Chinese]',
      declineToRespond: 'Decline to Respond',
      'asian-filipino': 'Asian[Filipino]',
      'nativeHawaiianOtherPacificIslander-guamanianOrChamorro':
        'Native Hawaiian / Other Pacific Islander[Guamanian or Chamorro]',
      'asian-japanese': 'Asian[Japanese]',
      'asian-korean': 'Asian[Korean]',
      'nativeHawaiianOtherPacificIslander-nativeHawaiian':
        'Native Hawaiian / Other Pacific Islander[Native Hawaiian]',
      nativeHawaiianOtherPacificIslander:
        'Native Hawaiian / Other Pacific Islander',
      otherMultiracial: `Other / Multiracial:${customValue}`,
      'nativeHawaiianOtherPacificIslander-otherPacificIslander': `Native Hawaiian / Other Pacific Islander[Other Pacific Islander:${customValue}]`,
      'nativeHawaiianOtherPacificIslander-samoan':
        'Native Hawaiian / Other Pacific Islander[Samoan]',
      'asian-vietnamese': 'Asian[Vietnamese]',
      white: 'White',
    };
    return typeMap[rootKey] ?? rootKey;
  }

  unitTypeToReadable(type: string): string {
    return typeMap[type] ?? type;
  }

  async authorizeCSVExport(user, listingId): Promise<void> {
    /**
     * Checking authorization for each application is very expensive.
     * By making listingId required, we can check if the user has update permissions for the listing, since right now if a user has that
     * they also can run the export for that listing
     */
    const jurisdictionId =
      await this.listingService.getJurisdictionIdByListingId(listingId);

    await this.permissionService.canOrThrow(
      user,
      'listing',
      permissionActions.update,
      {
        id: listingId,
        jurisdictionId,
      },
    );
  }

  /**
   *
   * @param queryParams
   * @param req
   * @returns generates the lottery export file via helper function and returns the streamable file
   */
  async lotteryExport<QueryParams extends ApplicationCsvQueryParams>(
    req: ExpressRequest,
    res: Response,
    queryParams: QueryParams,
  ): Promise<StreamableFile> {
    const user = mapTo(User, req['user']);
    await this.authorizeCSVExport(user, queryParams.listingId);

    const filename = join(
      process.cwd(),
      `src/temp/lottery-listing-${queryParams.listingId}-applications-${
        user.id
      }-${new Date().getTime()}.csv`,
    );

    await this.createLotterySheet(filename, queryParams);
    const file = createReadStream(filename);
    return new StreamableFile(file);
  }

  /**
   *
   * @param filename
   * @param queryParams
   * @returns generates the lottery sheet
   */
  async createLotterySheet<QueryParams extends ApplicationCsvQueryParams>(
    filename: string,
    queryParams: QueryParams,
  ): Promise<void> {
    const applications = await this.prisma.applications.findMany({
      select: {
        id: true,
        preferences: true,
        householdMember: {
          select: {
            id: true,
          },
        },
        applicationLotteryPositions: {
          select: {
            ordinal: true,
            multiselectQuestionId: true,
          },
          where: {
            multiselectQuestionId: null,
          },
          orderBy: {
            ordinal: OrderByEnum.DESC,
          },
        },
      },
      where: {
        listingId: queryParams.listingId,
        deletedAt: null,
        markedAsDuplicate: false,
      },
    });

    // get all multiselect questions for a listing to build csv headers
    const multiSelectQuestions =
      await this.multiselectQuestionService.findByListingId(
        queryParams.listingId,
      );

    // get maxHouseholdMembers associated to the selected applications
    let maxHouseholdMembers = 0;
    applications.forEach((app) => {
      if (app.householdMember?.length > maxHouseholdMembers) {
        maxHouseholdMembers = app.householdMember.length;
      }
    });

    const csvHeaders = await this.getCsvHeaders(
      maxHouseholdMembers,
      multiSelectQuestions,
      queryParams.timeZone,
      queryParams.includeDemographics,
      true,
    );

    return this.csvExportHelper(
      filename,
      mapTo(Application, applications),
      csvHeaders,
      queryParams,
      true,
    );
  }

  /**
   *
   * @param queryParams
   * @param req
   * @returns generates the lottery results for a listing
   */
  async lotteryGenerate<QueryParams extends ApplicationCsvQueryParams>(
    req: ExpressRequest,
    res: Response,
    queryParams: QueryParams,
  ): Promise<SuccessDTO> {
    const user = mapTo(User, req['user']);
    await this.authorizeCSVExport(user, queryParams.listingId);

    const listing = await this.prisma.listings.findUnique({
      select: {
        id: true,
        lotteryLastRunAt: true,
        lotteryStatus: true,
      },
      where: {
        id: queryParams.listingId,
      },
    });
    if (listing?.lotteryStatus) {
      // if lottery has been run before
      throw new BadRequestException(
        `Listing ${queryParams.listingId}: the lottery was attempted to be generated but it was already run previously`,
      );
    }

    const applications = await this.prisma.applications.findMany({
      select: {
        id: true,
        preferences: true,
        householdMember: {
          select: {
            id: true,
          },
        },
        applicationLotteryPositions: {
          select: {
            ordinal: true,
            multiselectQuestionId: true,
          },
          where: {
            multiselectQuestionId: null,
          },
          orderBy: {
            ordinal: OrderByEnum.DESC,
          },
        },
      },
      where: {
        listingId: queryParams.listingId,
        deletedAt: null,
        markedAsDuplicate: false,
      },
    });

    // get all multiselect questions for a listing to build csv headers
    const multiSelectQuestions =
      await this.multiselectQuestionService.findByListingId(
        queryParams.listingId,
      );

    await this.lotteryRandomizer(
      queryParams.listingId,
      mapTo(Application, applications),
      multiSelectQuestions.filter(
        (multiselectQuestion) =>
          multiselectQuestion.applicationSection ===
          MultiselectQuestionsApplicationSectionEnum.preferences,
      ),
    );

    await this.prisma.listings.update({
      data: {
        lotteryLastRunAt: new Date(),
        lotteryStatus: LotteryStatusEnum.ran,
      },
      where: {
        id: queryParams.listingId,
      },
    });

    return { success: true };
  }

  /**
   *
   * @param filename the name of the file to write to
   * @param applications the full list of partial applications
   * @param csvHeaders the headers and renderers of the csv
   * @param queryParams the incoming param args
   * @param forLottery whether we are getting the lottery results or not
   * @returns void but writes the output to a file
   */
  csvExportHelper(
    filename: string,
    applications: Application[],
    csvHeaders: CsvHeader[],
    queryParams: ApplicationCsvQueryParams,
    forLottery = false,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      // create stream
      const writableStream = fs.createWriteStream(`${filename}`);
      writableStream
        .on('error', (err) => {
          console.log('csv writestream error');
          console.log(err);
          reject(err);
        })
        .on('close', () => {
          resolve();
        })
        .on('open', async () => {
          writableStream.write(
            csvHeaders
              .map((header) => `"${header.label.replace(/"/g, `""`)}"`)
              .join(',') + '\n',
          );

          const promiseArray: Promise<string>[] = [];
          for (let i = 0; i < applications.length; i += NUMBER_TO_PAGINATE_BY) {
            promiseArray.push(
              new Promise(async (resolve) => {
                // grab applications NUMBER_TO_PAGINATE_BY at a time
                let paginatedApplications =
                  await this.prisma.applications.findMany({
                    include: {
                      ...view.csv,
                      demographics: queryParams.includeDemographics
                        ? {
                            select: {
                              id: true,
                              createdAt: true,
                              updatedAt: true,
                              ethnicity: true,
                              gender: true,
                              sexualOrientation: true,
                              howDidYouHear: true,
                              race: true,
                            },
                          }
                        : false,
                      applicationLotteryPositions: forLottery
                        ? {
                            select: {
                              ordinal: true,
                            },
                            where: {
                              multiselectQuestionId: null,
                            },
                          }
                        : false,
                    },
                    where: {
                      listingId: queryParams.listingId,
                      deletedAt: null,
                    },
                    skip: i,
                    take: NUMBER_TO_PAGINATE_BY,
                  });
                if (forLottery) {
                  paginatedApplications = paginatedApplications.sort(
                    (a, b) =>
                      a.applicationLotteryPositions[0].ordinal -
                      b.applicationLotteryPositions[0].ordinal,
                  );
                }
                let row = '';
                paginatedApplications.forEach((app) => {
                  let preferences: ApplicationMultiselectQuestion[];
                  let programs: ApplicationMultiselectQuestion[];
                  csvHeaders.forEach((header, index) => {
                    let multiselectQuestionValue = false;
                    let parsePreference = false;
                    let parseProgram = false;
                    let value = header.path.split('.').reduce((acc, curr) => {
                      // return preference/program as value for the format function to accept
                      if (multiselectQuestionValue) {
                        return acc;
                      }

                      if (parsePreference) {
                        // curr should equal the preference id we're pulling from
                        if (!preferences) {
                          preferences =
                            app.preferences as unknown as ApplicationMultiselectQuestion[];
                        }
                        parsePreference = false;
                        // there aren't typically many preferences, but if there, then a object map should be created and used
                        const preference = preferences.find(
                          (preference) =>
                            preference.multiselectQuestionId === curr,
                        );
                        multiselectQuestionValue = true;
                        return preference;
                      } else if (parseProgram) {
                        // curr should equal the preference id we're pulling from
                        if (!programs) {
                          programs =
                            app.programs as unknown as ApplicationMultiselectQuestion[];
                        }
                        parsePreference = false;
                        // there aren't typically many programs, but if there, then a object map should be created and used
                        const program = programs.find(
                          (preference) => preference.key === curr,
                        );
                        multiselectQuestionValue = true;
                        return program;
                      }

                      // sets parsePreference to true, for the next iteration
                      if (curr === 'preferences') {
                        parsePreference = true;
                      } else if (curr === 'programs') {
                        parseProgram = true;
                      }

                      if (acc === null || acc === undefined) {
                        return '';
                      }

                      // handles working with arrays, e.g. householdMember.0.firstName
                      if (!isNaN(Number(curr))) {
                        const index = Number(curr);
                        return acc[index];
                      }

                      return acc[curr];
                    }, app);
                    value =
                      value === undefined ? '' : value === null ? '' : value;
                    if (header.format) {
                      value = header.format(value);
                    }

                    row += value
                      ? `"${value.toString().replace(/"/g, `""`)}"`
                      : '';
                    if (index < csvHeaders.length - 1) {
                      row += ',';
                    }
                  });
                  row += '\n';
                });
                resolve(row);
              }),
            );
          }
          const resolvedArray = await Promise.all(promiseArray);
          // now loop over batched row data and write them to file
          resolvedArray.forEach((row) => {
            try {
              writableStream.write(row);
            } catch (e) {
              console.log('writeStream write error = ', e);
              writableStream.once('drain', () => {
                console.log('drain buffer');
                writableStream.write(row + '\n');
              });
            }
          });
          writableStream.end();
        });
    });
  }

  async lotteryRandomizer(
    listingId: string,
    applications: Application[],
    preferencesOnListing: MultiselectQuestion[],
  ): Promise<void> {
    // remove duplicates
    let filteredApplications = applications;
    // prep our supporting array
    const ordinalArray = this.lotteryRandomizerHelper(filteredApplications);

    // attach ordinal info to filteredApplications
    ordinalArray.forEach((value, i) => {
      filteredApplications[i].applicationLotteryPositions = [
        {
          listingId,
          applicationId: filteredApplications[i].id,
          ordinal: value,
          multiselectQuestionId: null,
        },
      ];
    });

    // store raw positional score in db
    await this.prisma.applicationLotteryPositions.createMany({
      data: filteredApplications.map((app, index) => ({
        listingId,
        applicationId: app.id,
        ordinal: ordinalArray[index],
        multiselectQuestionId: null,
      })),
    });

    // order by ordinal
    filteredApplications = filteredApplications.sort(
      (a, b) =>
        a.applicationLotteryPositions[0].ordinal -
        b.applicationLotteryPositions[0].ordinal,
    );

    // loop over each preference on the listing and store the relative position of the applications
    for (let i = 0; i < preferencesOnListing.length; i++) {
      const { id, text } = preferencesOnListing[i];

      const applicationsWithThisPreference: Application[] = [];
      const ordinalArrayWithThisPreference: number[] = [];

      // filter down to only the applications that have this particular preference
      let preferenceOrdinal = 1;
      for (let j = 0; j < filteredApplications.length; j++) {
        if (
          filteredApplications[j].preferences.some(
            (preference) => preference.key === text && preference.claimed,
          )
        ) {
          applicationsWithThisPreference.push(filteredApplications[j]);
          ordinalArrayWithThisPreference.push(preferenceOrdinal);
          preferenceOrdinal++;
        }
      }

      if (applicationsWithThisPreference.length) {
        // store these values in the db
        await this.prisma.applicationLotteryPositions.createMany({
          data: applicationsWithThisPreference.map((app, index) => ({
            listingId,
            applicationId: app.id,
            ordinal: ordinalArrayWithThisPreference[index],
            multiselectQuestionId: id,
          })),
        });
      }
    }
  }

  lotteryRandomizerHelper(filterApplicationsArray: Application[]): number[] {
    // prep our supporting array
    const ordinalArray: number[] = [];

    const indexArray: number[] = [];
    filterApplicationsArray.forEach((_, index) => {
      indexArray.push(index + 1);
    });

    // fill array with random values
    filterApplicationsArray.forEach(() => {
      // get random value
      const randomPosition = Math.floor(Math.random() * indexArray.length);

      // remove selected value from indexArray
      const randomValue = indexArray.splice(randomPosition, 1);

      // push unique random value into array
      ordinalArray.push(randomValue[0]);
    });

    return ordinalArray;
  }
}
