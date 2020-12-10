import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsDate, IsDefined, IsEnum, IsOptional, IsString, IsUUID } from "class-validator"
import { Listing } from "./listing.entity"
import { ApiProperty } from "@nestjs/swagger"

export enum ListingEventType {
  openHouse = "openHouse",
  publicLottery = "publicLottery",
}

@Entity({ name: "listing_events" })
export class ListingEvent {
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

  @Column({
    type: "enum",
    enum: ListingEventType,
  })
  @Expose()
  @IsDefined()
  @IsEnum(ListingEventType)
  @ApiProperty({ enum: ListingEventType, enumName: "ListingEventType" })
  type: ListingEventType

  @Column()
  @Expose()
  @IsDate()
  @Type(() => Date)
  startTime: Date

  @Column()
  @Expose()
  @IsDate()
  @Type(() => Date)
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
