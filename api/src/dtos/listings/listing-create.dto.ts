import { AddressCreate } from '../addresses/address-create.dto';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { ApplicationMethodCreate } from '../application-methods/application-method-create.dto';
import { ArrayMaxSize, Validate, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ListingEventCreate } from './listing-event-create.dto';
import { ListingFeaturesCreate } from './listing-feature-create.dto';
import { ListingNeighborhoodAmenitiesCreate } from './listing-neighborhood-amenities-create.dto';
import { ListingUpdate } from './listing-update.dto';
import { ListingUtilitiesCreate } from './listing-utiliity-create.dto';
import { LotteryDateParamValidator } from '../../utilities/lottery-date-validator';
import { UnitCreate } from '../units/unit-create.dto';
import { UnitGroupCreate } from '../unit-groups/unit-group-create.dto';
import {
  ValidateAtLeastOneUnit,
  ValidateOnlyUnitsOrUnitGroups,
} from '../../decorators/validate-units-required.decorator';
import { ValidateListingPublish } from '../../decorators/validate-listing-publish.decorator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ListingCreate extends OmitType(ListingUpdate, [
  'applicationMethods',
  'id',
  'listingEvents',
  'listingNeighborhoodAmenities',
  'listingsApplicationDropOffAddress',
  'listingsApplicationMailingAddress',
  'listingsApplicationPickUpAddress',
  'listingsBuildingAddress',
  'listingsLeasingAgentAddress',
  'listingUtilities',
  'unitGroups',
  'units',
]) {
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
  @Type(() => ListingFeaturesCreate)
  @ApiPropertyOptional({ type: ListingFeaturesCreate })
  listingFeatures?: ListingFeaturesCreate;

  @Expose()
  @ValidateListingPublish('listingUtilities', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingUtilitiesCreate)
  @ApiPropertyOptional({ type: ListingUtilitiesCreate })
  listingUtilities?: ListingUtilitiesCreate;

  @Expose()
  @ValidateListingPublish('listingNeighborhoodAmenities', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingNeighborhoodAmenitiesCreate)
  @ApiPropertyOptional({ type: ListingNeighborhoodAmenitiesCreate })
  listingNeighborhoodAmenities?: ListingNeighborhoodAmenitiesCreate;
}
