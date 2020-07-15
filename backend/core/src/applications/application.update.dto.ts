import { PickType } from "@nestjs/swagger"
import { Application } from "../entity/application.entity"
import { IsObject, IsString } from "class-validator"
import { IdDto } from "../lib/id.dto"

export class ApplicationUpdateDto extends PickType(Application, ["id"]) {
  @IsObject()
  application: any

  @IsObject()
  listing: IdDto

  @IsObject()
  user: IdDto
}
