import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsObject, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../../enums/shared/validation-groups-enum';
import { ReportProducts } from './products/data-explorer-report-products.dto';

export class GenerateInsightParams {
  @Expose()
  @ApiProperty({
    type: ReportProducts,
    description: 'The current data object containing report products',
  })
  @IsObject({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ReportProducts)
  data: ReportProducts;

  @Expose()
  @ApiProperty({
    type: String,
    example: 'What are the key trends in this data?',
    description: 'The prompt to send to the AI for generating insights',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  prompt: string;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: 'jurisdictionId',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  jurisdictionId?: string;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: 'userId',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  userId?: string;
}
