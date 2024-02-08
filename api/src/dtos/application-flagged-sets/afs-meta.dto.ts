import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class AfsMeta {
  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  totalCount?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  totalResolvedCount?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  totalPendingCount?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  totalNamePendingCount?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  totalEmailPendingCount?: number;
}
