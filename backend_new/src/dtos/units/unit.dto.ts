import {
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';
import { AmiChart } from '../ami-charts/ami-chart.dto';
import { UnitType } from '../unit-types/unit-type.dto';
import { UnitRentType } from '../unit-rent-types/unit-rent-type.dto';
import { UnitAccessibilityPriorityType } from '../unit-accessibility-priority-types/unit-accessibility-priority-type.dto';
import { UnitAmiChartOverride } from './ami-chart-override.dto';
import { ApiProperty } from '@nestjs/swagger';

class Unit extends AbstractDTO {
  @Expose()
  @ApiProperty({ required: false, type: AmiChart })
  amiChart?: AmiChart;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  amiPercentage?: string;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  annualIncomeMin?: string;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  monthlyIncomeMin?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  floor?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  annualIncomeMax?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  maxOccupancy?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  minOccupancy?: number;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  monthlyRent?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  numBathrooms?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  numBedrooms?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  number?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  sqFeet?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  monthlyRentAsPercentOfIncome?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  bmrProgramChart?: boolean;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitType)
  @ApiProperty({ required: false, type: UnitType })
  unitTypes?: UnitType;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitRentType)
  @ApiProperty({ required: false, type: UnitRentType })
  unitRentTypes?: UnitRentType;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAccessibilityPriorityType)
  @ApiProperty({ required: false, type: UnitAccessibilityPriorityType })
  unitAccessibilityPriorityTypes?: UnitAccessibilityPriorityType;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAmiChartOverride)
  @ApiProperty({ required: false, type: UnitAmiChartOverride })
  unitAmiChartOverrides?: UnitAmiChartOverride;
}

export { Unit as default, Unit };
