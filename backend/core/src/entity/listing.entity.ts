import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Application } from "../applications/entities/application.entity"
import { Asset } from "./asset.entity"
import { ApplicationMethod } from "./application-method.entity"
import { WhatToExpect } from "../shared/dto/whatToExpect.dto"
import { Preference } from "./preference.entity"
import { Expose, Type } from "class-transformer"
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator"
import { ListingEvent } from "./listing-event.entity"
import { listingUrlSlug } from "../lib/url_helper"
import { ApiProperty } from "@nestjs/swagger"
import { Property } from "./property.entity"
import { Address } from "../shared/entities/address.entity"

export enum ListingStatus {
  active = "active",
  pending = "pending",
}

export class AmiChartItem {
  @Expose()
  @IsDefined()
  @IsString()
  percentOfAmi: number

  @Expose()
  @IsDefined()
  @IsString()
  householdSize: number

  @Expose()
  @IsDefined()
  @IsString()
  income: number
}

@Entity({ name: "listings" })
class Listing extends BaseEntity {
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

  @OneToMany(() => Preference, (preference) => preference.listing, { cascade: true })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Preference)
  preferences: Preference[]

  @OneToMany(() => ApplicationMethod, (applicationMethod) => applicationMethod.listing, {
    cascade: true,
  })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ApplicationMethod)
  applicationMethods: ApplicationMethod[]

  @OneToMany(() => Asset, (asset) => asset.listing, { cascade: true })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Asset)
  assets: Asset[]

  @OneToMany(() => ListingEvent, (listingEvent) => listingEvent.listing, { cascade: true })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ListingEvent)
  events: ListingEvent[]

  @ManyToOne(() => Property, (property) => property.listings, { nullable: false })
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Property)
  property: Property

  @OneToMany(() => Application, (application) => application.listing)
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => Application)
  applications: Application[]

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  applicationDueDate: Date | null

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  applicationOpenDate: Date | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  applicationFee: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  applicationOrganization: string | null

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  applicationAddress: Address | null

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  applicationPickUpAddress: Address | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  applicationPickUpAddressOfficeHours: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  buildingSelectionCriteria: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  costsNotIncluded: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  creditHistory: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  criminalBackground: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  depositMin: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  depositMax: string | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional()
  @IsBoolean()
  disableUnitsAccordion: boolean | null

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  leasingAgentAddress: Address | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsEmail()
  leasingAgentEmail: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  leasingAgentName: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  leasingAgentOfficeHours: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  leasingAgentPhone: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  leasingAgentTitle: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  name: string | null

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  postmarkedApplicationsReceivedByDate: Date | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  programRules: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  rentalAssistance: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  rentalHistory: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  requiredDocuments: string | null

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional()
  @IsNumber()
  waitlistCurrentSize: number | null

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional()
  @IsNumber()
  waitlistMaxSize: number | null

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => WhatToExpect)
  whatToExpect: WhatToExpect | null

  @Column({
    type: "enum",
    enum: ListingStatus,
    default: ListingStatus.pending,
  })
  @Expose()
  @IsEnum(ListingStatus)
  @ApiProperty({ enum: ListingStatus, enumName: "ListingStatus" })
  status: ListingStatus

  @Expose()
  @ApiProperty()
  get urlSlug(): string | undefined {
    return listingUrlSlug(this)
  }

  @Expose()
  applicationConfig?: Record<string, unknown>
}

export { Listing as default, Listing }
