import { IsString } from "class-validator"
import { Expose } from "class-transformer"

export class IdDto {
  @IsString()
  @Expose()
  id: string
}
