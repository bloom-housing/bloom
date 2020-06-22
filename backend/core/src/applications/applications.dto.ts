import { IsOptional, IsString } from "class-validator"

export class ApplicationsListQueryParams {
  @IsOptional()
  @IsString()
  userId?: string
  @IsOptional()
  @IsString()
  listingId?: string
}
