import { ForbiddenException, Injectable, StreamableFile } from '@nestjs/common';
import dayjs from 'dayjs';
import { Request as ExpressRequest, Response } from 'express';
import fs, { createReadStream } from 'fs';
import { join } from 'path';
import {
  CsvExporterServiceInterface,
  CsvHeader,
} from '../types/CsvExportInterface';
import { PrismaService } from './prisma.service';
import { User } from '../dtos/users/user.dto';
import { UserRole } from '../dtos/users/user-role.dto';
import { mapTo } from '../utilities/mapTo';
import { IdDTO } from '../dtos/shared/id.dto';
import { buildWhereClause } from '../utilities/build-user-where';

@Injectable()
export class UserCsvExporterService implements CsvExporterServiceInterface {
  constructor(private prisma: PrismaService) {}
  /**
   *
   * @param queryParams
   * @param req
   * @returns a promise containing a streamable file
   */
  async exportFile<QueryParams>(
    req: ExpressRequest,
    res: Response,
    queryParams?: QueryParams,
  ): Promise<StreamableFile> {
    const user = mapTo(User, req['user']);
    await this.authorizeCSVExport(mapTo(User, req['user']));
    const filename = join(
      process.cwd(),
      `src/temp/users-${user.id}-${new Date().getTime()}.csv`,
    );
    await this.createCsv(filename, queryParams, { user: user });
    const file = createReadStream(filename);
    return new StreamableFile(file);
  }

  /**
   *
   * @param filename
   * @param queryParams
   * @returns a promise with SuccessDTO
   */
  async createCsv<QueryParams>(
    filename: string,
    queryParams: QueryParams,
    optionalParams: { user: User },
  ): Promise<void> {
    const where = buildWhereClause(
      { filter: [{ isPortalUser: true }] },
      optionalParams.user,
    );
    const users = await this.prisma.userAccounts.findMany({
      where: where,
      include: {
        userRoles: true,
        listings: true,
      },
    });
    const csvHeaders = await this.getCsvHeaders();
    return new Promise((resolve, reject) => {
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
        .on('open', () => {
          writableStream.write(
            csvHeaders
              .map((header) => `"${header.label.replace(/"/g, `""`)}"`)
              .join(',') + '\n',
          );

          // now loop over users and write them to file
          users.forEach((user) => {
            let row = '';
            csvHeaders.forEach((header, index) => {
              let value = header.path.split('.').reduce((acc, curr) => {
                // handles working with arrays
                if (!isNaN(Number(curr))) {
                  const index = Number(curr);
                  return acc[index];
                }

                if (acc === null || acc === undefined) {
                  return '';
                }
                return acc[curr];
              }, user);
              value = value === undefined ? '' : value === null ? '' : value;

              if (header.format) {
                value = header.format(value, user);
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
                writableStream.write(row + '\n');
              });
            }
          });

          writableStream.end();
        });
    });
  }

  async getCsvHeaders(): Promise<CsvHeader[]> {
    const headers: CsvHeader[] = [
      {
        path: 'firstName',
        label: 'First Name',
      },
      {
        path: 'lastName',
        label: 'Last Name',
      },
      {
        path: 'email',
        label: 'Email',
      },
      {
        path: 'userRoles',
        label: 'Role',
        format: (val: UserRole): string => {
          const roles: string[] = [];
          if (val?.isAdmin) {
            roles.push('Administrator');
          }
          if (val?.isPartner) {
            roles.push('Partner');
          }
          if (val?.isJurisdictionalAdmin) {
            roles.push('Jurisdictional Admin');
          }
          return roles.join(', ');
        },
      },
      {
        path: 'createdAt',
        label: 'Date Created',
        format: (val: string): string => {
          return dayjs(val).format('MM-DD-YYYY');
        },
      },
      {
        path: 'confirmedAt',
        label: 'Status',
        format: (val: string): string => (val ? 'Confirmed' : 'Unconfirmed'),
      },
      {
        path: 'listings',
        label: 'Listing Names',
        format: (val: IdDTO[]): string => {
          return val?.length
            ? val?.map((listing) => listing.name).join(', ')
            : '';
        },
      },
      {
        path: 'listings',
        label: 'Listing Ids',
        format: (val: IdDTO[]): string => {
          return val?.length
            ? val?.map((listing) => listing.id).join(', ')
            : '';
        },
      },
      {
        path: 'lastLoginAt',
        label: 'Last Logged In',
        format: (val: string): string => {
          return dayjs(val).format('MM-DD-YYYY');
        },
      },
    ];

    return headers;
  }

  async authorizeCSVExport(user?: User): Promise<void> {
    if (
      user &&
      (user.userRoles?.isAdmin || user.userRoles?.isJurisdictionalAdmin)
    ) {
      return;
    } else {
      throw new ForbiddenException();
    }
  }
}
