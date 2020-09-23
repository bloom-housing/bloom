import { IsBoolean, IsDefined, IsOptional, IsString, ValidateNested } from "class-validator"
import { IdDto } from "../lib/id.dto"
import { Expose, Transform, Type } from "class-transformer"
import { OmitType } from "@nestjs/swagger"
import { Application } from "../entity/application.entity"

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
}
