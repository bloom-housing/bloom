import { OmitType } from "@nestjs/swagger"
import { ApplicationMethodDto } from "./application-method.dto"

export class ApplicationMethodCreateDto extends OmitType(ApplicationMethodDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}
