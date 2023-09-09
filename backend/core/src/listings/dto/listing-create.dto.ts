import { OmitType } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer"
import { ArrayMaxSize, IsDefined, IsOptional, ValidateNested } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { IdDto } from "../../shared/dto/id.dto"
import { AddressCreateDto } from "../../shared/dto/address.dto"
import { ListingEventCreateDto } from "./listing-event.dto"
import { AssetCreateDto } from "../../assets/dto/asset.dto"
import { UnitsSummaryCreateDto } from "../../units-summary/dto/units-summary.dto"
import { ListingDto } from "./listing.dto"
import { ApplicationMethodCreateDto } from "../../application-methods/dto/application-method.dto"
import { UnitCreateDto } from "../../units/dto/unit-create.dto"
import { ListingImageUpdateDto } from "./listing-image-update.dto"
import { ListingMultiselectQuestionUpdateDto } from "../../multiselect-question/dto/listing-multiselect-question-update.dto"

export class ListingCreateDto extends OmitType(ListingDto, [
  "id",
  "applicationPickUpAddress",
  "applicationDropOffAddress",
  "applicationMailingAddress",
  "createdAt",
  "updatedAt",
  "applicationMethods",
  "buildingSelectionCriteriaFile",
  "events",
  "images",
  "leasingAgentAddress",
  "leasingAgents",
  "urlSlug",
  "showWaitlist",
  "units",
  "buildingAddress",
  "unitsSummarized",
  "jurisdiction",
  "reservedCommunityType",
  "result",
  "unitsSummary",
  "referralApplication",
  "listingMultiselectQuestions",
  "publishedAt",
  "closedAt",
  "afsLastRunAt",
  "requestedChangesUser",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationMethodCreateDto)
  applicationMethods: ApplicationMethodCreateDto[]

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
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingImageUpdateDto)
  images?: ListingImageUpdateDto[] | null

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
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  buildingAddress?: AddressCreateDto | null

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

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingMultiselectQuestionUpdateDto)
  listingMultiselectQuestions: ListingMultiselectQuestionUpdateDto[]
}
