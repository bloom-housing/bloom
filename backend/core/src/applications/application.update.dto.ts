import { IsString, IsUUID } from "class-validator"
import { Expose } from "class-transformer"
import { ApplicationCreateDto } from "./application.create.dto"

export class ApplicationUpdateDto extends ApplicationCreateDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string
}
