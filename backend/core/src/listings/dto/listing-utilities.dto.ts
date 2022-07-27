import { OmitType } from "@nestjs/swagger"
import { ListingUtilities } from "../entities/listing-utilities.entity"

export class ListingUtilitiesDto extends OmitType(ListingUtilities, [
  "id",
  "createdAt",
  "updatedAt",
  "listing",
] as const) {}
