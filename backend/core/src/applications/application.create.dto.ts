import { IsObject, IsOptional } from "class-validator"
import { IdDto } from "../lib/id.dto"

export class ApplicationCreateDto {
  @IsObject()
  application: any

  @IsObject()
  listing: IdDto

  @IsOptional()
  @IsObject()
  user?: IdDto
}
