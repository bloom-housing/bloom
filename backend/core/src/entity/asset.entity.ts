import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Listing } from "./listing.entity"
import { IsDate, IsDateString, IsObject, IsString, IsUUID } from "class-validator"
import { Expose } from "class-transformer"

@Entity({ name: "assets" })
export class Asset extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString()
  @IsUUID()
  id: string

  @CreateDateColumn()
  @Expose()
  @IsDate()
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate()
  updatedAt: Date

  @Column({ type: "text" })
  @Expose()
  @IsString()
  label: string

  @Column({ type: "text" })
  @Expose()
  @IsString()
  fileId: string

  @ManyToOne((type) => Listing, (listing) => listing.assets, { nullable: true })
  listing: Listing | null
}
