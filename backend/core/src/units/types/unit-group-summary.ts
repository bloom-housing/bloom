import { Expose, Type } from "class-transformer"
import { IsDefined, IsNumber, IsString, ValidateNested, IsBoolean } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { MinMaxCurrency } from "./min-max-currency"
import { MinMax } from "./min-max"
import { ApiProperty } from "@nestjs/swagger"
import { UnitTypeDto } from "../../unit-types/dto/unit-type.dto"

export class UnitGroupSummary {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  unitTypes?: UnitTypeDto[] | null

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => MinMax)
  @ApiProperty()
  rentAsPercentIncomeRange?: MinMax

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => MinMaxCurrency)
  @ApiProperty()
  rentRange?: MinMaxCurrency

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  amiPercentageRange: MinMax

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  openWaitlist: boolean

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  unitVacancies: number
}
