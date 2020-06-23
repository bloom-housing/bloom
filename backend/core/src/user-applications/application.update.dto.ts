import { PickType } from "@nestjs/swagger"
import { Application } from "../entity/application.entity"

export class ApplicationUpdateDto extends PickType(Application, ["id", "listingId", "userId"]) {
  application: any
}
