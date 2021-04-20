import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm"
import { Application } from "../../applications/entities/application.entity"
import { User } from "../../user/entities/user.entity"
import { WhatToExpect } from "../../shared/dto/whatToExpect.dto"
import { Preference } from "../../preferences/entities/preference.entity"
import { Expose, Type } from "class-transformer"
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested
} from "class-validator"
import { listingUrlSlug } from "../../shared/url-helper"
import { ApiProperty } from "@nestjs/swagger"
import { Property } from "../../property/entities/property.entity"
import { Address } from "../../shared/entities/address.entity"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"
import { CSVFormattingType } from "../../csv/formatting/application-formatting-metadata-factory"
import { ApplicationFlaggedSet } from "../../application-flagged-sets/entities/application-flagged-set.entity"
import { ListingStatus } from "../types/listing-status-enum"
import { ListingEvent } from "../types/listing-event"
import { ApplicationMethodDto } from "../dto/application-method.dto"
import { AssetDto } from "../dto/asset.dto"

@Entity({ name: "listings" })
class Listing extends BaseEntity {
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

  @OneToMany(() => Preference, (preference) => preference.listing, { cascade: true })
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => Preference)
  preferences: Preference[]

  @Column("jsonb")
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationMethodDto)
  applicationMethods: ApplicationMethodDto[]

  @Column("jsonb")
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AssetDto)
  assets: AssetDto[]

  @Column("jsonb")
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEvent)
  events: ListingEvent[]

  @ManyToOne(() => Property, (property) => property.listings, { nullable: false })
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Property)
  property: Property

  @OneToMany(() => Application, (application) => application.listing)
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => Application)
  applications: Application[]

  @OneToMany(() => ApplicationFlaggedSet, (afs) => afs.listing)
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationFlaggedSet)
  applicationFlaggedSets: ApplicationFlaggedSet[]

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  applicationDueDate: Date | null

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  applicationOpenDate: Date | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicationFee: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicationOrganization: string | null

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  applicationAddress: Address | null

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  applicationPickUpAddress: Address | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicationPickUpAddressOfficeHours: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  buildingSelectionCriteria: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  costsNotIncluded: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  creditHistory: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  criminalBackground: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  depositMin: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  depositMax: string | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  disableUnitsAccordion: boolean | null

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  leasingAgentAddress: Address | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  leasingAgentEmail: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  leasingAgentName: string | null

  @ManyToMany(() => User, (leasingAgent) => leasingAgent.leasingAgentInListings, {
    nullable: true,
  })
  @JoinTable()
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => User)
  leasingAgents?: User[] | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  leasingAgentOfficeHours: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  leasingAgentPhone: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  leasingAgentTitle: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  name: string | null

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  postmarkedApplicationsReceivedByDate: Date | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  programRules: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  rentalAssistance: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  rentalHistory: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  requiredDocuments: string | null

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  waitlistCurrentSize: number | null

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  waitlistMaxSize: number | null

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => WhatToExpect)
  whatToExpect: WhatToExpect | null

  @Column({
    type: "enum",
    enum: ListingStatus,
    default: ListingStatus.pending,
  })
  @Expose()
  @IsEnum(ListingStatus, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: ListingStatus, enumName: "ListingStatus" })
  status: ListingStatus

  @Expose()
  @ApiProperty()
  get urlSlug(): string | undefined {
    return listingUrlSlug(this)
  }

  @Expose()
  applicationConfig?: Record<string, unknown>

  @Column({
    type: "boolean",
    default: false,
    nullable: false,
  })
  @Expose()
  @ApiProperty({ type: Boolean, default: false })
  @IsBoolean()
  displayWaitlistSize: boolean

  @Column({ enum: CSVFormattingType, default: CSVFormattingType.basic })
  @Expose()
  @IsEnum(CSVFormattingType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: CSVFormattingType, enumName: "CSVFormattingType" })
  CSVFormattingType: CSVFormattingType
}

export { Listing as default, Listing }
