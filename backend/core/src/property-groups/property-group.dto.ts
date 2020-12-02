import { Expose, Type } from "class-transformer"
import { IsDefined, IsString, IsUUID, ValidateNested } from "class-validator"
import { IdDto } from "../lib/id.dto"
import { PropertyGroup } from "../entity/property-group.entity"
import { OmitType } from "@nestjs/swagger"

export class PropertyGroupDto extends OmitType(PropertyGroup, ["properties"] as const) {
  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  properties: IdDto[]
}

export class PropertyGroupCreateDto extends OmitType(PropertyGroupDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class PropertyGroupUpdateDto extends PropertyGroupCreateDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string
}
