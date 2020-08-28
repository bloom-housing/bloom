import { Listing, ListingStatus } from "../entity/listing.entity"
import { ListingsResponseStatus } from "./listings.service"
import { Expose, Type } from "class-transformer"
import {
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { WhatToExpect } from "../shared/dto/whatToExpect.dto"
import { Address } from "../shared/dto/address.dto"
import { PreferenceDto } from "../preferences/preference.dto"
import { AssetDto } from "../assets/asset.dto"
import { ApplicationMethodDto } from "../application-methods/applicationMethod.dto"
import { UnitDto } from "../units/units.dto"

export class ListingDto {
  @Expose()
  @IsString()
  id: string
  @Expose()
  @IsString()
  accessibility: string
  @Expose()
  @IsString()
  amenities: string
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  applicationAddress: Address
  @Expose()
  @IsDateString()
  applicationDueDate: string
  @Expose()
  @IsNumberString()
  applicationFee: string
  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ApplicationMethodDto)
  applicationMethods: ApplicationMethodDto[]
  @Expose()
  @IsOptional()
  @IsDateString()
  applicationOpenDate?: string | undefined
  @Expose()
  @IsString()
  applicationOrganization: string
  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => AssetDto)
  assets: AssetDto[]
  @Expose()
  @IsBoolean()
  blankPaperApplicationCanBePickedUp: boolean
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  buildingAddress: Address
  @Expose()
  @IsString()
  buildingSelectionCriteria: string
  @Expose()
  @IsNumber()
  buildingTotalUnits: number
  @Expose()
  @IsString()
  costsNotIncluded: string
  @Expose()
  @IsDateString()
  createdAt: string
  @Expose()
  @IsString()
  creditHistory: string
  @Expose()
  @IsString()
  criminalBackground: string
  @Expose()
  @IsOptional()
  @IsNumberString()
  depositMax?: string
  @Expose()
  @IsNumberString()
  depositMin: string
  @Expose()
  @IsString()
  developer: string
  @Expose()
  @IsOptional()
  @IsBoolean()
  disableUnitsAccordion?: boolean | undefined
  @Expose()
  @IsOptional()
  @IsNumber()
  householdSizeMax?: number | undefined
  @Expose()
  @IsOptional()
  @IsNumber()
  householdSizeMin?: number | undefined
  @Expose()
  @IsOptional()
  @IsString()
  imageUrl?: string | undefined
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => Address)
  leasingAgentAddress: Address
  @Expose()
  @IsString()
  @IsEmail()
  leasingAgentEmail: string
  @Expose()
  @IsString()
  leasingAgentName: string
  @Expose()
  @IsString()
  leasingAgentOfficeHours: string
  @Expose()
  @IsString()
  leasingAgentPhone: string
  @Expose()
  @IsString()
  leasingAgentTitle: string
  @Expose()
  @IsString()
  name: string
  @Expose()
  @IsString()
  neighborhood: string
  @Expose()
  @IsString()
  petPolicy: string
  @Expose()
  @IsDateString()
  postmarkedApplicationsReceivedByDate: string
  @Expose()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PreferenceDto)
  preferences: PreferenceDto[]
  @Expose()
  @IsOptional()
  @IsString()
  programRules?: string | undefined
  @Expose()
  @IsString()
  rentalHistory: string
  @Expose()
  @IsString()
  requiredDocuments: string
  @Expose()
  @IsString()
  smokingPolicy: string
  @Expose()
  @IsEnum(ListingStatus)
  status: ListingStatus
  @Expose()
  @IsString()
  unitAmenities: string
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => UnitDto)
  units: UnitDto[]
  @Expose()
  @IsNumber()
  unitsAvailable: number
  @Expose()
  @IsDateString()
  updatedAt: string
  @Expose()
  @IsOptional()
  @IsString()
  urlSlug?: string | undefined
  @Expose()
  @IsNumber()
  waitlistCurrentSize: number
  @Expose()
  @IsNumber()
  waitlistMaxSize: number
  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => WhatToExpect)
  whatToExpect?: WhatToExpect | undefined
  @Expose()
  @IsNumber()
  yearBuilt: number
}

export class ListingExtendedDto {
  @Expose()
  @IsEnum(ListingsResponseStatus)
  status: ListingsResponseStatus
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ListingDto)
  listings: ListingDto[]
  @Expose()
  amiCharts: any
}
