import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { IsDefined, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"
import { Application } from "../entity/application.entity"
import { Exclude, Expose, Type } from "class-transformer"
import { IdDto } from "../lib/id.dto"

export class ApplicationsListQueryParams {
  @IsOptional()
  @IsString()
  listingId?: string
}

export class ApplicationsCsvListQueryParams {
  @IsOptional()
  @IsString()
  listingId?: string
}

export class ApplicationDto extends OmitType(Application, ["listing", "user"] as const) {
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => IdDto)
  listing: IdDto

  @Exclude()
  @ApiHideProperty()
  user
}

export class ApplicationCreateDto extends OmitType(ApplicationDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class ApplicationUpdateDto extends ApplicationCreateDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string
}
