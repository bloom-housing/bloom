import { Listing } from "../entities/listing.entity"
import { Expose, Transform, Type } from "class-transformer"
import {
  ArrayMaxSize,
  IsDate,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator"
import moment from "moment"
import {
  PreferenceCreateDto,
  PreferenceDto,
  PreferenceUpdateDto,
} from "../../preferences/dto/preference.dto"
import { ApiProperty, getSchemaPath, OmitType } from "@nestjs/swagger"
import { IdDto } from "../../shared/dto/id.dto"
import { AddressCreateDto, AddressDto, AddressUpdateDto } from "../../shared/dto/address.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UserBasicDto } from "../../auth/dto/user.dto"
import { ListingStatus } from "../types/listing-status-enum"
import { PaginationFactory, PaginationAllowsAllQueryParams } from "../../shared/dto/pagination.dto"
import { BaseFilter } from "../../shared/dto/filter.dto"
import { UnitCreateDto, UnitDto, UnitUpdateDto } from "../../units/dto/unit.dto"
import { transformUnits } from "../../shared/units-transformations"
import { JurisdictionDto } from "../../jurisdictions/dto/jurisdiction.dto"
import { Unit } from "../../units/entities/unit.entity"
import { UnitsSummarized } from "../../units/types/units-summarized"
import { ReservedCommunityTypeDto } from "../../reserved-community-type/dto/reserved-community-type.dto"
import { AssetCreateDto, AssetDto, AssetUpdateDto } from "../../assets/dto/asset.dto"
import { ListingReviewOrder } from "../types/listing-review-order-enum"
import { ListingEventType } from "../types/listing-event-type-enum"
import { ListingEventCreateDto, ListingEventDto, ListingEventUpdateDto } from "./listing-event.dto"

export class ListingDto extends OmitType(Listing, [
  "applicationAddress",
  "applicationPickUpAddress",
  "applicationDropOffAddress",
  "applicationMailingAddress",
  "applications",
  "events",
  "image",
  "jurisdiction",
  "leasingAgents",
  "leasingAgentAddress",
  "preferences",
  "property",
  "reservedCommunityType",
  "result",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PreferenceDto)
  preferences: PreferenceDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressDto)
  applicationAddress?: AddressDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressDto)
  applicationPickUpAddress?: AddressDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressDto)
  applicationDropOffAddress: AddressDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressDto)
  applicationMailingAddress: AddressDto | null

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEventDto)
  events: ListingEventDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetDto)
  image?: AssetDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressDto)
  leasingAgentAddress?: AddressDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UserBasicDto)
  leasingAgents?: UserBasicDto[] | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => JurisdictionDto)
  jurisdiction?: JurisdictionDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ReservedCommunityTypeDto)
  reservedCommunityType?: ReservedCommunityTypeDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetDto)
  result?: AssetDto | null

  @Expose()
  @Transform((_value, listing) => {
    if (moment(listing.applicationDueDate).isBefore()) {
      listing.status = ListingStatus.closed
    }

    return listing.status
  })
  status: ListingStatus

  @Expose()
  @ApiProperty({ enum: ListingReviewOrder })
  get reviewOrderType() {
    return this.events.some((event) => event.type === ListingEventType.publicLottery)
      ? ListingReviewOrder.lottery
      : ListingReviewOrder.firstComeFirstServe
  }

  @Expose()
  @Type(() => UnitDto)
  @Transform(
    (value, obj: Listing) => {
      return obj.property?.units
    },
    { toClassOnly: true }
  )
  units: UnitDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property.accessibility
    },
    { toClassOnly: true }
  )
  accessibility?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property.amenities
    },
    { toClassOnly: true }
  )
  amenities?: string | null

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressDto)
  @Transform(
    (value, obj: Listing) => {
      return obj.property.buildingAddress
    },
    { toClassOnly: true }
  )
  buildingAddress: AddressDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property.buildingTotalUnits
    },
    { toClassOnly: true }
  )
  buildingTotalUnits?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property.developer
    },
    { toClassOnly: true }
  )
  developer?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property.householdSizeMax
    },
    { toClassOnly: true }
  )
  householdSizeMax?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property.householdSizeMin
    },
    { toClassOnly: true }
  )
  householdSizeMin?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property.neighborhood
    },
    { toClassOnly: true }
  )
  neighborhood?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property.petPolicy
    },
    { toClassOnly: true }
  )
  petPolicy?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property.smokingPolicy
    },
    { toClassOnly: true }
  )
  smokingPolicy?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property.unitsAvailable
    },
    { toClassOnly: true }
  )
  unitsAvailable?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property.unitAmenities
    },
    { toClassOnly: true }
  )
  unitAmenities?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property.servicesOffered
    },
    { toClassOnly: true }
  )
  servicesOffered?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property.yearBuilt
    },
    { toClassOnly: true }
  )
  yearBuilt?: number | null

  @Expose()
  @ApiProperty({ type: UnitsSummarized })
  get unitsSummarized(): UnitsSummarized | undefined {
    if (Array.isArray(this.units) && this.units.length > 0) {
      return transformUnits(this.units as Unit[])
    }
  }
}

export class PaginatedListingDto extends PaginationFactory<ListingDto>(ListingDto) {}

export class ListingCreateDto extends OmitType(ListingDto, [
  "id",
  "createdAt",
  "updatedAt",
  "preferences",
  "events",
  "image",
  "leasingAgentAddress",
  "leasingAgents",
  "urlSlug",
  "showWaitlist",
  "reviewOrderType",
  "units",
  "accessibility",
  "amenities",
  "buildingAddress",
  "buildingTotalUnits",
  "developer",
  "householdSizeMax",
  "householdSizeMin",
  "neighborhood",
  "petPolicy",
  "smokingPolicy",
  "unitsAvailable",
  "unitAmenities",
  "servicesOffered",
  "yearBuilt",
  "unitsSummarized",
  "jurisdiction",
  "reservedCommunityType",
  "applicationCount",
  "result",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PreferenceCreateDto)
  preferences: PreferenceCreateDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  applicationAddress?: AddressCreateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  applicationPickUpAddress?: AddressCreateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  applicationDropOffAddress: AddressCreateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  applicationMailingAddress: AddressCreateDto | null

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEventCreateDto)
  events: ListingEventCreateDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetCreateDto)
  image?: AssetCreateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  leasingAgentAddress?: AddressCreateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  leasingAgents?: IdDto[] | null

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMaxSize(256, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitCreateDto)
  units: UnitCreateDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  accessibility?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  amenities?: string | null

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  buildingAddress: AddressCreateDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  buildingTotalUnits?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  developer?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  householdSizeMax?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  householdSizeMin?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  neighborhood?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  petPolicy?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  smokingPolicy?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  unitsAvailable?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  unitAmenities?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  servicesOffered?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  yearBuilt?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  jurisdiction?: IdDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  reservedCommunityType?: IdDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetCreateDto)
  result?: AssetCreateDto | null
}

export class ListingUpdateDto extends OmitType(ListingDto, [
  "id",
  "createdAt",
  "updatedAt",
  "preferences",
  "image",
  "events",
  "leasingAgentAddress",
  "urlSlug",
  "leasingAgents",
  "showWaitlist",
  "reviewOrderType",
  "units",
  "accessibility",
  "amenities",
  "buildingAddress",
  "buildingTotalUnits",
  "developer",
  "householdSizeMax",
  "householdSizeMin",
  "neighborhood",
  "petPolicy",
  "smokingPolicy",
  "unitsAvailable",
  "unitAmenities",
  "servicesOffered",
  "yearBuilt",
  "unitsSummarized",
  "jurisdiction",
  "reservedCommunityType",
  "applicationCount",
  "result",
] as const) {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id?: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt?: Date

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt?: Date

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PreferenceUpdateDto)
  preferences: PreferenceUpdateDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdateDto)
  applicationAddress?: AddressUpdateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdateDto)
  applicationPickUpAddress?: AddressUpdateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdateDto)
  applicationDropOffAddress: AddressUpdateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdateDto)
  applicationMailingAddress: AddressUpdateDto | null

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEventUpdateDto)
  events: ListingEventUpdateDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetUpdateDto)
  image?: AssetUpdateDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdateDto)
  leasingAgentAddress?: AddressUpdateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  leasingAgents?: IdDto[] | null

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMaxSize(256, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitUpdateDto)
  units: UnitUpdateDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  accessibility?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  amenities?: string | null

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdateDto)
  buildingAddress: AddressUpdateDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  buildingTotalUnits?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  developer?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  householdSizeMax?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  householdSizeMin?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  neighborhood?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  petPolicy?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  smokingPolicy?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  unitsAvailable?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  unitAmenities?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  servicesOffered?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  yearBuilt?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  jurisdiction?: IdDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDto)
  reservedCommunityType?: IdDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetUpdateDto)
  result?: AssetUpdateDto
}

// The names of supported filters on /listings
export enum ListingFilterKeys {
  status = "status",
  name = "name",
  neighborhood = "neighborhood",
}

// This is a hack: We wrap the enum in a class, so it can be included with
// @ApiExtraModels and picked by the backend-swagger.ts codegen.
export class ListingsFilterKeysTransporter {
  @Expose()
  @ApiProperty({
    enum: Object.keys(ListingFilterKeys),
    required: false,
  })
  listingFilterKey?: ListingFilterKeys
}

// add other listing filter params here
export class ListingFilterParams extends BaseFilter {
  @Expose()
  @ApiProperty({
    type: String,
    example: "Coliseum",
    required: false,
  })
  [ListingFilterKeys.name]?: string;

  @Expose()
  @ApiProperty({
    enum: Object.keys(ListingStatus),
    example: "active",
    required: false,
  })
  [ListingFilterKeys.status]?: ListingStatus;

  @Expose()
  @ApiProperty({
    type: String,
    example: "Fox Creek",
    required: false,
  })
  [ListingFilterKeys.neighborhood]?: string
}

export class ListingsQueryParams extends PaginationAllowsAllQueryParams {
  @Expose()
  @ApiProperty({
    name: "filter",
    required: false,
    type: [String],
    items: {
      $ref: getSchemaPath(ListingFilterParams),
    },
    example: { $comparison: ["=", "<>"], status: "active", name: "Coliseum" },
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  filter?: ListingFilterParams

  @Expose()
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  jsonpath?: string
}

// Using a record lets us enforce that all types are handled in addFilter
export const filterTypeToFieldMap: Record<keyof typeof ListingFilterKeys, string> = {
  status: "listings.status",
  name: "listings.name",
  neighborhood: "property.neighborhood",
}
