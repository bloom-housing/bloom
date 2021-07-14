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
  UpdateDateColumn,
} from "typeorm"
import { Application } from "../../applications/entities/application.entity"
import { User } from "../../auth/entities/user.entity"
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
  MaxLength,
  ValidateNested,
} from "class-validator"
import { listingUrlSlug } from "../../shared/url-helper"
import { ApiProperty } from "@nestjs/swagger"
import { Property } from "../../property/entities/property.entity"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApplicationFlaggedSet } from "../../application-flagged-sets/entities/application-flagged-set.entity"
import { ListingStatus } from "../types/listing-status-enum"
import { ListingEventDto } from "../dto/listing-event.dto"
import { ApplicationMethodDto } from "../dto/application-method.dto"
import { CSVFormattingType } from "../../csv/types/csv-formatting-type-enum"
import { CountyCode } from "../../shared/types/county-code"
import { Jurisdiction } from "../../jurisdictions/entities/jurisdiction.entity"
import { ReservedCommunityType } from "../../reserved-community-type/entities/reserved-community-type.entity"
import { Asset } from "../../assets/entities/asset.entity"
import { AssetCreateDto } from "../../assets/dto/asset.dto"
import { ListingApplicationAddressType } from "../types/listing-application-address-type"
import { Address } from "../../shared/entities/address.entity"

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

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  additionalApplicationSubmissionNotes?: string | null

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
  @Type(() => AssetCreateDto)
  assets: AssetCreateDto[]

  @Column("jsonb")
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEventDto)
  events: ListingEventDto[]

  @ManyToOne(() => Property, (property) => property.listings, { nullable: false, cascade: true })
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
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
  applicationDueDate?: Date | null

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  applicationDueTime?: Date | null

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  applicationOpenDate?: Date | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicationFee?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicationOrganization?: string | null

  @ManyToOne(() => Address, { eager: true, nullable: true, cascade: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  applicationAddress?: Address | null

  @ManyToOne(() => Address, { eager: true, nullable: true, cascade: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  applicationPickUpAddress?: Address | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicationPickUpAddressOfficeHours?: string | null

  @Column({ type: "enum", enum: ListingApplicationAddressType, nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ListingApplicationAddressType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ListingApplicationAddressType,
    enumName: "ListingApplicationAddressType",
  })
  applicationPickUpAddressType?: ListingApplicationAddressType | null

  @ManyToOne(() => Address, { eager: true, nullable: true, cascade: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  applicationDropOffAddress?: Address | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicationDropOffAddressOfficeHours?: string | null

  @Column({ type: "enum", enum: ListingApplicationAddressType, nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ListingApplicationAddressType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ListingApplicationAddressType,
    enumName: "ListingApplicationAddressType",
  })
  applicationDropOffAddressType?: ListingApplicationAddressType | null

  @ManyToOne(() => Address, { eager: true, nullable: true, cascade: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  applicationMailingAddress?: Address | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  buildingSelectionCriteria?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  costsNotIncluded?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  creditHistory?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  criminalBackground?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  depositMin?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  depositMax?: string | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  disableUnitsAccordion?: boolean | null

  @ManyToOne(() => Jurisdiction, { eager: true, nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Jurisdiction)
  jurisdiction?: Jurisdiction | null

  @ManyToOne(() => Address, { eager: true, nullable: true, cascade: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  leasingAgentAddress?: Address | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  leasingAgentEmail?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  leasingAgentName?: string | null

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
  leasingAgentOfficeHours?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  leasingAgentPhone?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  leasingAgentTitle?: string | null

  @Column({ type: "text" })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  name: string

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  postmarkedApplicationsReceivedByDate?: Date | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  programRules?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  rentalAssistance?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  rentalHistory?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  requiredDocuments?: string | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  specialNotes?: string | null

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  waitlistCurrentSize?: number | null

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  waitlistMaxSize?: number | null

  @Column({ type: "jsonb", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => WhatToExpect)
  whatToExpect?: WhatToExpect | null

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

  @Expose()
  applicationCount?: number

  @Column({ type: "boolean" })
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  displayWaitlistSize: boolean

  @Column({ enum: CSVFormattingType, default: CSVFormattingType.basic })
  @Expose()
  @IsEnum(CSVFormattingType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: CSVFormattingType, enumName: "CSVFormattingType" })
  CSVFormattingType: CSVFormattingType

  @Column({ enum: CountyCode, default: CountyCode.alameda })
  @Expose()
  @IsEnum(CountyCode, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: CountyCode, enumName: "CountyCode" })
  countyCode: CountyCode

  @Expose()
  @ApiProperty()
  get showWaitlist(): boolean {
    return (
      this.waitlistMaxSize !== null &&
      this.waitlistCurrentSize !== null &&
      this.waitlistCurrentSize < this.waitlistMaxSize
    )
  }

  @ManyToOne(() => ReservedCommunityType, { eager: true, nullable: true })
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ReservedCommunityType)
  reservedCommunityType?: ReservedCommunityType

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  reservedCommunityMinAge?: number | null

  @ManyToOne(() => Asset, { eager: true, nullable: true, cascade: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  image?: Asset | null

  @ManyToOne(() => Asset, { eager: true, nullable: true, cascade: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  result?: Asset | null

  @Column({ type: "text", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  resultLink?: string | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  isWaitlistOpen?: boolean | null

  @Column({ type: "integer", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  waitlistOpenSpots?: number | null
}

export { Listing as default, Listing }
