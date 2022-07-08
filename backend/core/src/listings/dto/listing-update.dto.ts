import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import {
  ArrayMaxSize,
  IsDate,
  IsDefined,
  IsOptional,
  IsUUID,
  ValidateNested,
} from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IdDto } from "../../shared/dto/id.dto"
import { AddressUpdateDto } from "../../shared/dto/address.dto"
import { ListingEventUpdateDto } from "./listing-event.dto"
import { AssetUpdateDto } from "../../assets/dto/asset.dto"
import { UnitsSummaryUpdateDto } from "../../units-summary/dto/units-summary.dto"
import { ListingDto } from "./listing.dto"
import { ApplicationMethodUpdateDto } from "../../application-methods/dto/application-method.dto"
import { UnitUpdateDto } from "../../units/dto/unit-update.dto"
import { ListingPreferenceUpdateDto } from "../../preferences/dto/listing-preference-update.dto"
import { ListingProgramUpdateDto } from "../../program/dto/listing-program-update.dto"
import { ListingImageUpdateDto } from "./listing-image-update.dto"

export class ListingUpdateDto extends OmitType(ListingDto, [
  "id",
  "createdAt",
  "updatedAt",
  "applicationMailingAddress",
  "applicationDropOffAddress",
  "applicationPickUpAddress",
  "applicationMethods",
  "buildingSelectionCriteriaFile",
  "images",
  "events",
  "leasingAgentAddress",
  "urlSlug",
  "leasingAgents",
  "showWaitlist",
  "units",
  "buildingAddress",
  "unitsSummarized",
  "jurisdiction",
  "reservedCommunityType",
  "result",
  "unitsSummary",
  "referralApplication",
  "listingPreferences",
  "listingPrograms",
  "publishedAt",
  "closedAt",
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
  @Type(() => ApplicationMethodUpdateDto)
  applicationMethods: ApplicationMethodUpdateDto[]

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
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetUpdateDto)
  buildingSelectionCriteriaFile?: AssetUpdateDto | null

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEventUpdateDto)
  events: ListingEventUpdateDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingImageUpdateDto)
  images?: ListingImageUpdateDto[] | null

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
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdateDto)
  buildingAddress?: AddressUpdateDto | null

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
  @Type(() => AssetUpdateDto)
  result?: AssetUpdateDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitsSummaryUpdateDto)
  unitsSummary?: UnitsSummaryUpdateDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingPreferenceUpdateDto)
  listingPreferences: ListingPreferenceUpdateDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingProgramUpdateDto)
  listingPrograms?: ListingProgramUpdateDto[]
}
