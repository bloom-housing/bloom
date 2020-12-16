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
import { Listing } from "../../listings/entities/listing.entity"
import { ApiProperty } from "@nestjs/swagger"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

export enum ListingEventType {
  openHouse = "openHouse",
  publicLottery = "publicLottery",
}

@Entity({ name: "listing_events" })
export class ListingEvent {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id: string

  @CreateDateColumn()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt: Date

  @Column({
    type: "enum",
    enum: ListingEventType,
  })
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ListingEventType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: ListingEventType, enumName: "ListingEventType" })
  type: ListingEventType

  @Column()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  startTime: Date

  @Column()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  endTime: Date

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  url?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  note?: string | null

  @ManyToOne(() => Listing, (listing) => listing.events, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  listing: Listing
}
