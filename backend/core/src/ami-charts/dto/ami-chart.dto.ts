import { Expose, Type } from "class-transformer"
import { IsDate, IsDefined, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"
import { AmiChart } from "../entities/ami-chart.entity"
import { AmiChartItem } from "../entities/ami-chart-item.entity"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { JurisdictionDto } from "../../jurisdictions/dto/jurisdiction.dto"
import { IdDto } from "../../shared/dto/id.dto"
import { HasKeys } from "../../shared/types/has-keys"
import { AbstractEntity } from "../../shared/entities/abstract.entity"


export class AmiChartDto implements HasKeys<AmiChart>  {
  @Expose()
  id: string

  @Expose()
  @Type(() => Date)
  createdAt: Date

  @Expose()
  @Type(() => Date)
  updatedAt: Date

  @Expose()
  @Type(() => AmiChartItem)
  items: AmiChartItem[]

  @Expose()
  name: string

  @Expose()
  @Type(() => IdDto)
  jurisdiction: IdDto
}

export class AmiChartCreateDto implements Omit<HasKeys<AmiChart>, keyof AbstractEntity> {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AmiChartItem)
  items: AmiChartItem[]

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  name: string

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  jurisdiction: IdDto
}

export class AmiChartUpdateDto extends AmiChartCreateDto {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id?: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt?: Date

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt?: Date
}
