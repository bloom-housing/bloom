import { StreamableFile } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApplicationCsvQueryParams } from '../dtos/applications/application-csv-query-params.dto';
import { ListingCsvQueryParams } from '../dtos/listings/listing-csv-query-params.dto';
import Listing from '../dtos/listings/listing.dto';
import { User } from '../dtos/users/user.dto';

export type CsvHeader = {
  path: string;
  label: string;
  format?: (val: unknown, fullObject?: unknown) => unknown;
};

export interface LotteryHeader {
  path: string;
  key?: string;
  header: string;
  format?: (val: unknown, fullObject?: unknown) => unknown;
}

type OneOrMoreArgs<T> = { 0: T } & Array<T>;

export interface CsvExporterServiceInterface {
  exportFile: <
    QueryParams extends ApplicationCsvQueryParams & ListingCsvQueryParams,
  >(
    req: Request,
    res: Response,
    queryParams?: QueryParams,
  ) => Promise<StreamableFile>;
  createCsv<
    QueryParams extends ApplicationCsvQueryParams & ListingCsvQueryParams,
  >(
    filename: string,
    queryParams?: QueryParams,
    optionalParams?: { listings?: Listing[]; user?: User },
  ): Promise<void>;
  getCsvHeaders(...args: OneOrMoreArgs<unknown>): Promise<CsvHeader[]>;
  authorizeCSVExport(user: unknown, id?: string): Promise<void>;
}
