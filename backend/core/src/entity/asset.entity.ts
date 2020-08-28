import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Listing } from "./listing.entity"
import { IsObject, IsString, IsUUID } from "class-validator"

@Entity({ name: "assets" })
export class Asset extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "text" })
  referenceId: string

  @Column({ type: "text" })
  referenceType: string

  @Column({ type: "text" })
  label: string

  @Column({ type: "text" })
  fileId: string

  @ManyToOne((type) => Listing, (listing) => listing.assets, { nullable: true })
  listing: Listing | null
}
