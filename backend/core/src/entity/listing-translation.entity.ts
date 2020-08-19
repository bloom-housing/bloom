import { Entity, BaseEntity, Column, ManyToOne, PrimaryColumn } from "typeorm"
import { Listing } from "./listing.entity"
import { WhatToExpect } from "@bloom-housing/core"
import { JoinColumn } from "typeorm/index"

@Entity({ name: "listings_translations" })
class ListingTranslation extends BaseEntity {
  // Manually define this column ahead of languageCode so that it can appear first in the composite primary key that
  // gets generated for better indexing performance.
  // See https://github.com/typeorm/typeorm/issues/3069
  @PrimaryColumn({ type: "uuid" })
  listingId: string

  @PrimaryColumn({ type: "citext" })
  languageCode: string

  @ManyToOne(() => Listing, (listing) => listing.translations, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "listing_id" })
  listing: Listing

  @Column({ type: "text", nullable: true })
  accessibility: string
  @Column({ type: "text", nullable: true })
  amenities: string
  @Column({ type: "text", nullable: true })
  buildingSelectionCriteria: string
  @Column({ type: "text", nullable: true })
  costsNotIncluded: string
  @Column({ type: "text", nullable: true })
  creditHistory: string
  @Column({ type: "text", nullable: true })
  criminalBackground: string
  @Column({ type: "text", nullable: true })
  leasingAgentOfficeHours: string
  @Column({ type: "text", nullable: true })
  leasingAgentTitle: string
  @Column({ type: "text", nullable: true })
  name: string
  @Column({ type: "text", nullable: true })
  neighborhood: string
  @Column({ type: "text", nullable: true })
  petPolicy: string
  @Column({ type: "text", nullable: true })
  programRules?: string
  @Column({ type: "text", nullable: true })
  rentalHistory: string
  @Column({ type: "text", nullable: true })
  requiredDocuments: string
  @Column({ type: "text", nullable: true })
  smokingPolicy: string
  @Column({ type: "text", nullable: true })
  unitAmenities: string
  @Column({ type: "jsonb", nullable: true })
  whatToExpect?: WhatToExpect
}

export { ListingTranslation as default, ListingTranslation }
