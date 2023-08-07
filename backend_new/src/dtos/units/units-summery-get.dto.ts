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
import { UnitType } from '../unit-types/unit-type.dto';
import { UnitAccessibilityPriorityType } from '../unit-accessibility-priority-types/unit-accessibility-priority-type.dto';

class UnitsSummary {
  @Expose()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  id: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitType)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  unitTypes: UnitType;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  monthlyRentMin?: number;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  monthlyRentMax?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  monthlyRentAsPercentOfIncome?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  amiPercentage?: number;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  minimumIncomeMin?: string;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  minimumIncomeMax?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  maxOccupancy?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  minOccupancy?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  floorMin?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  floorMax?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  sqFeetMin?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  sqFeetMax?: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAccessibilityPriorityType)
  unitAccessibilityPriorityTypes?: UnitAccessibilityPriorityType;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  totalCount?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  totalAvailable?: number;
}

export { UnitsSummary as default, UnitsSummary };
