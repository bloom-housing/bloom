import { Column, Entity, Index, ManyToOne, PrimaryColumn } from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Listing } from "./listing.entity"
import { Asset } from "../../assets/entities/asset.entity"

@Entity({ name: "listing_images" })
export class ListingImage {
  @ManyToOne(() => Listing, (listing) => listing.images, {
    primary: true,
    orphanedRowAction: "delete",
  })
  @Index()
  @Type(() => Listing)
  listing: Listing

  @PrimaryColumn("uuid")
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  imageId: string

  @ManyToOne(() => Asset, {
    primary: true,
    eager: true,
    cascade: true,
  })
  @Expose()
  @Type(() => Asset)
  image: Asset

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  ordinal?: number | null
}
