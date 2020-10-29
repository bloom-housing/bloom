import { ApiHideProperty, ApiProperty, OmitType } from "@nestjs/swagger"
import { IsBoolean, IsDefined, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator"
import { Application } from "../entity/application.entity"
import { Exclude, Expose, Transform, Type } from "class-transformer"
import { IdDto } from "../lib/id.dto"
import { PaginationFactory, PaginationQueryParams } from "../utils/pagination.dto"

export class ApplicationsListQueryParams extends PaginationQueryParams {
  @ApiProperty({
    type: String,
    example: "listingId",
    required: false,
  })
  @IsOptional()
  @IsString()
  listingId?: string
}

export class ApplicationsCsvListQueryParams {
  @ApiProperty({
    type: String,
    example: "listingId",
    required: false,
  })
  @IsOptional()
  @IsString()
  listingId?: string

  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform((value: string | undefined) => value === "true", { toClassOnly: true })
  includeHeaders?: boolean
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

export class PaginatedApplicationDto extends PaginationFactory<ApplicationDto>(ApplicationDto) {}

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
