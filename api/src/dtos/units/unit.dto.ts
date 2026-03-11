import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { UnitAccessibilityPriorityTypeEnum } from '../../enums/units/accessibility-priority-type-enum';
import { AbstractDTO } from '../shared/abstract.dto';
import { AmiChart } from '../ami-charts/ami-chart.dto';
import { UnitType } from '../unit-types/unit-type.dto';
import { UnitRentType } from '../unit-rent-types/unit-rent-type.dto';
import { UnitAmiChartOverride } from './ami-chart-override.dto';

class Unit extends AbstractDTO {
  @Expose()
  @ApiPropertyOptional({ type: AmiChart })
  amiChart?: AmiChart;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  amiPercentage?: string;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  annualIncomeMin?: string;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  monthlyIncomeMin?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  floor?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  annualIncomeMax?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  maxOccupancy?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  minOccupancy?: number;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  monthlyRent?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  numBathrooms?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  numBedrooms?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  number?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  sqFeet?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  monthlyRentAsPercentOfIncome?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  bmrProgramChart?: boolean;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitType)
  @ApiPropertyOptional({ type: UnitType })
  unitTypes?: UnitType;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitRentType)
  @ApiPropertyOptional({ type: UnitRentType })
  unitRentTypes?: UnitRentType;

  @Expose()
  @IsEnum(UnitAccessibilityPriorityTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional({
    enum: UnitAccessibilityPriorityTypeEnum,
    enumName: 'UnitAccessibilityPriorityTypeEnum',
  })
  accessibilityPriorityType?: UnitAccessibilityPriorityTypeEnum;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAmiChartOverride)
  @ApiPropertyOptional({ type: UnitAmiChartOverride })
  unitAmiChartOverrides?: UnitAmiChartOverride;
}

export { Unit as default, Unit };
