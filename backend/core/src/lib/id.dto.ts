import { IsString, IsUUID } from "class-validator"
import { Expose } from "class-transformer"

export class IdDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string
}
