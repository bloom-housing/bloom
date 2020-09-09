import { OmitType } from "@nestjs/swagger"
import { ApplicationDto } from "./applications.dto"

export class ApplicationCreateDto extends OmitType(ApplicationDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}
