import { AddressUpdate } from '../addresses/address-update.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { ApplicationMethodUpdate } from '../application-methods/application-method-update.dto';
import { ArrayMaxSize, Validate, ValidateNested } from 'class-validator';
import { AssetCreate } from '../assets/asset-create.dto';
import { Expose, Type } from 'class-transformer';
import { IdDTO } from '../shared/id.dto';
import { Listing } from './listing.dto';
import { ListingEventUpdate } from './listing-event-update.dto';
import { ListingFeaturesUpdate } from './listing-feature-update.dto';
import { ListingImageCreate } from './listing-image-create.dto';
import { ListingNeighborhoodAmenitiesUpdate } from './listing-neighborhood-amenities-update.dto';
import { ListingUtilitiesUpdate } from './listing-utility-update.dto';
import { LotteryDateParamValidator } from '../../utilities/lottery-date-validator';
import { UnitGroupUpdate } from '../unit-groups/unit-group-update.dto';
import { UnitsSummaryCreate } from '../units/units-summary-create.dto';
import { UnitUpdate } from '../units/unit-update.dto';
import {
  ValidateAtLeastOneUnit,
  ValidateOnlyUnitsOrUnitGroups,
} from '../../decorators/validate-units-required.decorator';
import { ValidateListingImages } from '../../decorators/validate-listing-images.decorator';
import { ValidateListingPublish } from '../../decorators/validate-listing-publish.decorator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ListingUpdate extends OmitType(Listing, [
  // fields get their type changed
  'applicationMethods',
  'assets',
  'listingEvents',
  'listingFeatures',
  'listingImages',
  'listingMultiselectQuestions',
  'listingNeighborhoodAmenities',
  'listingsAccessibleMarketingFlyerFile',
  'listingsApplicationDropOffAddress',
  'listingsApplicationMailingAddress',
  'listingsApplicationPickUpAddress',
  'listingsBuildingAddress',
  'listingsBuildingSelectionCriteriaFile',
  'listingsLeasingAgentAddress',
  'listingsMarketingFlyerFile',
  'listingsResult',
  'listingUtilities',
  'requestedChangesUser',
  'unitGroups',
  'units',
  'unitsSummary',

  // fields removed entirely
  'afsLastRunAt',
  'applicationConfig',
  'applicationLotteryTotals',
  'closedAt',
  'createdAt',
  'publishedAt',
  'referralApplication',
  'showWaitlist',
  'unitGroupsSummarized',
  'unitsSummarized',
  'updatedAt',
  'urlSlug',
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
  @Type(() => UnitUpdate)
  @ArrayMaxSize(256, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ type: UnitUpdate, isArray: true })
  units?: UnitUpdate[];

  @Expose()
  @ValidateAtLeastOneUnit({
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateOnlyUnitsOrUnitGroups({
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitGroupUpdate)
  @ApiPropertyOptional({ type: UnitGroupUpdate, isArray: true })
  unitGroups?: UnitGroupUpdate[];

  @Expose()
  @ValidateListingPublish('applicationMethods', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationMethodUpdate)
  @ApiPropertyOptional({
    type: ApplicationMethodUpdate,
    isArray: true,
  })
  applicationMethods?: ApplicationMethodUpdate[];

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
  @Type(() => AddressUpdate)
  @ApiPropertyOptional({ type: AddressUpdate })
  listingsApplicationPickUpAddress?: AddressUpdate;

  @Expose()
  @ValidateListingPublish('listingsApplicationMailingAddress', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdate)
  @ApiPropertyOptional({ type: AddressUpdate })
  listingsApplicationMailingAddress?: AddressUpdate;

  @Expose()
  @ValidateListingPublish('listingsApplicationDropOffAddress', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdate)
  @ApiPropertyOptional({ type: AddressUpdate })
  listingsApplicationDropOffAddress?: AddressUpdate;

  @Expose()
  @ValidateListingPublish('listingsLeasingAgentAddress', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdate)
  @ApiPropertyOptional({ type: AddressUpdate })
  listingsLeasingAgentAddress?: AddressUpdate;

  @Expose()
  @ValidateListingPublish('listingsBuildingAddress', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdate)
  @ApiPropertyOptional({ type: AddressUpdate })
  listingsBuildingAddress?: AddressUpdate;

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
  @Type(() => ListingEventUpdate)
  @ApiProperty({ type: ListingEventUpdate, isArray: true })
  listingEvents: ListingEventUpdate[];

  @Expose()
  @ValidateListingPublish('listingFeatures', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingFeaturesUpdate)
  @ApiPropertyOptional({ type: ListingFeaturesUpdate })
  listingFeatures?: ListingFeaturesUpdate;

  @Expose()
  @ValidateListingPublish('listingUtilities', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingUtilitiesUpdate)
  @ApiPropertyOptional({ type: ListingUtilitiesUpdate })
  listingUtilities?: ListingUtilitiesUpdate;

  @Expose()
  @ApiPropertyOptional()
  @ValidateListingPublish('requestedChangesUser', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  requestedChangesUser?: IdDTO;

  @Expose()
  @ValidateListingPublish('listingNeighborhoodAmenities', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingNeighborhoodAmenitiesUpdate)
  @ApiPropertyOptional({ type: ListingNeighborhoodAmenitiesUpdate })
  listingNeighborhoodAmenities?: ListingNeighborhoodAmenitiesUpdate;
}
