import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';
import { AmiChart } from '../ami-charts/ami-chart.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MonthlyRentDeterminationTypeEnum } from '@prisma/client';

class UnitGroupAmiLevel extends AbstractDTO {
  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  amiPercentage?: number;

  @Expose()
  @IsEnum(MonthlyRentDeterminationTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional({ enum: MonthlyRentDeterminationTypeEnum })
  monthlyRentDeterminationType: MonthlyRentDeterminationTypeEnum;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  percentageOfIncomeValue?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  flatRentValue?: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AmiChart)
  @ApiPropertyOptional({ type: AmiChart })
  amiChart?: AmiChart;
}

export { UnitGroupAmiLevel as default, UnitGroupAmiLevel };
