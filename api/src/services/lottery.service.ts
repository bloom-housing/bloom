import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import {
  LotteryStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from '@prisma/client';
import archiver from 'archiver';
import Excel, { Column, Row } from 'exceljs';
import { Request as ExpressRequest, Response } from 'express';
import fs, { createReadStream } from 'fs';
import { join } from 'path';
import { view } from './application.service';
import { ApplicationCsvQueryParams } from '../dtos/applications/application-csv-query-params.dto';
import { ApplicationMultiselectQuestion } from '../dtos/applications/application-multiselect-question.dto';
import { Application } from '../dtos/applications/application.dto';
import MultiselectQuestion from '../dtos/multiselect-questions/multiselect-question.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { User } from '../dtos/users/user.dto';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { OrderByEnum } from '../enums/shared/order-by-enum';
import { ListingService } from './listing.service';
import { MultiselectQuestionService } from './multiselect-question.service';
import { PermissionService } from './permission.service';
import { PrismaService } from './prisma.service';
import { CsvHeader } from '../types/CsvExportInterface';
import { getExportHeaders } from '../utilities/application-export-helpers';
import { mapTo } from '../utilities/mapTo';

view.csv = {
  ...view.details,
  applicationFlaggedSet: {
    select: {
      id: true,
    },
  },
  listings: false,
};
const NUMBER_TO_PAGINATE_BY = 500;

@Injectable()
export class LotteryService {
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
   * @returns generates the lottery results for a listing
   */
  async lotteryGenerate<QueryParams extends ApplicationCsvQueryParams>(
    req: ExpressRequest,
    res: Response,
    queryParams: QueryParams,
  ): Promise<SuccessDTO> {
    const user = mapTo(User, req['user']);
    if (!user?.userRoles?.isAdmin) {
      throw new ForbiddenException();
    }
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

    try {
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

      await this.listingService.lotteryStatus(
        {
          listingId: queryParams.listingId,
          lotteryStatus: LotteryStatusEnum.ran,
        },
        user,
      );
    } catch (e) {
      console.error(e);
      await this.listingService.lotteryStatus(
        {
          listingId: queryParams.listingId,
          lotteryStatus: LotteryStatusEnum.errored,
        },
        user,
      );
      return { success: false };
    }
    return { success: true };
  }

  /**
   * @param listingId listing id we are going to randomize
   * @param applications set of applications to generate lottery ranks for
   * @param preferencesOnListing the set of preferences on the listing
   * @description creates a random rank for the applications on this lottery as well as the preference specific ranks
   */
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

  /**
   * @param filterApplicationsArray the filtered applications we generate the random ordering for
   * @returns ranked array
   */
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
    await this.authorizeLotteryExport(user, queryParams.listingId);

    const workbook = new Excel.Workbook();

    const filename = join(
      process.cwd(),
      `src/temp/lottery-listing-${queryParams.listingId}-applications-${
        user.id
      }-${new Date().getTime()}.xlsx`,
    );

    const zipFilePath = join(
      process.cwd(),
      `src/temp/lottery-listing-${queryParams.listingId}-applications-${
        user.id
      }-${new Date().getTime()}.zip`,
    );

    await this.createLotterySheet(workbook, {
      ...queryParams,
      includeDemographics: true,
    });

    await workbook.xlsx.writeFile(filename);

    const readStream = createReadStream(filename);

    return new Promise((resolve) => {
      // Create a writable stream to the zip file
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });
      output.on('close', () => {
        const zipFile = createReadStream(zipFilePath);
        resolve(new StreamableFile(zipFile));
      });

      archive.pipe(output);
      archive.append(readStream, {
        name: `lottery-${queryParams.listingId}-${new Date().getTime()}.xlsx`,
      });
      archive.finalize();
    });
  }

  /**
   *
   * @param filename
   * @param queryParams
   * @returns generates the lottery sheet
   */
  async createLotterySheet<QueryParams extends ApplicationCsvQueryParams>(
    workbook: Excel.Workbook,
    queryParams: QueryParams,
  ): Promise<void> {
    let applications = await this.prisma.applications.findMany({
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

    const columns = getExportHeaders(
      maxHouseholdMembers,
      multiSelectQuestions,
      queryParams.timeZone,
      queryParams.includeDemographics,
      true,
    );

    applications = applications.filter(
      (elem) => !!elem.applicationLotteryPositions?.length,
    );

    applications = applications.sort(
      (a, b) =>
        a.applicationLotteryPositions[0].ordinal -
        b.applicationLotteryPositions[0].ordinal,
    );
    await this.lotteryExportHelper(
      workbook,
      mapTo(Application, applications),
      columns,
      queryParams,
      true,
    );
  }

  /**
   * @param user the user attempting to get the lottery export
   * @param listingId the listing we are trying the export is for
   */
  async authorizeLotteryExport(user, listingId): Promise<void> {
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
   * @param workbook the spreadsheet we'll be adding data too
   * @param applications the full list of partial applications
   * @param csvHeaders the headers and renderers of the export
   * @param queryParams the incoming param args
   * @param forLottery whether we are getting the lottery results or not
   * @returns void but writes the output to a file
   */
  async lotteryExportHelper(
    workbook: Excel.Workbook,
    applications: Application[],
    csvHeaders: CsvHeader[],
    queryParams: ApplicationCsvQueryParams,
    forLottery = false,
  ): Promise<void> {
    // create raw rank spreadsheet
    const rawRankSpreadsheet = workbook.addWorksheet('Raw');
    rawRankSpreadsheet.columns = this.buildExportColumns(csvHeaders);

    // build row data
    const promiseArray: Promise<Partial<Row>[]>[] = [];
    for (let i = 0; i < applications.length; i += NUMBER_TO_PAGINATE_BY) {
      promiseArray.push(
        new Promise(async (resolve) => {
          // grab applications NUMBER_TO_PAGINATE_BY at a time
          let paginatedApplications = await this.prisma.applications.findMany({
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
              markedAsDuplicate: forLottery ? false : undefined,
              id: {
                in: applications
                  .slice(i, i + NUMBER_TO_PAGINATE_BY)
                  .map((app) => app.id),
              },
            },
          });
          if (forLottery) {
            paginatedApplications = paginatedApplications.sort(
              (a, b) =>
                a.applicationLotteryPositions[0].ordinal -
                b.applicationLotteryPositions[0].ordinal,
            );
          }
          const rows: Partial<Row>[] = [];
          paginatedApplications.forEach((app) => {
            const row: Partial<Row> = {};
            let preferences: ApplicationMultiselectQuestion[];
            let programs: ApplicationMultiselectQuestion[];
            csvHeaders.forEach((header) => {
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
                      (app.preferences as unknown as ApplicationMultiselectQuestion[]) ||
                      [];
                  }
                  parsePreference = false;
                  // there aren't typically many preferences, but if there, then a object map should be created and used
                  const preference = preferences.find(
                    (preference) => preference.key === curr,
                  );
                  multiselectQuestionValue = true;
                  return preference;
                } else if (parseProgram) {
                  // curr should equal the preference id we're pulling from
                  if (!programs) {
                    programs =
                      (app.programs as unknown as ApplicationMultiselectQuestion[]) ||
                      [];
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
              value = value === undefined ? '' : value === null ? '' : value;
              if (header.format) {
                value = header.format(value);
              }

              row[`${header.path}`] = value ? value.toString() : '';
            });
            rows.push(row);
          });
          resolve(rows);
        }),
      );
    }
    const res = await Promise.all(promiseArray);

    // add rows to spreadsheet
    res.forEach((elem) => {
      rawRankSpreadsheet.addRows(elem);
    });
  }

  buildExportColumns(csvHeaders: CsvHeader[]): Partial<Column>[] {
    const res: Partial<Column>[] = csvHeaders.map((header) => ({
      key: header.path,
      header: header.label,
    }));

    return res;
  }
}
