import { Column, Entity, ManyToOne } from "typeorm"
import { Preference } from "./preference.entity"
import { Expose, Type } from "class-transformer"
import { IsNumber, IsOptional } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Listing } from "../../listings/entities/listing.entity"

@Entity({ name: "listing_preferences" })
export class ListingPreference {
  @ManyToOne(() => Listing, (listing) => listing.listingPreferences, {
    primary: true,
    orphanedRowAction: "delete",
  })
  @Type(() => Listing)
  listing: Listing

  @ManyToOne(() => Preference, (preference) => preference.listingPreferences, { primary: true, eager: true })
  @Expose()
  @Type(() => Preference)
  preference: Preference

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  ordinal?: number | null

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  page?: number | null
}
