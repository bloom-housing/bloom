import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ListingCsvUploadCreatedRow {
  @Expose()
  @ApiProperty({
    description:
      'The first CSV data row number (1-based, header excluded) belonging to this listing',
  })
  row: number;

  @Expose()
  @ApiProperty({ description: 'The listingRowId column value from the CSV' })
  listingRowId: string;

  @Expose()
  @ApiProperty({ description: 'The id of the newly created listing' })
  id: string;
}

export class ListingCsvUploadRowError {
  @Expose()
  @ApiProperty({
    description:
      'The first CSV data row number (1-based, header excluded) belonging to this listing',
  })
  row: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'The listingRowId column value from the CSV, if present',
  })
  listingRowId?: string;

  @Expose()
  @ApiProperty({ description: 'Why this listing failed to be created' })
  message: string;
}

export class ListingCsvUploadResult {
  @Expose()
  @Type(() => ListingCsvUploadCreatedRow)
  @ApiProperty({ type: ListingCsvUploadCreatedRow, isArray: true })
  created: ListingCsvUploadCreatedRow[];

  @Expose()
  @Type(() => ListingCsvUploadRowError)
  @ApiProperty({ type: ListingCsvUploadRowError, isArray: true })
  errors: ListingCsvUploadRowError[];
}
