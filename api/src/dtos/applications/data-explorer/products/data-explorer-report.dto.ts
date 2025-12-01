import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../../../shared/abstract.dto';
import { ReportProducts } from './data-explorer-report-products.dto';

export class DataExplorerReport extends AbstractDTO {
  @Expose()
  @ApiProperty({
    type: String,
    example: '01/01/2025 - 06/30/2025',
    description: 'Date range for the report',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  dateRange: string;

  @Expose()
  @ApiProperty({
    type: Number,
    example: 1200,
    description: 'Total number of processed applications',
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  totalProcessedApplications: number;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 1200,
    description: 'Total number of applicants',
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @IsOptional()
  totalApplicants?: number;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 5,
    description: 'Total number of listings',
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @IsOptional()
  totalListings?: number;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    description:
      'Whether the data passes k-anonymity requirements and has no errors',
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  validResponse: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    description:
      'Whether there is sufficient data for analysis (alias for validResponse)',
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  isSufficient: boolean;

  @Expose()
  @ApiProperty({
    type: Number,
    example: 10,
    description: 'K-anonymity score for the dataset',
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  kAnonScore: number;

  @Expose()
  @ApiProperty({
    type: ReportProducts,
    description:
      'Report data products containing various frequency distributions',
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ReportProducts)
  products: ReportProducts;

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: [],
    description: 'Any errors encountered during report generation',
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ each: true, groups: [ValidationsGroupsEnum.default] })
  @IsOptional()
  reportErrors?: string[];
}
