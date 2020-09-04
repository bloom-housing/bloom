import { OmitType } from "@nestjs/swagger"
import { ApplicationMethod } from "../entity/applicationMethod.entity"

export class ApplicationMethodDto extends OmitType(ApplicationMethod, ["listing"] as const) {}
