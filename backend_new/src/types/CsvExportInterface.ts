import { StreamableFile } from '@nestjs/common';
import { Request } from 'express';
import { ApplicationCsvQueryParams } from '../dtos/applications/application-csv-query-params.dto';
import { ListingCsvQueryParams } from '../dtos/listings/listing-csv-query-params.dto';
import Listing from '../dtos/listings/listing.dto';

export type CsvHeader = {
  path: string;
  label: string;
  format?: (val: unknown) => unknown;
};

type OneOrMoreArgs<T> = { 0: T } & Array<T>;

export interface CsvExporterServiceInterface {
  exportFile: <
    QueryParams extends ApplicationCsvQueryParams & ListingCsvQueryParams,
  >(
    req: Request,
    queryParams?: QueryParams,
    zipFilePath?: string,
  ) => Promise<StreamableFile>;
  createCsv<
    QueryParams extends ApplicationCsvQueryParams & ListingCsvQueryParams,
  >(
    filename: string,
    queryParams?: QueryParams,
    listings?: Listing[],
  ): Promise<void>;
  getCsvHeaders(...args: OneOrMoreArgs<unknown>): Promise<CsvHeader[]>;
  authorizeCSVExport(user: unknown, id?: string): Promise<void>;
}
