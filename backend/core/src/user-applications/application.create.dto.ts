import { PickType } from "@nestjs/swagger"
import { Application } from "../entity/application.entity"
import { IsObject } from "class-validator"

export class ApplicationCreateDto extends PickType(Application, ["listingId", "userId"]) {
  @IsObject()
  application: any
}
