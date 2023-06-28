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
  amiChart?: AmiChart | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  amiPercentage?: string | null;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  annualIncomeMin?: string | null;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  monthlyIncomeMin?: string | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  floor?: number | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  annualIncomeMax?: string | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  maxOccupancy?: number | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  minOccupancy?: number | null;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  monthlyRent?: string | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  numBathrooms?: number | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  numBedrooms?: number | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  number?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  sqFeet?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  monthlyRentAsPercentOfIncome?: string | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  bmrProgramChart?: boolean | null;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitType)
  unitTypes?: UnitType | null;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitRentType)
  unitRentTypes?: UnitRentType | null;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAccessibilityPriorityType)
  unitAccessibilityPriorityTypes?: UnitAccessibilityPriorityType | null;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAmiChartOverride)
  unitAmiChartOverrides?: UnitAmiChartOverride;
}

export { Unit as default, Unit };
