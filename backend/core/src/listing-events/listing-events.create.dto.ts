import { OmitType } from "@nestjs/swagger"
import { ListingEventDto } from "./listing-events.dto"

export class ListingEventCreateDto extends OmitType(ListingEventDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}
