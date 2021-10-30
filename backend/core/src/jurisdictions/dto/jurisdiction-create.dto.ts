import { OmitType } from "@nestjs/swagger"
import { JurisdictionDto } from "./jurisdiction.dto"

export class JurisdictionCreateDto extends OmitType(JurisdictionDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}
