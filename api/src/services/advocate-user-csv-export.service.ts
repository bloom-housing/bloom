import { ForbiddenException, Injectable, StreamableFile } from '@nestjs/common';
import {
  CsvExporterServiceInterface,
  CsvHeader,
} from 'src/types/CsvExportInterface';
import { PrismaService } from './prisma.service';
import { Request as ExpressRequest, Response } from 'express';
import { mapTo } from '../utilities/mapTo';
import { User } from '../dtos/users/user.dto';
import { join } from 'path';
import Listing from '../dtos/listings/listing.dto';
import fs, { createReadStream } from 'fs';
import { buildWhereClause } from '../utilities/build-user-where';
import { UserQueryParams } from '../dtos/users/user-query-param.dto';
import { Agency } from '@prisma/client';
import dayjs from 'dayjs';

@Injectable()
export class AdvocateUserCsvExporterService
  implements CsvExporterServiceInterface
{
  readonly dateFormat: string = 'YYYY-MM-DD hh:mm:ss A';
  timeZone = process.env.TIME_ZONE;

  constructor(private prisma: PrismaService) {}

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

  async createCsv<QueryParams>(
    filename: string,
    queryParams?: QueryParams,
    optionalParams?: { listings?: Listing[]; user?: User },
  ): Promise<void> {
    const where = buildWhereClause(
      {
        filter: [{ isAdvocateUser: true }],
      } as UserQueryParams,
      optionalParams.user,
    );

    const users = await this.prisma.userAccounts.findMany({
      where: where,
      include: {
        agency: true,
      },
    });

    const csvHeaders = await this.getCsvHeaders();
    return new Promise((resolve, reject) => {
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
        path: 'agency',
        label: 'Agency',
        format: (val) => (val as Agency).name,
      },
      {
        path: 'email',
        label: 'Email',
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
        path: 'isApproved',
        label: 'Is Approved',
        format: (value) => {
          if (value === null || typeof value == 'undefined') return '';
          else if (value) return 'Yes';
          else return 'No';
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
