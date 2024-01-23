import fs, { createReadStream } from 'fs';
import { join } from 'path';
import { Injectable, StreamableFile } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import archiver from 'archiver';
import { view } from './application.service';
import { PrismaService } from './prisma.service';
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
import {
  CsvExporterServiceInterface,
  CsvHeader,
} from '../types/CsvExportInterface';
import { mapTo } from '../utilities/mapTo';

view.csv = {
  ...view.details,
  applicationFlaggedSet: true,
  listings: false,
};

export const typeMap = {
  SRO: 'SRO',
  studio: 'Studio',
  oneBdrm: 'One Bedroom',
  twoBdrm: 'Two Bedroom',
  threeBdrm: 'Three Bedroom',
  fourBdrm: 'Four+ Bedroom',
};

@Injectable()
export class ApplicationCsvExporterService
  implements CsvExporterServiceInterface
{
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
    queryParams: QueryParams,
    zipFilePath: string,
  ): Promise<StreamableFile> {
    await this.authorizeCSVExport(
      mapTo(User, req['user']),
      queryParams.listingId,
    );
    const filename = join(
      process.cwd(),
      `src/temp/listing-${
        queryParams.listingId
      }-applications-${new Date().getTime()}`,
    );

    const CSV_FILE = `${filename}.csv`;
    const XLSX_FILE = `${filename}.xlsx`;

    await this.createCsv(CSV_FILE, queryParams);

    // const workbook = new Excel.Workbook();

    // workbook.csv.readFile(CSV_FILE).then(async () => {
    //   workbook.getWorksheet(1).name = 'Primary Sheet';
    //   await workbook.xlsx.writeFile(XLSX_FILE);
    // });

    // workbook.csv.readFile(CSV_FILE).then(async () => {
    //   workbook.getWorksheet(2).name = 'Secondary Sheet';
    //   await workbook.xlsx.writeFile(XLSX_FILE);
    // });

    // const applicationsWorkbook = createReadStream(XLSX_FILE);
    // applicationsWorkbook.on('end', () => {
    //   fs.unlink(XLSX_FILE, (err) => {
    //     if (err) {
    //       console.error(`Error deleting ${XLSX_FILE}`);
    //       throw err;
    //     }
    //   });
    // });

    const applicationsCsv = createReadStream(CSV_FILE);
    applicationsCsv.on('end', () => {
      fs.unlink(CSV_FILE, (err) => {
        if (err) {
          console.error(`Error deleting ${CSV_FILE}`);
          throw err;
        }
      });
    });

    return new Promise((resolve) => {
      // Create a writable stream to the zip file
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });
      output.on('close', () => {
        const zipFile = createReadStream(zipFilePath);
        resolve(new StreamableFile(zipFile));
        fs.unlink(zipFilePath, (err) => {
          if (err) {
            console.error(`Error deleting ${zipFilePath}`);
            throw err;
          }
        });
      });

      archive.pipe(output);
      archive.append(CSV_FILE, { name: 'applications.csv' });
      archive.finalize();
    });
  }

  /**
   *
   * @param filename
   * @param queryParams
   * @returns a promise with SuccessDTO
   */
  async createCsv(
    filename: string,
    queryParams: ApplicationCsvQueryParams,
  ): Promise<void> {
    if (queryParams.includeDemographics) {
      view.csv.demographics = true;
    }

    const applications = await this.prisma.applications.findMany({
      include: view.csv,
      where: {
        listingId: queryParams.listingId,
      },
    });

    // get all multiselect questions for a listing to build csv headers
    const multiSelectQuestions =
      await this.multiselectQuestionService.findByListingId(
        queryParams.listingId,
      );

    // get maxHouseholdMembers or associated to the selected applications
    const maxHouseholdMembers = await this.maxHouseholdMembers(
      applications.map((application) => application.id),
    );

    const csvHeaders = await this.getCsvHeaders(
      maxHouseholdMembers,
      multiSelectQuestions,
      queryParams.includeDemographics,
    );

    return new Promise((resolve, reject) => {
      // create stream
      const writableStream = fs.createWriteStream(`${filename}`);
      writableStream
        .on('error', (err) => {
          console.log('csv writestream error');
          console.log(err);
          reject(err);
        })
        .on('finish', () => {
          console.log('finished');
        })
        .on('close', () => {
          console.log('stream closed');
          resolve();
        })
        .on('open', () => {
          writableStream.write(
            csvHeaders
              .map((header) => `"${header.label.replace(/"/g, `""`)}"`)
              .join(',') + '\n',
          );

          // now loop over applications and write them to file
          applications.forEach((app) => {
            let row = '';
            let preferences: ApplicationMultiselectQuestion[];
            csvHeaders.forEach((header, index) => {
              let multiselectQuestionValue = false;
              let parsePreference = false;
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
                  // there aren't typically many preferences, but if there, then a object map should be created and used
                  const preference = preferences?.find(
                    (preference) => preference.multiselectQuestionId === curr,
                  );
                  multiselectQuestionValue = true;
                  return preference;
                }

                // sets parsePreference to true, for the next iteration
                if (curr === 'preferences') {
                  parsePreference = true;
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
              value = value === undefined ? '' : value === null ? '' : value;
              if (header.format) {
                value = header.format(value);
              }

              row += value ? `"${value.toString().replace(/"/g, `""`)}"` : '';
              if (index < csvHeaders.length - 1) {
                row += ',';
              }
            });

            try {
              writableStream.write(row + '\n');
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

  async maxHouseholdMembers(applicationIds: string[]): Promise<number> {
    const maxHouseholdMembersRes = await this.prisma.householdMember.groupBy({
      by: ['applicationId'],
      _count: {
        applicationId: true,
      },
      where: {
        OR: applicationIds.map((id) => {
          return { applicationId: id };
        }),
      },
      orderBy: {
        _count: {
          applicationId: 'desc',
        },
      },
      take: 1,
    });

    return maxHouseholdMembersRes && maxHouseholdMembersRes.length
      ? maxHouseholdMembersRes[0]._count.applicationId
      : 0;
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

  async getCsvHeaders(
    maxHouseholdMembers: number,
    multiSelectQuestions: MultiselectQuestion[],
    includeDemographics = false,
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
    multiSelectQuestions
      .filter((question) => question.applicationSection === 'preferences')
      .forEach((question) => {
        headers.push({
          path: `preferences.${question.id}.claimed`,
          label: `Preference ${question.text}`,
          format: (val: boolean): string => (val ? 'claimed' : ''),
        });
        /**
         * there are other input types for extra data besides address
         * that are not used on the old backend, but could be added here
         */
        question.options
          ?.filter((option) => option.collectAddress)
          .forEach(() => {
            headers.push({
              path: `preferences.${question.id}.address`,
              label: `Preference ${question.text} - Address`,
              format: (val: ApplicationMultiselectQuestion): string =>
                this.multiselectQuestionFormat(val),
            });
          });
      });

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

    return headers;
  }

  addressToString(address: Address): string {
    return `${address.street}${address.street2 ? ' ' + address.street2 : ''} ${
      address.city
    }, ${address.state} ${address.zipCode}`;
  }

  multiselectQuestionFormat(question: ApplicationMultiselectQuestion): string {
    if (!question) return '';
    const address = question.options.reduce((_, curr) => {
      const extraData = curr.extraData.find((data) => data.type === 'address');
      return extraData ? extraData.value : '';
    }, {}) as Address;
    return this.addressToString(address);
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
}
