import { PickType } from "@nestjs/swagger"
import { Application } from "../entity/application.entity"

export class ApplicationCreateDto extends PickType(Application, ["listingId", "userId"]) {
  application: any
}
