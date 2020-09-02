import { IsOptional, IsString } from "class-validator"
import { IdDto } from "../lib/id.dto"
import { Expose, Type } from "class-transformer"

export class ApplicationsListQueryParams {
  @IsOptional()
  @IsString()
  listingId?: string
}

export class ApplicationDto {
  @Expose()
  id: string
  @Expose()
  application: any
  @Type(() => IdDto)
  @Expose()
  user: IdDto
  @Type(() => IdDto)
  @Expose()
  listing: IdDto
  @Expose()
  createdAt: Date
  @Expose()
  updatedAt: Date
}
