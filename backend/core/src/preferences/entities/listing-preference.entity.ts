import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm"
import { Preference } from "./preference.entity"
import { Expose, Type } from "class-transformer"
import { IsDate, IsNumber, IsOptional, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Listing } from "../../listings/entities/listing.entity"

@Entity({ name: "listing_preferences" })
export class ListingPreference {
  @PrimaryColumn()
  listingId: string

  @ManyToOne(() => Listing, (listing) => listing.listingPreferences)
  @JoinColumn({ name: "listingId" })
  listing: Listing

  @PrimaryColumn()
  preferenceId: string

  @ManyToOne(() => Preference, (preference) => preference.listingPreferences)
  @JoinColumn({ name: "preferenceId" })
  preference: Preference

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  ordinal?: number | null
}
