import { Listing } from "../entities/listing.entity"
import { Expose, Transform, Type } from "class-transformer"
import { IsDefined, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { ApiProperty, OmitType } from "@nestjs/swagger"
import { AddressDto } from "../../shared/dto/address.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ListingStatus } from "../types/listing-status-enum"
import { UnitDto } from "../../units/dto/unit.dto"
import { ReservedCommunityTypeDto } from "../../reserved-community-type/dto/reserved-community-type.dto"
import { AssetDto } from "../../assets/dto/asset.dto"
import { ListingEventDto } from "./listing-event.dto"
import { listingUrlSlug } from "../../shared/url-helper"
import { JurisdictionSlimDto } from "../../jurisdictions/dto/jurisdiction.dto"
import { UserBasicDto } from "../../auth/dto/user-basic.dto"
import { ApplicationMethodDto } from "../../application-methods/dto/application-method.dto"
import { UnitsSummaryDto } from "../../units-summary/dto/units-summary.dto"
import { ListingFeaturesDto } from "./listing-features.dto"
import { ListingMultiselectQuestionDto } from "../../multiselect-question/dto/listing-multiselect-question.dto"
import { ListingImageDto } from "./listing-image.dto"
import { ListingUtilitiesDto } from "./listing-utilities.dto"
import { UserDto } from "../../auth/dto/user.dto"

export class ListingDto extends OmitType(Listing, [
  "applicationPickUpAddress",
  "applicationDropOffAddress",
  "applicationMailingAddress",
  "applications",
  "applicationMethods",
  "requestedChangesUser",
  "buildingSelectionCriteriaFile",
  "events",
  "images",
  "jurisdiction",
  "leasingAgents",
  "leasingAgentAddress",
  "listingMultiselectQuestions",
  "reservedCommunityType",
  "result",
  "unitsSummary",
  "features",
  "utilities",
  "units",
  "buildingAddress",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationMethodDto)
  applicationMethods: ApplicationMethodDto[]

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
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetDto)
  buildingSelectionCriteriaFile?: AssetDto | null

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEventDto)
  events: ListingEventDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingImageDto)
  images?: ListingImageDto[] | null

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
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingMultiselectQuestionDto)
  listingMultiselectQuestions: ListingMultiselectQuestionDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => JurisdictionSlimDto)
  jurisdiction: JurisdictionSlimDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ReservedCommunityTypeDto)
  reservedCommunityType?: ReservedCommunityTypeDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetDto)
  result?: AssetDto | null

  @Expose()
  @IsEnum(ListingStatus, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: ListingStatus, enumName: "ListingStatus" })
  status: ListingStatus

  @Expose()
  @Type(() => UnitDto)
  units: UnitDto[]

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
  @Type(() => AddressDto)
  buildingAddress: AddressDto

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
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return listingUrlSlug(obj)
    },
    { toClassOnly: true }
  )
  urlSlug: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitsSummaryDto)
  unitsSummary?: UnitsSummaryDto[]

  // Keep countyCode so we don't have to update frontend apps yet
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.jurisdiction?.name
    },
    { toClassOnly: true }
  )
  countyCode?: string

  @Expose()
  @Type(() => ListingFeaturesDto)
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  features?: ListingFeaturesDto

  @Expose()
  @Type(() => ListingUtilitiesDto)
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  utilities?: ListingUtilitiesDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UserDto)
  requestedChangesUser?: UserDto | null
}
