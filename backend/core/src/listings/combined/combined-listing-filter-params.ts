import { ListingFilterParams } from "../dto/listing-filter-params"
import { CombinedListingFilterKeys } from "./combined-listing-filter-keys-enum"
import { Expose, Transform } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsBoolean, IsString, IsArray, IsNumberString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

export class CombinedListingFilterParams extends ListingFilterParams {
  @Expose()
  @ApiProperty({
    type: Boolean,
    example: false,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform((value: string | undefined) => {
    switch (value) {
      case "true":
        return true
      case "false":
        return false
      default:
        return undefined
    }
  })
  [CombinedListingFilterKeys.isExternal]?: boolean;

  @Expose()
  @ApiProperty({
    type: Array,
    example: ["Santa Clara"],
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  [CombinedListingFilterKeys.counties]?: string[];

  @Expose()
  @ApiProperty({
    type: String,
    example: "San Jose",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [CombinedListingFilterKeys.city]?: string;

  @Expose()
  @ApiProperty({
    type: Number,
    example: "1000",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  [CombinedListingFilterKeys.minMonthlyRent]?: number;

  @Expose()
  @ApiProperty({
    type: Number,
    example: "2000",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  [CombinedListingFilterKeys.maxMonthlyRent]?: number;

  @Expose()
  @ApiProperty({
    type: Number,
    example: "1",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  [CombinedListingFilterKeys.minBathrooms]?: number;

  @Expose()
  @ApiProperty({
    type: Number,
    example: "2",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  [CombinedListingFilterKeys.maxBathrooms]?: number;

  @Expose()
  @ApiProperty({
    type: Number,
    example: "1",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  [CombinedListingFilterKeys.minBedrooms]?: number;

  @Expose()
  @ApiProperty({
    type: Number,
    example: "3",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  [CombinedListingFilterKeys.maxBedrooms]?: number
}
