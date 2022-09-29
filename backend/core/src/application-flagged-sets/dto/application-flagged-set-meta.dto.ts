import { Expose } from "class-transformer"
import { IsNumber, IsOptional } from "class-validator"

export class ApplicationFlaggedSetMeta {
  @Expose()
  @IsNumber()
  @IsOptional()
  totalCount?: number

  @Expose()
  @IsNumber()
  @IsOptional()
  totalResolvedCount?: number

  @Expose()
  @IsNumber()
  @IsOptional()
  totalPendingCount?: number

  @Expose()
  @IsNumber()
  @IsOptional()
  totalNamePendingCount?: number

  @Expose()
  @IsNumber()
  @IsOptional()
  totalEmailPendingCount?: number
}
