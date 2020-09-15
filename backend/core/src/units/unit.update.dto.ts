import { IsString, IsUUID } from "class-validator"
import { Expose } from "class-transformer"
import { UnitCreateDto } from "./unit.create.dto"

export class UnitUpdateDto extends UnitCreateDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string
}
