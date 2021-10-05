// add other listing filter params here
import { BaseFilter } from "../../shared/dto/filter.dto"
import { Expose } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsBooleanString, IsEnum, IsNumberString, IsOptional, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { AvailabilityFilterEnum, ListingFilterKeys } from "../../.."
import { ListingStatus } from "../types/listing-status-enum"

// add other listing filter params here
export class ListingFilterParams extends BaseFilter {
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
    example: "Fox Creek",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.neighborhood]?: string;

  @Expose()
  @ApiProperty({
    type: Number,
    example: "3",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.bedrooms]?: number;

  @Expose()
  @ApiProperty({
    type: String,
    example: "48211",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
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
    enum: Object.keys(AvailabilityFilterEnum),
    example: "hasAvailability",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(AvailabilityFilterEnum, { groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.availability]?: AvailabilityFilterEnum;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: "true",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBooleanString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.seniorHousing]?: boolean;

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
  [ListingFilterKeys.minAmiPercentage]?: number
}
