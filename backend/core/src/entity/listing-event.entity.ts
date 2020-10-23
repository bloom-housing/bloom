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
import { IsDateString, IsDefined, IsEnum, IsOptional, IsString, IsUUID } from "class-validator"
import { Listing, ListingStatus } from "./listing.entity"

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
  @IsDateString()
  @IsUUID()
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDateString()
  @IsUUID()
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
  @IsDateString()
  startTime: Date

  @Column()
  @Expose()
  @IsDateString()
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

  @ManyToOne((type) => Listing, (listing) => listing.events, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  listing: Listing
}
