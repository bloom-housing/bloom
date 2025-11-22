import { IsBoolean, IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';
import { UnitType } from '../unit-types/unit-type.dto';
import { UnitAccessibilityPriorityType } from '../unit-accessibility-priority-types/unit-accessibility-priority-type.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UnitGroupAmiLevel } from './unit-group-ami-level.dto';
import { RentTypeEnum } from '@prisma/client';
import { ValidateUnitGroupRent } from '../../decorators/validate-unit-groups-rent.decorator';

class UnitGroup extends AbstractDTO {
  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  maxOccupancy?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  minOccupancy?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  flatRentValueFrom?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  flatRentValueTo?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  monthlyRent?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  floorMin?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  floorMax?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  totalCount?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  totalAvailable?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  bathroomMin?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  bathroomMax?: number;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  openWaitlist?: boolean;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  sqFeetMin?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  sqFeetMax?: number;

  @Expose()
  @IsEnum(RentTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateUnitGroupRent({
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional({
    enum: RentTypeEnum,
    enumName: 'RentTypeEnum',
  })
  rentType?: RentTypeEnum;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAccessibilityPriorityType)
  @ApiPropertyOptional({ type: UnitAccessibilityPriorityType })
  unitAccessibilityPriorityTypes?: UnitAccessibilityPriorityType;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitGroupAmiLevel)
  @ApiPropertyOptional({ type: [UnitGroupAmiLevel] })
  unitGroupAmiLevels?: UnitGroupAmiLevel[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitType)
  @ApiPropertyOptional({ type: [UnitType] })
  unitTypes?: UnitType[];
}

export { UnitGroup as default, UnitGroup };
