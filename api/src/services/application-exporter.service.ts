import { ForbiddenException, Injectable, StreamableFile } from '@nestjs/common';
import { MultiselectQuestionsApplicationSectionEnum } from '@prisma/client';
import archiver from 'archiver';
import Excel, { Column, Row } from 'exceljs';
import { Request as ExpressRequest, Response } from 'express';
import fs, { createReadStream } from 'fs';
import { join } from 'path';
import { view } from './application.service';
import { Application } from '../dtos/applications/application.dto';
import { ApplicationCsvQueryParams } from '../dtos/applications/application-csv-query-params.dto';
import { ApplicationMultiselectQuestion } from '../dtos/applications/application-multiselect-question.dto';
import { IdDTO } from '../dtos/shared/id.dto';
import { User } from '../dtos/users/user.dto';
import { OrderByEnum } from '../enums/shared/order-by-enum';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { ListingService } from './listing.service';
import { MultiselectQuestionService } from './multiselect-question.service';
import { PermissionService } from './permission.service';
import { PrismaService } from './prisma.service';
import { CsvHeader } from '../types/CsvExportInterface';
import { getExportHeaders } from '../utilities/application-export-helpers';
import { mapTo } from '../utilities/mapTo';

import process from 'process';

view.csv = {
  ...view.details,
  applicationFlaggedSet: {
    select: {
      id: true,
    },
  },
  listings: false,
};
const NUMBER_TO_PAGINATE_BY = 250;

@Injectable()
export class ApplicationExporterService {
  readonly dateFormat: string = 'MM-DD-YYYY hh:mm:ssA z';
  constructor(
    private prisma: PrismaService,
    private multiselectQuestionService: MultiselectQuestionService,
    private listingService: ListingService,
    private permissionService: PermissionService,
  ) {}

  // csv export functions
  /**
   *
   * @param queryParams
   * @param req
   * @returns a promise containing a streamable file
   */
  async csvExport<QueryParams extends ApplicationCsvQueryParams>(
    req: ExpressRequest,
    res: Response,
    queryParams: QueryParams,
  ): Promise<StreamableFile> {
    const user = mapTo(User, req['user']);
    await this.authorizeExport(user, queryParams.id);

    const filename = join(
      process.cwd(),
      `src/temp/listing-${queryParams.id}-applications-${
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
        listingId: queryParams.id,
        deletedAt: null,
      },
    });

    // get all multiselect questions for a listing to build csv headers
    const multiSelectQuestions =
      await this.multiselectQuestionService.findByListingId(queryParams.id);

    // get maxHouseholdMembers associated to the selected applications
    let maxHouseholdMembers = 0;
    applications.forEach((app) => {
      if (app.householdMember?.length > maxHouseholdMembers) {
        maxHouseholdMembers = app.householdMember.length;
      }
    });

    const csvHeaders = getExportHeaders(
      maxHouseholdMembers,
      multiSelectQuestions,
      queryParams.timeZone,
      queryParams.includeDemographics,
      false,
      this.dateFormat,
    );

    return this.csvExportHelper(
      filename,
      mapTo(Application, applications),
      csvHeaders,
      queryParams,
    );
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
                              gender: true,
                              sexualOrientation: true,
                              howDidYouHear: true,
                              race: true,
                              spokenLanguage: true,
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
                      listingId: queryParams.id,
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
                          (program) => program.key === curr,
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
                    if (value === undefined) {
                      value = '';
                    } else if (value === null) {
                      value = '';
                    }

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

  // spreadsheet export functions
  /**
   *
   * @param queryParams
   * @param req
   * @returns generates the lottery export file via helper function and returns the streamable file
   */
  async spreadsheetExport<QueryParams extends ApplicationCsvQueryParams>(
    req: ExpressRequest,
    res: Response,
    queryParams: QueryParams,
    forLottery = true,
  ): Promise<StreamableFile> {
    const user = mapTo(User, req['user']);
    await this.authorizeExport(user, queryParams.id);

    const workbook = new Excel.Workbook();

    const filename = join(
      process.cwd(),
      `src/temp/${forLottery ? 'lottery-' : ''}listing-${
        queryParams.id
      }-applications-${user.id}-${new Date().getTime()}.xlsx`,
    );

    const zipFilePath = join(
      process.cwd(),
      `src/temp/${forLottery ? 'lottery-' : ''}listing-${
        queryParams.id
      }-applications-${user.id}-${new Date().getTime()}.zip`,
    );

    await this.createSpreadsheets(
      workbook,
      {
        ...queryParams,
      },
      forLottery,
    );

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
        name: `${forLottery ? 'lottery-' : ''}${
          queryParams.id
        }-${new Date().getTime()}.xlsx`,
      });
      archive.finalize();
    });
  }

  /**
   *
   * @param filename
   * @param queryParams
   * @param forLottery whether this is for a lottery export or not
   * @returns generates the lottery sheets
   */
  async createSpreadsheets<QueryParams extends ApplicationCsvQueryParams>(
    workbook: Excel.Workbook,
    queryParams: QueryParams,
    forLottery = false,
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
        applicationLotteryPositions: forLottery
          ? {
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
            }
          : undefined,
      },
      where: {
        listingId: queryParams.id,
        deletedAt: null,
        markedAsDuplicate: forLottery ? false : undefined,
      },
    });

    // get all multiselect questions for a listing to build csv headers
    const multiSelectQuestions =
      await this.multiselectQuestionService.findByListingId(queryParams.id);

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
      forLottery,
    );

    if (forLottery) {
      applications = applications.filter(
        (elem) => !!elem.applicationLotteryPositions?.length,
      );

      applications = applications.sort(
        (a, b) =>
          a.applicationLotteryPositions[0].ordinal -
          b.applicationLotteryPositions[0].ordinal,
      );
    }
    const mappedApps = mapTo(Application, applications);

    await this.generateSpreadsheetData(
      workbook,
      mappedApps,
      columns,
      queryParams,
      forLottery,
    );

    if (forLottery) {
      const preferences = multiSelectQuestions.filter(
        (question) =>
          question.applicationSection ===
          MultiselectQuestionsApplicationSectionEnum.preferences,
      );
      for (const preference of preferences) {
        await this.generateSpreadsheetData(
          workbook,
          mappedApps,
          columns,
          queryParams,
          forLottery,
          {
            id: preference.id,
            name: preference.text,
          },
        );
      }
    }
  }

  /**
   *
   * @param workbook the spreadsheet we'll be adding data too
   * @param applications the full list of partial applications
   * @param csvHeaders the headers and renderers of the export
   * @param queryParams the incoming param args
   * @param forLottery whether we are getting the lottery results or not
   * @param preference if present, then builds the preference specific spreadsheet page
   * @returns void but writes the output to a file
   */
  async generateSpreadsheetData(
    workbook: Excel.Workbook,
    applications: Application[],
    csvHeaders: CsvHeader[],
    queryParams: ApplicationCsvQueryParams,
    forLottery = false,
    preference?: IdDTO,
  ): Promise<void> {
    // create a spreadsheet. If the preference is passed in use that as a title otherwise 'raw'
    const spreadsheet = this.createNewWorksheet(
      workbook,
      forLottery,
      preference,
    );
    spreadsheet.columns = this.buildExportColumns(csvHeaders, preference);

    const filteredApplications = preference
      ? applications.filter((app) =>
          app.preferences.some(
            (pref) =>
              (pref.multiselectQuestionId === preference.id ||
                pref.key === preference.name) &&
              pref.claimed,
          ),
        )
      : applications;

    // build row data
    const promiseArray: Promise<Partial<Row>[]>[] = [];

    for (
      let i = 0;
      i < filteredApplications.length;
      i += NUMBER_TO_PAGINATE_BY
    ) {
      const slicedApplications = filteredApplications.slice(
        i,
        i + NUMBER_TO_PAGINATE_BY,
      );

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
                      multiselectQuestionId: preference ? preference.id : null,
                    },
                  }
                : false,
            },
            where: {
              listingId: queryParams.id,
              deletedAt: null,
              markedAsDuplicate: forLottery ? false : undefined,
              id: {
                in: slicedApplications.map((app) => app.id),
              },
            },
          });

          if (forLottery) {
            // We need to filter out applications that have "claimed" preference but they really chose to opt out
            // And then it is sorted based on the ordinal value
            paginatedApplications = paginatedApplications
              .filter((app) => app.applicationLotteryPositions?.length)
              .sort(
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

            if (preference) {
              row['Raw Lottery Rank'] = slicedApplications.find(
                (slicedApp) => slicedApp.id === app.id,
              ).applicationLotteryPositions[0].ordinal;
            }

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
      spreadsheet.addRows(elem);
    });
  }

  /**
   *
   * @param workbook the work book we are creating a new sheet inside of
   * @param forLottery if this is being created for a lottery export or not
   * @param preference if this is for a lottery preference sheet
   * @returns a new worksheet
   */
  createNewWorksheet(
    workbook: Excel.Workbook,
    forLottery: boolean,
    preference?: IdDTO,
  ): Excel.Worksheet {
    if (forLottery) {
      return workbook.addWorksheet(
        preference
          ? preference.name.replace(/[\*\?\:\\\/]/, '-')
          : 'Raw Lottery Rank',
      );
    }
    return workbook.addWorksheet('Application Export');
  }

  /**
   *
   * @param csvHeaders the export headers
   * @param preference optional, this is to indicate whether this is for a preference sheet or not
   * @returns an array of excel column data
   */
  buildExportColumns(
    csvHeaders: CsvHeader[],
    preference?: IdDTO,
  ): Partial<Column>[] {
    const res: Partial<Column>[] = csvHeaders.map((header) => ({
      key: header.path,
      header: header.label,
    }));

    if (preference) {
      const indx = res.findIndex(
        (header) => header.header === 'Raw Lottery Rank',
      );

      res[indx].header = `${preference.name} Rank`;

      res.splice(indx, 0, {
        key: 'Raw Lottery Rank',
        header: 'Raw Lottery Rank',
      });
    }
    return res;
  }

  // shared functions
  /**
   *
   * @param user the user requesting the export
   * @param listingId the listing id the applications will be tied to
   */
  async authorizeExport(user, listingId): Promise<void> {
    /**
     * Checking authorization for each application is very expensive.
     * By making listingId required, we can check if the user has update permissions for the listing, since right now if a user has that
     * they also can run the export for that listing
     */
    if (user?.userRoles?.isLimitedJurisdictionalAdmin)
      throw new ForbiddenException();

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
