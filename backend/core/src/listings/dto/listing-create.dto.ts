import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import {
  ArrayMaxSize,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IdDto } from "../../shared/dto/id.dto"
import { PreferenceCreateDto } from "../../preferences/dto/preference.dto"
import { AddressCreateDto } from "../../shared/dto/address.dto"
import { ListingEventCreateDto } from "./listing-event.dto"
import { AssetCreateDto } from "../../assets/dto/asset.dto"
import { UnitsSummaryCreateDto } from "../../units-summary/dto/units-summary.dto"
import { ListingDto } from "./listing.dto"
import { ApplicationMethodCreateDto } from "../../application-methods/dto/application-method.dto"
import { UnitCreateDto } from "../../units/dto/unit-create.dto"

export class ListingCreateDto extends OmitType(ListingDto, [
  "id",
  "createdAt",
  "updatedAt",
  "applicationMethods",
  "buildingSelectionCriteriaFile",
  "preferences",
  "events",
  "image",
  "leasingAgentAddress",
  "leasingAgents",
  "urlSlug",
  "showWaitlist",
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
  "result",
  "unitsSummary",
  "referralApplication",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationMethodCreateDto)
  applicationMethods: ApplicationMethodCreateDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PreferenceCreateDto)
  preferences: PreferenceCreateDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  applicationAddress?: AddressCreateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  applicationPickUpAddress?: AddressCreateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  applicationDropOffAddress: AddressCreateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  applicationMailingAddress: AddressCreateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetCreateDto)
  buildingSelectionCriteriaFile?: AssetCreateDto | null

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
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  buildingAddress?: AddressCreateDto | null

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
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  jurisdiction: IdDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDto)
  reservedCommunityType?: IdDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetCreateDto)
  result?: AssetCreateDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitsSummaryCreateDto)
  unitsSummary?: UnitsSummaryCreateDto[]
}
