import { OmitType } from "@nestjs/swagger"
import { ListingFeatures } from "../entities/listing-features.entity"

export class ListingFeaturesDto extends OmitType(ListingFeatures, [
  "id",
  "createdAt",
  "updatedAt",
  "listing",
] as const) {}
