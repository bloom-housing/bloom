import { Expose, Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsString,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { MinMaxCurrency } from '../shared/min-max-currency.dto';
import { MinMax } from '../shared/min-max.dto';
import { UnitType } from '../unit-types/unit-type.dto';

export class UnitGroupSummary {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiPropertyOptional({ type: [UnitType] })
  unitTypes?: UnitType[] | null;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => MinMax)
  @ApiPropertyOptional({ type: MinMax })
  rentAsPercentIncomeRange?: MinMax;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => MinMaxCurrency)
  @ApiPropertyOptional({ type: MinMaxCurrency })
  rentRange?: MinMaxCurrency;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => MinMax)
  @ApiProperty({ type: MinMax })
  amiPercentageRange: MinMax;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  openWaitlist: boolean;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  unitVacancies: number;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => MinMax)
  @ApiPropertyOptional({ type: MinMax })
  floorRange?: MinMax;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => MinMax)
  @ApiPropertyOptional({ type: MinMax })
  sqFeetRange?: MinMax;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => MinMax)
  @ApiPropertyOptional({ type: MinMax })
  bathroomRange?: MinMax;
}
