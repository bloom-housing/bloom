import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Column, Entity, OneToOne } from "typeorm"
import Listing from "./listing.entity"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IsOptional, IsString, ValidateNested } from "class-validator"
import { Expose, Type } from "class-transformer"

@Entity({ name: "listing_neighborhood_amenities" })
export class ListingNeighborhoodAmenities extends AbstractEntity {
  @OneToOne(() => Listing, (listing) => listing.features)
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Listing)
  listing: Listing

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  grocery?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  pharmacy?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  medicalClinic?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  park?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  seniorCenter?: string | null
}
