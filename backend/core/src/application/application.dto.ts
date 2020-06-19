import { IsOptional, IsString } from "class-validator"

export class ApplicationListQueryParams {
  @IsOptional()
  @IsString()
  userId?: string
  @IsOptional()
  @IsString()
  listingId?: string
}
