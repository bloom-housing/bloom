import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Listing } from "./listing.entity"
import { IsDate, IsString, IsUUID } from "class-validator"
import { Expose, Type } from "class-transformer"

@Entity({ name: "assets" })
export class Asset {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString()
  @IsUUID()
  id: string

  @CreateDateColumn()
  @Expose()
  @IsDate()
  @Type(() => Date)
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate()
  @Type(() => Date)
  updatedAt: Date

  @Column({ type: "text" })
  @Expose()
  @IsString()
  label: string

  @Column({ type: "text" })
  @Expose()
  @IsString()
  fileId: string

  @ManyToOne(() => Listing, (listing) => listing.assets, { nullable: true })
  listing: Listing | null
}
