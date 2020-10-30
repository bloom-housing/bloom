import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { Unit } from "./unit.entity"
import { Application } from "./application.entity"
import { Asset } from "./asset.entity"
import { ApplicationMethod } from "./application-method.entity"
import { Address } from "../shared/dto/address.dto"
import { WhatToExpect } from "../shared/dto/whatToExpect.dto"
import { Preference } from "./preference.entity"
import { UnitsSummarized } from "@bloom-housing/core"
import { Expose, Type } from "class-transformer"
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator"
import { ListingEvent } from "./listing-event.entity"
import { transformUnits } from "../lib/unit_transformations"
import { amiCharts } from "../lib/ami_charts"
import { listingUrlSlug } from "../lib/url_helper"
import { ApiProperty } from "@nestjs/swagger"

export enum ListingStatus {
  active = "active",
  pending = "pending",
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
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  updatedAt: Date

  @OneToMany((type) => Preference, (preference) => preference.listing)
  preferences: Preference[]

  @OneToMany((type) => Unit, (unit) => unit.listing)
  units: Unit[]

  @OneToMany((type) => ApplicationMethod, (applicationMethod) => applicationMethod.listing)
  applicationMethods: ApplicationMethod[]

  @OneToMany((type) => Asset, (asset) => asset.listing)
  assets: Asset[]

  @OneToMany((type) => ListingEvent, (listingEvent) => listingEvent.listing)
  events: ListingEvent[]

  @OneToMany((type) => Application, (application) => application.listing)
  applications: Application[]

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  accessibility: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  amenities: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  applicationDueDate: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  applicationOpenDate: string | null

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

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional()
  @IsBoolean()
  blankPaperApplicationCanBePickedUp: boolean | null

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  buildingAddress: Address | null

  @Column({ type: "numeric", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  buildingTotalUnits: string | null

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

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  developer: string | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional()
  @IsBoolean()
  disableUnitsAccordion: boolean | null

  @Column({ type: "numeric", nullable: true })
  @Expose()
  @IsOptional()
  @IsNumber()
  householdSizeMax: number | null

  @Column({ type: "numeric", nullable: true })
  @Expose()
  @IsOptional()
  @IsNumber()
  householdSizeMin: number | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  imageUrl: string | null

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

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  neighborhood: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  petPolicy: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsDateString()
  postmarkedApplicationsReceivedByDate: string | null

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

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  smokingPolicy: string | null

  @Column({ type: "numeric", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  unitsAvailable: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  unitAmenities: string | null

  @Column({ type: "numeric", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  waitlistCurrentSize: string | null

  @Column({ type: "numeric", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  waitlistMaxSize: string | null

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => WhatToExpect)
  whatToExpect: WhatToExpect | null

  @Column({ type: "numeric", nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  yearBuilt: string | null

  @Column({
    type: "enum",
    enum: ListingStatus,
    default: ListingStatus.pending,
  })
  @Expose()
  @IsEnum(ListingStatus)
  status: ListingStatus

  @Expose()
  @ApiProperty()
  get unitsSummarized(): UnitsSummarized | undefined {
    if (this.units.length > 0) {
      return transformUnits(this.units, amiCharts)
    }
  }

  @Expose()
  @ApiProperty()
  get urlSlug(): string | undefined {
    return listingUrlSlug(this)
  }
}

export { Listing as default, Listing }
