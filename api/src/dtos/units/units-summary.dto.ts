import {
  IsNumber,
  IsNumberString,
  IsDefined,
  IsString,
  IsUUID,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { IdDTO } from '../shared/id.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateUnitGroupRent } from '../../decorators/validate-unit-groups-rent.decorator';
import { RentTypeEnum } from '@prisma/client';

class UnitsSummary {
  @Expose()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  id: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: IdDTO })
  unitTypes: IdDTO;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  monthlyRentMin?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  monthlyRentMax?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  monthlyRentAsPercentOfIncome?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  amiPercentage?: number;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  minimumIncomeMin?: string;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  minimumIncomeMax?: string;

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
  floorMin?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  floorMax?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  sqFeetMin?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  sqFeetMax?: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiPropertyOptional({ type: IdDTO })
  unitAccessibilityPriorityTypes?: IdDTO;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  totalCount?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  totalAvailable?: number;

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
}

export { UnitsSummary as default, UnitsSummary };
