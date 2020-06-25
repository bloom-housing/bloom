import { PickType } from "@nestjs/swagger"
import { Application } from "../entity/application.entity"
import { IsJSON, IsObject } from "class-validator"

export class ApplicationUpdateDto extends PickType(Application, ["id", "listingId", "userId"]) {
  @IsObject()
  application: any
}
