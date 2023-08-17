import { OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
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
import { ListingFeaturesCreate } from './listing-feature-create.dto';
import { ListingUtilitiesCreate } from './listing-utility-create.dto';

export class ListingUpdate extends OmitType(Listing, [
  // fields get their type changed
  'listingMultiselectQuestions',
  'units',
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
  'listingEvents',
  'listingFeatures',
  'listingUtilities',

  // fields removed entirely
  'createdAt',
  'updatedAt',
  'referralApplication',
  'publishedAt',
  'showWaitlist',
  'unitsSummarized',
  'closedAt',
  'afsLastRunAt',
  'urlSlug',
  'applicationConfig',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDTO)
  @ApiProperty({ type: IdDTO, isArray: true, required: false })
  listingMultiselectQuestions?: IdDTO[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitCreate)
  @ApiProperty({ type: UnitCreate, isArray: true, required: false })
  units?: UnitCreate[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationMethodCreate)
  @ApiProperty({
    type: ApplicationMethodCreate,
    isArray: true,
    required: false,
  })
  applicationMethods?: ApplicationMethodCreate[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AssetCreate)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: AssetCreate, isArray: true, required: true })
  assets: AssetCreate[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty({ type: UnitsSummaryCreate, isArray: true, required: true })
  @Type(() => UnitsSummaryCreate)
  unitsSummary: UnitsSummaryCreate[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingImageCreate)
  @ApiProperty({ type: ListingImageCreate, isArray: true, required: false })
  listingImages?: ListingImageCreate[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiProperty({ type: AddressCreate, required: false })
  listingsApplicationPickUpAddress?: AddressCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiProperty({ type: AddressCreate, required: false })
  listingsApplicationMailingAddress?: AddressCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiProperty({ type: AddressCreate, required: false })
  listingsApplicationDropOffAddress?: AddressCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiProperty({ type: AddressCreate, required: false })
  listingsLeasingAgentAddress?: AddressCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiProperty({ type: AddressCreate, required: false })
  listingsBuildingAddress?: AddressCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetCreate)
  @ApiProperty({ type: AssetCreate, required: false })
  listingsBuildingSelectionCriteriaFile?: AssetCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetCreate)
  @ApiProperty({ type: AssetCreate, required: false })
  listingsResult?: AssetCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEventCreate)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: ListingEventCreate, isArray: true })
  listingEvents: ListingEventCreate[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingFeaturesCreate)
  @ApiProperty({ type: ListingFeaturesCreate, required: false })
  listingFeatures?: ListingFeaturesCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingUtilitiesCreate)
  @ApiProperty({ type: ListingUtilitiesCreate, required: false })
  listingUtilities?: ListingUtilitiesCreate;
}
