import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ArrayMaxSize, Validate, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { IdDTO } from '../shared/id.dto';
import { Listing } from './listing.dto';
import { UnitCreate } from '../units/unit-create.dto';
import { ApplicationMethodCreate } from '../application-methods/application-method-create.dto';
import { AssetCreate } from '../assets/asset-create.dto';
import { UnitsSummaryCreate } from '../units/units-summary-create.dto';
import { ListingImageCreate } from './listing-image-create.dto';
import { AddressCreate } from '../addresses/address-create.dto';
import { ListingEventCreate } from './listing-event-create.dto';
import { ListingFeatures } from './listing-feature.dto';
import { ListingUtilities } from './listing-utility.dto';
import { LotteryDateParamValidator } from '../../utilities/lottery-date-validator';
import { UnitGroupCreate } from '../unit-groups/unit-group-create.dto';
import { ValidateListingPublish } from '../../decorators/validate-listing-publish.decorator';
import {
  ValidateAtLeastOneUnit,
  ValidateOnlyUnitsOrUnitGroups,
} from '../../decorators/validate-units-required.decorator';
import { ValidateListingImages } from '../../decorators/validate-listing-images.decorator';

export class ListingUpdate extends OmitType(Listing, [
  // fields get their type changed
  'listingMultiselectQuestions',
  'units',
  'unitGroups',
  'applicationMethods',
  'assets',
  'unitsSummary',
  'listingImages',
  'listingsResult',
  'listingsApplicationPickUpAddress',
  'listingsApplicationMailingAddress',
  'listingsApplicationDropOffAddress',
  'listingsLeasingAgentAddress',
  'listingsBuildingAddress',
  'listingsBuildingSelectionCriteriaFile',
  'listingsMarketingFlyerFile',
  'listingsAccessibleMarketingFlyerFile',
  'listingEvents',
  'listingFeatures',
  'listingUtilities',
  'requestedChangesUser',

  // fields removed entirely
  'createdAt',
  'updatedAt',
  'referralApplication',
  'publishedAt',
  'showWaitlist',
  'unitsSummarized',
  'unitGroupsSummarized',
  'closedAt',
  'afsLastRunAt',
  'urlSlug',
  'applicationConfig',
  'applicationLotteryTotals',
]) {
  @Expose()
  @ValidateListingPublish('listingMultiselectQuestions', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDTO)
  @ApiPropertyOptional({ type: IdDTO, isArray: true })
  listingMultiselectQuestions?: IdDTO[];

  @Expose()
  @ValidateAtLeastOneUnit({
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateOnlyUnitsOrUnitGroups({
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitCreate)
  @ArrayMaxSize(256, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ type: UnitCreate, isArray: true })
  units?: UnitCreate[];

  @Expose()
  @ValidateAtLeastOneUnit({
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateOnlyUnitsOrUnitGroups({
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitGroupCreate)
  @ApiPropertyOptional({ type: UnitGroupCreate, isArray: true })
  unitGroups?: UnitGroupCreate[];

  @Expose()
  @ValidateListingPublish('applicationMethods', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationMethodCreate)
  @ApiPropertyOptional({
    type: ApplicationMethodCreate,
    isArray: true,
  })
  applicationMethods?: ApplicationMethodCreate[];

  @Expose()
  @ValidateListingPublish('assets', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AssetCreate)
  @ApiPropertyOptional({ type: AssetCreate, isArray: true })
  assets?: AssetCreate[];

  @Expose()
  @ValidateListingPublish('unitsSummary', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty({ type: UnitsSummaryCreate, isArray: true })
  @Type(() => UnitsSummaryCreate)
  unitsSummary: UnitsSummaryCreate[];

  @Expose()
  @ValidateListingPublish('listingImages', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingImageCreate)
  @ValidateListingImages({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ type: ListingImageCreate, isArray: true })
  listingImages?: ListingImageCreate[];

  @Expose()
  @ValidateListingPublish('listingsApplicationPickUpAddress', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiPropertyOptional({ type: AddressCreate })
  listingsApplicationPickUpAddress?: AddressCreate;

  @Expose()
  @ValidateListingPublish('listingsApplicationMailingAddress', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiPropertyOptional({ type: AddressCreate })
  listingsApplicationMailingAddress?: AddressCreate;

  @Expose()
  @ValidateListingPublish('listingsApplicationDropOffAddress', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiPropertyOptional({ type: AddressCreate })
  listingsApplicationDropOffAddress?: AddressCreate;

  @Expose()
  @ValidateListingPublish('listingsLeasingAgentAddress', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiPropertyOptional({ type: AddressCreate })
  listingsLeasingAgentAddress?: AddressCreate;

  @Expose()
  @ValidateListingPublish('listingsBuildingAddress', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiPropertyOptional({ type: AddressCreate })
  listingsBuildingAddress?: AddressCreate;

  @Expose()
  @ValidateListingPublish('listingsBuildingSelectionCriteriaFile', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetCreate)
  @ApiPropertyOptional({ type: AssetCreate })
  listingsBuildingSelectionCriteriaFile?: AssetCreate;

  @Expose()
  @ValidateListingPublish('listingsMarketingFlyerFile', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetCreate)
  @ApiPropertyOptional({ type: AssetCreate })
  listingsMarketingFlyerFile?: AssetCreate;

  @Expose()
  @ValidateListingPublish('listingsAccessibleMarketingFlyerFile', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetCreate)
  @ApiPropertyOptional({ type: AssetCreate })
  listingsAccessibleMarketingFlyerFile?: AssetCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetCreate)
  @ApiPropertyOptional({ type: AssetCreate })
  listingsResult?: AssetCreate;

  @Expose()
  @ValidateListingPublish('listingEvents', {
    groups: [ValidationsGroupsEnum.default],
  })
  @Validate(LotteryDateParamValidator, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEventCreate)
  @ApiProperty({ type: ListingEventCreate, isArray: true })
  listingEvents: ListingEventCreate[];

  @Expose()
  @ValidateListingPublish('listingFeatures', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingFeatures)
  @ApiPropertyOptional({ type: ListingFeatures })
  listingFeatures?: ListingFeatures;

  @Expose()
  @ValidateListingPublish('listingUtilities', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingUtilities)
  @ApiPropertyOptional({ type: ListingUtilities })
  listingUtilities?: ListingUtilities;

  @Expose()
  @ApiPropertyOptional()
  @ValidateListingPublish('requestedChangesUser', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  requestedChangesUser?: IdDTO;
}
