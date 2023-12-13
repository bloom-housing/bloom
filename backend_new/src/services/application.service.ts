import fs from 'fs';
import { pipeline } from 'stream';
import zlib from 'zlib';
import path from 'path';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import crypto from 'crypto';
import { REQUEST } from '@nestjs/core';
import { ApplicationFlaggedSet, Prisma, YesNoEnum } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { Application } from '../dtos/applications/application.dto';
import { mapTo } from '../utilities/mapTo';
import { ApplicationQueryParams } from '../dtos/applications/application-query-params.dto';
import { calculateSkip, calculateTake } from '../utilities/pagination-helpers';
import { buildOrderBy } from '../utilities/build-order-by';
import { buildPaginationInfo } from '../utilities/build-pagination-meta';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { ApplicationViews } from '../enums/applications/view-enum';
import { ApplicationUpdate } from '../dtos/applications/application-update.dto';
import { ApplicationCreate } from '../dtos/applications/application-create.dto';
import { PaginatedApplicationDto } from '../dtos/applications/paginated-application.dto';
import { EmailService } from './email.service';
import Listing from '../dtos/listings/listing.dto';
import { User } from '../dtos/users/user.dto';
import { ApplicationCsvQueryParams } from 'src/dtos/applications/application-csv-query-params.dto';
import { ListingService } from './listing.service';
import { MultiselectQuestionService } from './multiselect-question.service';
import { UnitType } from '../../src/dtos/unit-types/unit-type.dto';
import { ApplicationMultiselectQuestion } from '../../src/dtos/applications/application-multiselect-question.dto';
import { Address } from 'src/dtos/addresses/address.dto';

const view: Partial<Record<ApplicationViews, Prisma.ApplicationsInclude>> = {
  partnerList: {
    applicant: {
      include: {
        applicantAddress: true,
        applicantWorkAddress: true,
      },
    },
    householdMember: true,
    accessibility: true,
    applicationsMailingAddress: true,
    applicationsAlternateAddress: true,
    alternateContact: {
      include: {
        address: true,
      },
    },
  },
};

view.base = {
  ...view.partnerList,
  demographics: true,
  preferredUnitTypes: true,
  listings: true,
  householdMember: {
    include: {
      householdMemberAddress: true,
      householdMemberWorkAddress: true,
    },
  },
};

view.details = {
  ...view.base,
  userAccounts: true,
};

view.csv = {
  ...view.details,
  applicationFlaggedSet: true,
  listings: false,
};

/*
  this is the service for applicationss
  it handles all the backend's business logic for reading/writing/deleting application data
*/
@Injectable()
export class ApplicationService {
  constructor(
    @Inject(REQUEST) private req: ExpressRequest,
    private prisma: PrismaService,
    private emailService: EmailService,
    private listingService: ListingService,
    private multiselectQuestionService: MultiselectQuestionService,
  ) {}

  /*
    this will get a set of applications given the params passed in
    this set can either be paginated or not depending on the params
    it will return both the set of applications, and some meta information to help with pagination
  */
  async list(params: ApplicationQueryParams): Promise<PaginatedApplicationDto> {
    const whereClause = this.buildWhereClause(params);

    const count = await this.prisma.applications.count({
      where: whereClause,
    });

    const rawApplications = await this.prisma.applications.findMany({
      skip: calculateSkip(params.limit, params.page),
      take: calculateTake(params.limit),
      orderBy: buildOrderBy([params.orderBy], [params.order]),
      include: view[params.listingId ? 'partnerList' : 'base'],
      where: whereClause,
    });

    const applications = mapTo(Application, rawApplications);

    const promiseArray = applications.map((application) =>
      this.getDuplicateFlagsForApplication(application.id),
    );

    const flags = await Promise.all(promiseArray);
    applications.forEach((application, index) => {
      application.flagged = !!flags[index]?.id;
    });

    return {
      items: applications,
      meta: buildPaginationInfo(
        params.limit,
        params.page,
        count,
        applications.length,
      ),
    };
  }

  /*
   * Prepares an export and sends a zip file
   */
  async export(queryParams: ApplicationCsvQueryParams): Promise<SuccessDTO> {
    await this.authorizeCSVExport(this.req.user, queryParams.listingId);

    const csvView = view.csv;

    if (queryParams.includeDemographics) {
      csvView.demographics = true;
    }

    const applications = await this.prisma.applications.findMany({
      include: csvView,
      where: {
        listingId: queryParams.listingId,
      },
    });

    // get the max number of household members for csv headers
    const maxHouseholdMembersRes = await this.prisma.householdMember.groupBy({
      by: ['applicationId'],
      _count: {
        applicationId: true,
      },
      orderBy: {
        _count: {
          applicationId: 'desc',
        },
      },
      take: 1,
    });

    const maxHouseholdMembers =
      maxHouseholdMembersRes && maxHouseholdMembersRes.length
        ? maxHouseholdMembersRes[0]._count.applicationId
        : 0;

    // get all multiselect questions for a listing to build csv headers
    const multiSelectQuestions =
      await this.multiselectQuestionService.findByListingId(
        queryParams.listingId,
      );

    // could use translations
    function unitTypeToReadable(type: string) {
      const typeMap = {
        SRO: 'SRO',
        studio: 'Studio',
        oneBdrm: 'One Bedroom',
        twoBdrm: 'Two Bedroom',
        threeBdrm: 'Three Bedroom',
        fourBdrm: 'Four+ Bedroom',
      };
      return typeMap[type] ?? type;
    }

    type CsvHeader = {
      path: string;
      label: string;
      format?: (val: unknown) => unknown;
    };

    const csvHeaders: CsvHeader[] = [
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
      },
      {
        path: 'submissionDate',
        label: 'Application Submission Date',
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
        path: 'alternateContact.middleName',
        label: 'Alternate Contact Middle Name',
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
        format: (val: string) =>
          val === 'perMonth' ? 'per month' : 'per year',
      },
      {
        path: 'accessibilityMobility',
        label: 'Accessibility Mobility',
      },
      {
        path: 'accessibilityVision',
        label: 'Accessibility Vision',
      },
      {
        path: 'accessibilityHearing',
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
          return val.map((unit) => unitTypeToReadable(unit.name)).join(',');
        },
      },
    ];

    function addressToString(address: Address): string {
      return `${address.street}${
        address.street2 ? ' ' + address.street2 : ''
      } ${address.city}, ${address.state} ${address.zipCode}`;
    }

    function multiselectQuestionFormat(
      question: ApplicationMultiselectQuestion,
    ) {
      if (!question) return '';
      const address = question.options.reduce((_, curr) => {
        const extraData = curr.extraData.find(
          (data) => data.type === 'address',
        );
        return extraData ? extraData.value : '';
      }, {}) as Address;
      return addressToString(address);
    }

    // add preferences to csv headers
    multiSelectQuestions
      .filter((question) => question.applicationSection === 'preferences')
      .forEach((question) => {
        csvHeaders.push({
          path: `preferences.${question.id}.claimed`,
          label: `Preference ${question.text}`,
          format: (val: boolean) => (val ? 'claimed' : ''),
        });
        /**
         * there are other input types for extra data besides address
         * that are not used on the old backend, but could be added here
         */
        question.options
          .filter((option) => option.collectAddress)
          .forEach(() => {
            csvHeaders.push({
              path: `preferences.${question.id}.address`,
              label: `Preference ${question.text} - Address`,
              format: (val: ApplicationMultiselectQuestion) =>
                multiselectQuestionFormat(val),
            });
          });
      });

    // add programs to csv headers
    multiSelectQuestions
      .filter((question) => question.applicationSection === 'programs')
      .forEach((question) => {
        csvHeaders.push({
          path: `programs.${question.id}.claimed`,
          label: `Program ${question.text}`,
          format: (val: boolean) => (val ? 'claimed' : ''),
        });
        question.options
          .filter((option) => option.collectAddress)
          .forEach(() => {
            csvHeaders.push({
              path: `preferences.${question.id}.address`,
              label: `Preference ${question.text} - Address`,
              format: (val: ApplicationMultiselectQuestion) =>
                multiselectQuestionFormat(val),
            });
          });
      });

    csvHeaders.push({
      path: 'householdSize',
      label: 'Household Size',
    });

    // add household member headers to csv
    for (let i = 0; i < maxHouseholdMembers; i++) {
      const j = i + 1;
      csvHeaders.push(
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
          path: `householdMember.${i}.street`,
          label: `Household Member (${j}) Street`,
        },
        {
          path: `householdMember.${i}.street2`,
          label: `Household Member (${j}) Street 2`,
        },
        {
          path: `householdMember.${i}.city`,
          label: `Household Member (${j}) City`,
        },
        {
          path: `householdMember.${i}.state`,
          label: `Household Member (${j}) State`,
        },
        {
          path: `householdMember.${i}.zipCode`,
          label: `Household Member (${j}) Zip Code`,
        },
      );
    }

    csvHeaders.push(
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

    if (queryParams.includeDemographics) {
      csvHeaders.push(
        {
          path: 'demographics.ethnicity',
          label: 'Ethnicity',
        },
        {
          path: 'demographics.race',
          label: 'Race',
        },
        {
          path: 'demographics.gender',
          label: 'Gender',
        },
        {
          path: 'demographics.sexualOrientation',
          label: 'Sexual Orientation',
        },
        {
          path: 'demographics.howDidYouHear',
          label: 'How did you Hear?',
        },
      );
    }

    // write headers
    const filePath = path.join(
      path.resolve(process.cwd()),
      'src/temp/test.csv',
    );

    const readableStream = fs.createReadStream(filePath);
    const writableStream = fs.createWriteStream(`${filePath}.gz`);

    writableStream.write(
      csvHeaders.map((header) => header.label).join(',') + '\n',
    );

    // now loop over applications and write them to file
    applications.forEach((app) => {
      let row = '';
      let preferences: ApplicationMultiselectQuestion[];
      let programs: ApplicationMultiselectQuestion[];
      csvHeaders.forEach((header, index) => {
        // split header
        let parsePreference = false;
        let multiselectQuestionValue = false;
        let parsePrograms = false;
        // let isProgram = false;
        let value = header.path.split('.').reduce((acc, curr) => {
          // return preference/program as value for the format function to accept
          if (multiselectQuestionValue) {
            return acc;
          }

          if (parsePreference) {
            // curr should equal the preference id we're pulling from
            if (!preferences) {
              preferences = JSON.parse(app.preferences as string);
            }
            parsePreference = false;
            const preference = preferences.find(
              (preference) => preference.multiselectQuestionId === curr,
            );
            multiselectQuestionValue = true;
            return preference;
          }

          if (curr === 'preferences') {
            parsePreference = true;
          }

          if (parsePrograms) {
            // curr should equal the preference id we're pulling from
            if (!programs) {
              programs = JSON.parse(app.programs as string);
            }
            parsePrograms = false;
            const program = programs.find(
              (preference) => preference.multiselectQuestionId === curr,
            );
            multiselectQuestionValue = true;
            return program;
          }

          if (curr === 'programs') {
            parsePrograms = true;
          }

          if (!isNaN(Number(curr))) {
            const index = Number(curr);
            return acc[index];
          }

          if (acc === null || acc === undefined) {
            return '';
          }
          return acc[curr];
        }, app);
        value = value === undefined ? '' : value === null ? '' : value;
        if (header.format) {
          value = header.format(value);
        }

        row += value;
        if (index < csvHeaders.length - 1) {
          row += ',';
        } else {
          row += '\n';
        }
      });

      try {
        writableStream.write(row + '\n');
      } catch (e) {
        console.log('writeStream write error = ', e);
        writableStream.once('drain', () => {
          writableStream.write(row + '\n');
        });
      }
    });

    // TODO: fix – occassionally this will call before the last writableStream.write
    writableStream.end();

    const gzip = zlib.createGzip();
    pipeline(readableStream, gzip, writableStream, (err) => {
      console.log('Error occurred');
      console.log(err);
    });

    return {
      success: true,
    };
  }

  /*
    this builds the where clause for list()
  */
  buildWhereClause(
    params: ApplicationQueryParams,
  ): Prisma.ApplicationsWhereInput {
    const toReturn: Prisma.ApplicationsWhereInput[] = [];

    if (params.userId) {
      toReturn.push({
        userAccounts: {
          id: params.userId,
        },
      });
    }
    if (params.listingId) {
      toReturn.push({
        listingId: params.listingId,
      });
    }
    if (params.search) {
      const searchFilter: Prisma.StringFilter = {
        contains: params.search,
        mode: 'insensitive',
      };
      toReturn.push({
        OR: [
          {
            confirmationCode: searchFilter,
          },
          {
            applicant: {
              firstName: searchFilter,
            },
          },
          {
            applicant: {
              lastName: searchFilter,
            },
          },
          {
            applicant: {
              emailAddress: searchFilter,
            },
          },
          {
            applicant: {
              phoneNumber: searchFilter,
            },
          },
          {
            alternateContact: {
              firstName: searchFilter,
            },
          },
          {
            alternateContact: {
              lastName: searchFilter,
            },
          },
          {
            alternateContact: {
              emailAddress: searchFilter,
            },
          },
          {
            alternateContact: {
              phoneNumber: searchFilter,
            },
          },
        ],
      });
    }
    if (params.markedAsDuplicate !== undefined) {
      toReturn.push({
        markedAsDuplicate: params.markedAsDuplicate,
      });
    }
    return {
      AND: toReturn,
    };
  }

  /*
    this is to calculate the `flagged` property of an application
    ideally in the future we save this data on the application so we don't have to keep
    recalculating it
  */
  async getDuplicateFlagsForApplication(applicationId: string): Promise<IdDTO> {
    return this.prisma.applications.findFirst({
      select: {
        id: true,
      },
      where: {
        id: applicationId,
        applicationFlaggedSet: {
          some: {},
        },
      },
    });
  }

  /*
    this will return 1 application or error
  */
  async findOne(applicationId: string): Promise<Application> {
    const rawApplication = await this.findOrThrow(
      applicationId,
      ApplicationViews.details,
    );

    return mapTo(Application, rawApplication);
  }

  /*
    this will create an application
  */
  async create(
    dto: ApplicationCreate,
    forPublic: boolean,
    user?: User,
  ): Promise<Application> {
    // TODO: perms https://github.com/bloom-housing/bloom/issues/3445

    const listing = await this.prisma.listings.findUnique({
      where: {
        id: dto.listings.id,
      },
      include: {
        jurisdictions: true,
      },
    });
    if (forPublic) {
      // if its a public submission
      if (
        listing?.applicationDueDate &&
        dto.submissionDate > listing.applicationDueDate
      ) {
        // if the submission is after the application due date
        throw new BadRequestException(
          `Listing is not open for application submission`,
        );
      }
    }

    const rawApplication = this.prisma.applications.create({
      data: {
        ...dto,
        confirmationCode: this.generateConfirmationCode(),
        applicant: dto.applicant
          ? {
              create: {
                ...dto.applicant,
                applicantAddress: {
                  create: {
                    ...dto.applicant.applicantAddress,
                  },
                },
                applicantWorkAddress: {
                  create: {
                    ...dto.applicant.applicantWorkAddress,
                  },
                },
              },
            }
          : undefined,
        accessibility: dto.accessibility
          ? {
              create: {
                ...dto.accessibility,
              },
            }
          : undefined,
        alternateContact: dto.alternateContact
          ? {
              create: {
                ...dto.alternateContact,
                address: {
                  create: {
                    ...dto.alternateContact.address,
                  },
                },
              },
            }
          : undefined,
        applicationsAlternateAddress: dto.applicationsAlternateAddress
          ? {
              create: {
                ...dto.applicationsAlternateAddress,
              },
            }
          : undefined,
        applicationsMailingAddress: dto.applicationsMailingAddress
          ? {
              create: {
                ...dto.applicationsMailingAddress,
              },
            }
          : undefined,
        listings: dto.listings
          ? {
              connect: {
                id: dto.listings.id,
              },
            }
          : undefined,
        demographics: dto.demographics
          ? {
              create: {
                ...dto.demographics,
              },
            }
          : undefined,
        preferredUnitTypes: dto.preferredUnitTypes
          ? {
              connect: dto.preferredUnitTypes.map((unitType) => ({
                id: unitType.id,
              })),
            }
          : undefined,
        householdMember: dto.householdMember
          ? {
              create: dto.householdMember.map((member) => ({
                ...member,
                sameAddress: member.sameAddress || YesNoEnum.no,
                workInRegion: member.workInRegion || YesNoEnum.no,
                householdMemberAddress: {
                  create: {
                    ...member.householdMemberAddress,
                  },
                },
                householdMemberWorkAddress: {
                  create: {
                    ...member.householdMemberWorkAddress,
                  },
                },
              })),
            }
          : undefined,
        programs: JSON.stringify(dto.programs),
        preferences: JSON.stringify(dto.preferences),
        userAccounts: user
          ? {
              connect: {
                id: user.id,
              },
            }
          : undefined,
      },
      include: view.details,
    });

    if (dto.applicant.emailAddress && forPublic) {
      this.emailService.applicationConfirmation(
        mapTo(Listing, listing),
        dto,
        listing.jurisdictions?.publicUrl,
      );
    }

    return mapTo(Application, rawApplication);
  }

  /*
    this will update an application
    if no application has the id of the incoming argument an error is thrown
  */
  async update(dto: ApplicationUpdate): Promise<Application> {
    const rawApplication = await this.findOrThrow(dto.id);

    // TODO: perms https://github.com/bloom-housing/bloom/issues/3445

    const res = await this.prisma.applications.update({
      where: {
        id: dto.id,
      },
      include: view.details,
      data: {
        ...dto,
        id: undefined,
        applicant: dto.applicant
          ? {
              create: {
                ...dto.applicant,
                applicantAddress: {
                  create: {
                    ...dto.applicant.applicantAddress,
                  },
                },
                applicantWorkAddress: {
                  create: {
                    ...dto.applicant.applicantWorkAddress,
                  },
                },
              },
            }
          : undefined,
        accessibility: dto.accessibility
          ? {
              create: {
                ...dto.accessibility,
              },
            }
          : undefined,
        alternateContact: dto.alternateContact
          ? {
              create: {
                ...dto.alternateContact,
                address: {
                  create: {
                    ...dto.alternateContact.address,
                  },
                },
              },
            }
          : undefined,
        applicationsAlternateAddress: dto.applicationsAlternateAddress
          ? {
              create: {
                ...dto.applicationsAlternateAddress,
              },
            }
          : undefined,
        applicationsMailingAddress: dto.applicationsMailingAddress
          ? {
              create: {
                ...dto.applicationsMailingAddress,
              },
            }
          : undefined,
        listings: dto.listings
          ? {
              connect: {
                id: dto.listings.id,
              },
            }
          : undefined,
        demographics: dto.demographics
          ? {
              create: {
                ...dto.demographics,
              },
            }
          : undefined,
        preferredUnitTypes: dto.preferredUnitTypes
          ? {
              connect: dto.preferredUnitTypes.map((unitType) => ({
                id: unitType.id,
              })),
            }
          : undefined,
        householdMember: dto.householdMember
          ? {
              create: dto.householdMember.map((member) => ({
                ...member,
                sameAddress: member.sameAddress || YesNoEnum.no,
                workInRegion: member.workInRegion || YesNoEnum.no,
                householdMemberAddress: {
                  create: {
                    ...member.householdMemberAddress,
                  },
                },
                householdMemberWorkAddress: {
                  create: {
                    ...member.householdMemberWorkAddress,
                  },
                },
              })),
            }
          : undefined,
        programs: JSON.stringify(dto.programs),
        preferences: JSON.stringify(dto.preferences),
      },
    });

    await this.updateListingApplicationEditTimestamp(res.listingId);
    return mapTo(Application, res);
  }

  /*
    this will mark an application as deleted by setting the deletedAt column for the application
  */
  async delete(applicationId: string): Promise<SuccessDTO> {
    const application = await this.findOrThrow(applicationId);

    // TODO: perms https://github.com/bloom-housing/bloom/issues/3445

    await this.updateListingApplicationEditTimestamp(application.listingId);
    await this.prisma.applications.update({
      where: {
        id: applicationId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      success: true,
    };
  }

  /*
    finds the requested listing or throws an error
  */
  async findOrThrow(applicationId: string, includeView?: ApplicationViews) {
    const res = await this.prisma.applications.findUnique({
      where: {
        id: applicationId,
      },
      include: view[includeView] ?? undefined,
    });

    if (!res) {
      throw new NotFoundException(
        `applicationId ${applicationId} was requested but not found`,
      );
    }

    // convert the programs and preferences back to json
    if (res.programs) {
      res.programs = JSON.parse(res.programs as string);
    }
    if (res.preferences) {
      res.preferences = JSON.parse(res.preferences as string);
    }

    return res;
  }

  /*
    updates a listing's lastApplicationUpdateAt date
  */
  async updateListingApplicationEditTimestamp(
    listingId: string,
  ): Promise<void> {
    await this.prisma.listings.update({
      where: {
        id: listingId,
      },
      data: {
        lastApplicationUpdateAt: new Date(),
      },
    });
  }

  /*
    generates a random confirmation code
  */
  generateConfirmationCode(): string {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  private async authorizeCSVExport(user, listingId): Promise<void> {
    /**
     * Checking authorization for each application is very expensive.
     * By making listingId required, we can check if the user has update permissions for the listing, since right now if a user has that
     * they also can run the export for that listing
     */
    /* const jurisdictionId =
      await this.listingService.getJurisdictionIdByListingId(listingId);

    await this.authzService.canOrThrow(user, 'listing', authzActions.update, {
      id: listingId,
      jurisdictionId,
    }); */
  }
}
