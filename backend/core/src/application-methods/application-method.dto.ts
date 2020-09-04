import { OmitType } from "@nestjs/swagger"
import { ApplicationMethod } from "../entity/application-method.entity"

export class ApplicationMethodDto extends OmitType(ApplicationMethod, ["listing"] as const) {}
