import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { Unit } from "../entity/unit.entity"
import { Exclude, Expose, Type } from "class-transformer"
import { IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"
import { AmiChartDto } from "../ami-charts/ami-chart.dto"

export class UnitDto extends OmitType(Unit, ["property", "amiChart"] as const) {
  @Exclude()
  @ApiHideProperty()
  property

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => AmiChartDto)
  amiChart: AmiChartDto | null
}

export class UnitCreateDto extends OmitType(UnitDto, [
  "id",
  "createdAt",
  "updatedAt",
  "amiChart",
] as const) {
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => AmiChartDto)
  amiChart: AmiChartDto | null
}

export class UnitUpdateDto extends UnitCreateDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string
}
