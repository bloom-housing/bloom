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
import { IdDTO } from '../shared/id.dto';
import { ApiProperty } from '@nestjs/swagger';

class UnitsSummary {
  @Expose()
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  id: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true, type: IdDTO })
  unitTypes: IdDTO;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  monthlyRentMin?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  monthlyRentMax?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  monthlyRentAsPercentOfIncome?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  amiPercentage?: number;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  minimumIncomeMin?: string;

  @Expose()
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  minimumIncomeMax?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  maxOccupancy?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  minOccupancy?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  floorMin?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  floorMax?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  sqFeetMin?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  sqFeetMax?: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiProperty({ required: false, type: IdDTO })
  unitAccessibilityPriorityTypes?: IdDTO;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  totalCount?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  totalAvailable?: number;
}

export { UnitsSummary as default, UnitsSummary };
