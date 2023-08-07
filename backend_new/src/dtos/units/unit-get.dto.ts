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
import { UnitAmiChartOverride } from './ami-chart-override-get.dto';

class Unit extends AbstractDTO {
  @Expose()
  amiChart?: AmiChart;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  amiPercentage?: string;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  annualIncomeMin?: string;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  monthlyIncomeMin?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  floor?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  annualIncomeMax?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  maxOccupancy?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  minOccupancy?: number;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  monthlyRent?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  numBathrooms?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  numBedrooms?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  number?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  sqFeet?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  monthlyRentAsPercentOfIncome?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  bmrProgramChart?: boolean;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitType)
  unitTypes?: UnitType;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitRentType)
  unitRentTypes?: UnitRentType;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAccessibilityPriorityType)
  unitAccessibilityPriorityTypes?: UnitAccessibilityPriorityType;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAmiChartOverride)
  unitAmiChartOverrides?: UnitAmiChartOverride;
}

export { Unit as default, Unit };
