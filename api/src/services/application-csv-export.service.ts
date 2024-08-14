import fs, { createReadStream } from 'fs';
import { join } from 'path';
import { ForbiddenException, Injectable, StreamableFile } from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { view } from './application.service';
import { PrismaService } from './prisma.service';
import { MultiselectQuestionService } from './multiselect-question.service';
import { ApplicationCsvQueryParams } from '../dtos/applications/application-csv-query-params.dto';
import { ApplicationMultiselectQuestion } from '../dtos/applications/application-multiselect-question.dto';
import { User } from '../dtos/users/user.dto';
import { ListingService } from './listing.service';
import { PermissionService } from './permission.service';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { CsvHeader } from '../types/CsvExportInterface';
import { mapTo } from '../utilities/mapTo';
import { Application } from '../dtos/applications/application.dto';
import { getExportHeaders } from '../utilities/application-export-helpers';

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
export class ApplicationCsvExporterService {
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
    await this.authorizeCSVExport(user, queryParams.id);

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

  async authorizeCSVExport(user, listingId): Promise<void> {
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
}
