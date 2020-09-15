import { IsString, IsUUID } from "class-validator"
import { Expose } from "class-transformer"
import { ApplicationMethodCreateDto } from "./application-method.create.dto"

export class ApplicationMethodUpdateDto extends ApplicationMethodCreateDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string
}
