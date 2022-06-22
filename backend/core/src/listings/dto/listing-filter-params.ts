// add other listing filter params here
import { BaseFilter } from "../../shared/dto/filter.dto"
import { Expose } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsBooleanString, IsEnum, IsNumberString, IsOptional, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ListingFilterKeys } from "../types/listing-filter-keys-enum"
import { ListingStatus } from "../types/listing-status-enum"
import { ListingMarketingTypeEnum } from "../types/listing-marketing-type-enum"

// add other listing filter params here
export class ListingFilterParams extends BaseFilter {
  @Expose()
  @ApiProperty({
    type: String,
    example: "FAB1A3C6-965E-4054-9A48-A282E92E9426",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.id]?: string;

  @Expose()
  @ApiProperty({
    type: String,
    example: "Coliseum",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.name]?: string;

  @Expose()
  @ApiProperty({
    enum: Object.keys(ListingStatus),
    example: "active",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ListingStatus, { groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.status]?: ListingStatus;

  @Expose()
  @ApiProperty({
    type: String,
    example: "2, 3",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.bedRoomSize]?: string;

  @Expose()
  @ApiProperty({
    type: String,
    example: "48211, 48212",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.zipcode]?: string;

  @Expose()
  @ApiProperty({
    type: String,
    example: "FAB1A3C6-965E-4054-9A48-A282E92E9426",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.leasingAgents]?: string;

  @Expose()
  @ApiProperty({
    type: String,
    example: "hasAvailability",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.availability]?: string;

  @Expose()
  @ApiProperty({
    type: String,
    example: "senior62",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.program]?: string;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: "true",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBooleanString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.isVerified]?: boolean;

  @Expose()
  @ApiProperty({
    type: Number,
    example: "300",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.minRent]?: number;

  @Expose()
  @ApiProperty({
    type: Number,
    example: "700",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.maxRent]?: number;

  @Expose()
  @ApiProperty({
    type: Number,
    example: "40",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.minAmiPercentage]?: number;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: "true",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBooleanString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.elevator]?: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: "true",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBooleanString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.wheelchairRamp]?: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: "true",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBooleanString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.serviceAnimalsAllowed]?: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: "true",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBooleanString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.accessibleParking]?: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: "true",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBooleanString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.parkingOnSite]?: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: "true",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBooleanString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.inUnitWasherDryer]?: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: "true",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBooleanString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.laundryInBuilding]?: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: "true",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBooleanString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.barrierFreeEntrance]?: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: "true",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBooleanString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.rollInShower]?: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: "true",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBooleanString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.grabBars]?: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: "true",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBooleanString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.heatingInUnit]?: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: "true",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBooleanString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.acInUnit]?: boolean;

  @Expose()
  @ApiProperty({
    type: String,
    example: "bab6cb4f-7a5a-4ee5-b327-0c2508807780",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.jurisdiction]?: string;

  @Expose()
  @ApiProperty({
    enum: Object.keys(ListingMarketingTypeEnum),
    example: "marketing",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ListingMarketingTypeEnum, { groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.marketingType]?: ListingMarketingTypeEnum;

  @Expose()
  @ApiProperty({
    type: String,
    example: "bab6cb4f-7a5a-4ee5-b327-0c2508807780",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.favorited]?: string;

  @Expose()
  @ApiProperty({
    type: String,
    example: "senior55",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.communityPrograms]?: string;

  @Expose()
  @ApiProperty({
    type: String,
    example: "visual",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.accessibility]?: string;

  @Expose()
  @ApiProperty({
    type: String,
    example: "downtown,eastside",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.region]?: string;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: "true",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBooleanString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.section8Acceptance]?: boolean
}
