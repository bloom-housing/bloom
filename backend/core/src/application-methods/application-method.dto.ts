import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { ApplicationMethod } from "../entity/application-method.entity"
import { Exclude, Expose } from "class-transformer"
import { IsString, IsUUID } from "class-validator"

export class ApplicationMethodDto extends OmitType(ApplicationMethod, ["listing"] as const) {
  @Exclude()
  @ApiHideProperty()
  listing
}

export class ApplicationMethodCreateDto extends OmitType(ApplicationMethodDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class ApplicationMethodUpdateDto extends ApplicationMethodCreateDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string
}
