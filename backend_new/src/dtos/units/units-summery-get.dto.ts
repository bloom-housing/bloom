import {
  IsNumber,
  IsNumberString,
  IsDefined,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { UnitType } from './unit-type-get.dto';
import { UnitAccessibilityPriorityType } from './unit-accessibility-priority-type-get.dto';

class UnitsSummary {
  @Expose()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  id: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitType)
  unitTypes: UnitType;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  monthlyRentMin?: number | null;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  monthlyRentMax?: number | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  monthlyRentAsPercentOfIncome?: string | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  amiPercentage?: number | null;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  minimumIncomeMin?: string | null;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  minimumIncomeMax?: string | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  maxOccupancy?: number | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  minOccupancy?: number | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  floorMin?: number | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  floorMax?: number | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  sqFeetMin?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  sqFeetMax?: string | null;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAccessibilityPriorityType)
  unitAccessibilityPriorityTypes?: UnitAccessibilityPriorityType | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  totalCount?: number | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  totalAvailable?: number | null;
}

export { UnitsSummary as default, UnitsSummary };
