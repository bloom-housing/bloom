import { Column, Entity, Index, ManyToOne } from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsNumber, IsOptional } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Listing } from "./listing.entity"
import { Asset } from "../../assets/entities/asset.entity"
import { AbstractEntity } from "../../shared/entities/abstract.entity"

@Entity({ name: "listing_images" })
export class ListingImage extends AbstractEntity {
  @ManyToOne(() => Listing, (listing) => listing.images, {
    orphanedRowAction: "delete",
  })
  @Index()
  @Type(() => ListingImage)
  listing: Listing

  @ManyToOne(() => Asset, {
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
