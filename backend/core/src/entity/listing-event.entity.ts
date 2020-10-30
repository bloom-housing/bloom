import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Expose } from "class-transformer"
import { IsDate, IsDefined, IsEnum, IsOptional, IsString, IsUUID } from "class-validator"
import { Listing } from "./listing.entity"

export enum ListingEventType {
  openHouse = "openHouse",
  publicLottery = "publicLottery",
}

@Entity({ name: "listing_events" })
export class ListingEvent extends BaseEntity {
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

  @Column({
    type: "enum",
    enum: ListingEventType,
  })
  @Expose()
  @IsDefined()
  @IsEnum(ListingEventType)
  type: ListingEventType

  @Column()
  @Expose()
  @IsDate()
  startTime: Date

  @Column()
  @Expose()
  @IsDate()
  endTime: Date

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  url?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  note?: string | null

  @ManyToOne(() => Listing, (listing) => listing.events, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  listing: Listing
}
