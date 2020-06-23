import { IsOptional, IsString } from "class-validator"
import { PickType } from "@nestjs/swagger"
import { Application } from "../entity/application.entity"

export class ApplicationsListQueryParams {
  @IsOptional()
  @IsString()
  userId?: string
  @IsOptional()
  @IsString()
  listingId?: string
}

export class ApplicationDto extends PickType(Application, [
  "id",
  "listingId",
  "userId",
  "application",
]) {}
