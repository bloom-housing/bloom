import { Expose, Type } from "class-transformer"
import { IsDate, IsDefined, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ListingEventType } from "../types/listing-event-type-enum"
import { ApiProperty } from "@nestjs/swagger"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Column, Entity, ManyToOne } from "typeorm"
import { Listing } from "./listing.entity"
import { Asset } from "../../assets/entities/asset.entity"

@Entity({ name: "listing_events" })
export class ListingEvent extends AbstractEntity {
  @Column({ type: "enum", enum: ListingEventType })
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ListingEventType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: ListingEventType, enumName: "ListingEventType" })
  type: ListingEventType

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  startTime?: Date

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  endTime?: Date

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

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  label?: string | null

  @ManyToOne(() => Listing, (listing) => listing.events)
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ListingEvent)
  listing: Listing

  @ManyToOne(() => Asset, { eager: true, cascade: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  file?: Asset
}
