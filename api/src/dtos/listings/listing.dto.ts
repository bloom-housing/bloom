import { Expose, Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';
import {
  ApplicationAddressTypeEnum,
  ApplicationMethodsTypeEnum,
  HomeTypeEnum,
  ListingsStatusEnum,
  LotteryStatusEnum,
  RegionEnum,
  MarketingSeasonEnum,
  MarketingTypeEnum,
  ReviewOrderTypeEnum,
} from '@prisma/client';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { SanitizeHtml } from '../../decorators/sanitize-html.decorator';
import { ListingMultiselectQuestion } from './listing-multiselect-question.dto';
import { ApplicationMethod } from '../application-methods/application-method.dto';
import { Asset } from '../assets/asset.dto';
import { ListingEvent } from './listing-event.dto';
import { Address } from '../addresses/address.dto';
import { ListingImage } from './listing-image.dto';
import { ListingFeatures } from './listing-feature.dto';
import { ListingUtilities } from './listing-utility.dto';
import { Unit } from '../units/unit.dto';
import { UnitGroup } from '../unit-groups/unit-group.dto';
import { UnitsSummarized } from '../units/unit-summarized.dto';
import { UnitsSummary } from '../units/units-summary.dto';
import { IdDTO } from '../shared/id.dto';
import { listingUrlSlug } from '../../utilities/listing-url-slug';
import { User } from '../users/user.dto';
import { requestedChangesUserMapper } from '../../utilities/requested-changes-user';
import { LotteryDateParamValidator } from '../../utilities/lottery-date-validator';
import { ApplicationLotteryTotal } from '../applications/application-lottery-total.dto';
import { ListingNeighborhoodAmenities } from './listing-neighborhood-amenities.dto';
import { ValidateListingPublish } from '../../decorators/validate-listing-publish.decorator';
import { UnitGroupsSummarized } from '../unit-groups/unit-groups-summarized.dto';
import {
  ValidateAtLeastOneUnit,
  ValidateOnlyUnitsOrUnitGroups,
} from '../../decorators/validate-units-required.decorator';

class Listing extends AbstractDTO {
  @Expose()
  @ValidateListingPublish('additionalApplicationSubmissionNotes', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  additionalApplicationSubmissionNotes?: string;

  @Expose()
  @ValidateListingPublish('digitalApplication', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  digitalApplication?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  commonDigitalApplication?: boolean;

  @Expose()
  @ValidateListingPublish('paperApplication', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  paperApplication?: boolean;

  @Expose()
  @ValidateListingPublish('referralOpportunity', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  referralOpportunity?: boolean;

  @Expose()
  @ValidateListingPublish('accessibility', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  accessibility?: string;

  @Expose()
  @ValidateListingPublish('amenities', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  amenities?: string;

  @Expose()
  @ValidateListingPublish('buildingTotalUnits', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  buildingTotalUnits?: number;

  @Expose()
  @ValidateListingPublish('developer', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  developer?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  householdSizeMax?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  householdSizeMin?: number;

  @Expose()
  @ValidateListingPublish('neighborhood', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  neighborhood?: string;

  @Expose()
  @ValidateListingPublish('region', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    enum: RegionEnum,
    enumName: 'RegionEnum',
  })
  region?: RegionEnum;

  @Expose()
  @ValidateListingPublish('petPolicy', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  petPolicy?: string;

  @Expose()
  @ValidateListingPublish('smokingPolicy', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  smokingPolicy?: string;

  @Expose()
  @ValidateListingPublish('unitsAvailable', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  unitsAvailable?: number;

  @Expose()
  @ValidateListingPublish('unitAmenities', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  unitAmenities?: string;

  @Expose()
  @ValidateListingPublish('servicesOffered', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  servicesOffered?: string;

  @Expose()
  @ValidateListingPublish('yearBuilt', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  yearBuilt?: number;

  @Expose()
  @ValidateListingPublish('applicationDueDate', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateIf(
    (o) =>
      !(
        o.applicationDueDate == undefined &&
        o.reviewOrderType == ReviewOrderTypeEnum.waitlist
      ),
    {
      groups: [ValidationsGroupsEnum.default],
    },
  )
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  applicationDueDate?: Date;

  @Expose()
  @ValidateListingPublish('applicationOpenDate', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  applicationOpenDate?: Date;

  @Expose()
  @ValidateListingPublish('applicationFee', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  applicationFee?: string;

  @Expose()
  @ValidateListingPublish('applicationOrganization', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  applicationOrganization?: string;

  @Expose()
  @ValidateListingPublish('applicationPickUpAddressOfficeHours', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  applicationPickUpAddressOfficeHours?: string;

  @Expose()
  @ValidateListingPublish('applicationPickUpAddressType', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsEnum(ApplicationAddressTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional({
    enum: ApplicationAddressTypeEnum,
    enumName: 'ApplicationAddressTypeEnum',
  })
  applicationPickUpAddressType?: ApplicationAddressTypeEnum;

  @Expose()
  @ValidateListingPublish('applicationDropOffAddressOfficeHours', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  applicationDropOffAddressOfficeHours?: string;

  @Expose()
  @ValidateListingPublish('applicationDropOffAddressType', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsEnum(ApplicationAddressTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional({
    enum: ApplicationAddressTypeEnum,
    enumName: 'ApplicationAddressTypeEnum',
  })
  applicationDropOffAddressType?: ApplicationAddressTypeEnum;

  @Expose()
  @ValidateListingPublish('applicationMailingAddressType', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsEnum(ApplicationAddressTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional({
    enum: ApplicationAddressTypeEnum,
    enumName: 'ApplicationAddressTypeEnum',
  })
  applicationMailingAddressType?: ApplicationAddressTypeEnum;

  @Expose()
  @ValidateListingPublish('buildingSelectionCriteria', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  @IsUrl(
    { require_protocol: true },
    { groups: [ValidationsGroupsEnum.default] },
  )
  buildingSelectionCriteria?: string;

  @Expose()
  @ValidateListingPublish('costsNotIncluded', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  costsNotIncluded?: string;

  @Expose()
  @ValidateListingPublish('creditHistory', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  creditHistory?: string;

  @Expose()
  @ValidateListingPublish('criminalBackground', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  criminalBackground?: string;

  @Expose()
  @ValidateListingPublish('depositMin', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  depositMin?: string;

  @Expose()
  @ValidateListingPublish('depositMax', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  depositMax?: string;

  @Expose()
  @ValidateListingPublish('depositHelperText', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  depositHelperText?: string;

  @Expose()
  @ValidateListingPublish('disableUnitsAccordion', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  disableUnitsAccordion?: boolean;

  @Expose()
  @ValidateListingPublish('leasingAgentEmail', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  @ApiPropertyOptional()
  leasingAgentEmail?: string;

  @Expose()
  @ValidateListingPublish('leasingAgentName', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  leasingAgentName?: string;

  @Expose()
  @ValidateListingPublish('leasingAgentOfficeHours', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  leasingAgentOfficeHours?: string;

  @Expose()
  @ValidateListingPublish('leasingAgentPhone', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsPhoneNumber('US', { groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  leasingAgentPhone?: string;

  @Expose()
  @ValidateListingPublish('leasingAgentTitle', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  leasingAgentTitle?: string;

  @Expose()
  @ValidateListingPublish('managementWebsite', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  @IsUrl(
    { require_protocol: true, protocols: ['http', 'https'] },
    { groups: [ValidationsGroupsEnum.default] },
  )
  managementWebsite?: string;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  name: string;

  @Expose()
  @ValidateListingPublish('postmarkedApplicationsReceivedByDate', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  postmarkedApplicationsReceivedByDate?: Date;

  @Expose()
  @ValidateListingPublish('programRules', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  programRules?: string;

  @Expose()
  @ValidateListingPublish('rentalAssistance', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  rentalAssistance?: string;

  @Expose()
  @ValidateListingPublish('rentalHistory', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  rentalHistory?: string;

  @Expose()
  @ValidateListingPublish('requiredDocuments', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  requiredDocuments?: string;

  @Expose()
  @ValidateListingPublish('specialNotes', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  specialNotes?: string;

  @Expose()
  @ValidateListingPublish('waitlistCurrentSize', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  waitlistCurrentSize?: number;

  @Expose()
  @ValidateListingPublish('waitlistMaxSize', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  waitlistMaxSize?: number;

  @Expose()
  @ValidateListingPublish('whatToExpect', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  @SanitizeHtml()
  whatToExpect?: string;

  @Expose()
  @ValidateListingPublish('status', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsEnum(ListingsStatusEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ListingsStatusEnum,
    enumName: 'ListingsStatusEnum',
  })
  status: ListingsStatusEnum;

  @Expose()
  @ValidateListingPublish('reviewOrderType', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsEnum(ReviewOrderTypeEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    enum: ReviewOrderTypeEnum,
    enumName: 'ReviewOrderTypeEnum',
  })
  reviewOrderType?: ReviewOrderTypeEnum;

  @Expose()
  @ValidateListingPublish('applicationConfig', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional()
  applicationConfig?: Record<string, unknown>;

  @Expose()
  @ValidateListingPublish('displayWaitlistSize', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  displayWaitlistSize: boolean;

  @Expose()
  @ApiPropertyOptional()
  get showWaitlist(): boolean {
    return (
      this.waitlistMaxSize !== null &&
      this.waitlistCurrentSize !== null &&
      this.waitlistCurrentSize < this.waitlistMaxSize
    );
  }

  @Expose()
  @ValidateListingPublish('reservedCommunityDescription', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  reservedCommunityDescription?: string;

  @Expose()
  @ValidateListingPublish('reservedCommunityMinAge', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  reservedCommunityMinAge?: number;

  @Expose()
  @ValidateListingPublish('resultLink', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  resultLink?: string;

  @Expose()
  @ValidateListingPublish('isWaitlistOpen', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  isWaitlistOpen?: boolean;

  @Expose()
  @ValidateListingPublish('waitlistOpenSpots', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  waitlistOpenSpots?: number;

  @Expose()
  @ValidateListingPublish('customMapPin', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  customMapPin?: boolean;

  //Used to refresh translations and communicate recent changes to admin users
  //should be revisited after translations refactoring to see if its still useful
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  contentUpdatedAt?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  publishedAt?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  closedAt?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  afsLastRunAt?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  lotteryLastPublishedAt?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  lotteryLastRunAt?: Date;

  @Expose()
  @IsEnum(LotteryStatusEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    enum: LotteryStatusEnum,
    enumName: 'LotteryStatusEnum',
  })
  lotteryStatus?: LotteryStatusEnum;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  lastApplicationUpdateAt?: Date;

  @Expose()
  @ValidateListingPublish('listingMultiselectQuestions', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingMultiselectQuestion)
  @ApiPropertyOptional({
    type: ListingMultiselectQuestion,
    isArray: true,
  })
  listingMultiselectQuestions?: ListingMultiselectQuestion[];

  @Expose()
  @ValidateListingPublish('applicationMethods', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationMethod)
  @ApiProperty({ type: ApplicationMethod, isArray: true })
  applicationMethods: ApplicationMethod[];

  @Expose()
  @ApiPropertyOptional()
  get referralApplication(): ApplicationMethod | undefined {
    return this.applicationMethods?.find(
      (method) => method.type === ApplicationMethodsTypeEnum.Referral,
    );
  }

  // This is no longer needed and should be removed https://github.com/bloom-housing/bloom/issues/3747
  @Expose()
  @ValidateListingPublish('assets', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => Asset)
  @ApiProperty({ type: Asset, isArray: true })
  assets: Asset[] = [];

  @Expose()
  @ValidateListingPublish('listingEvents', {
    groups: [ValidationsGroupsEnum.default],
  })
  @Validate(LotteryDateParamValidator, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEvent)
  @ApiProperty({ type: ListingEvent, isArray: true })
  listingEvents: ListingEvent[];

  @Expose()
  @ValidateListingPublish('listingsBuildingAddress', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address })
  listingsBuildingAddress: Address;

  @Expose()
  @ValidateListingPublish('listingsApplicationPickUpAddress', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiPropertyOptional({ type: Address })
  listingsApplicationPickUpAddress?: Address;

  @Expose()
  @ValidateListingPublish('listingsApplicationDropOffAddress', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiPropertyOptional({ type: Address })
  listingsApplicationDropOffAddress?: Address;

  @Expose()
  @ValidateListingPublish('listingsApplicationMailingAddress', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiPropertyOptional({ type: Address })
  listingsApplicationMailingAddress?: Address;

  @Expose()
  @ValidateListingPublish('listingsLeasingAgentAddress', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiPropertyOptional({ type: Address })
  listingsLeasingAgentAddress?: Address;

  @Expose()
  @ValidateListingPublish('listingsBuildingSelectionCriteriaFile', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  @ApiPropertyOptional({ type: Asset })
  listingsBuildingSelectionCriteriaFile?: Asset;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiProperty({ type: IdDTO })
  jurisdictions: IdDTO;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  @ApiPropertyOptional({ type: Asset })
  listingsResult?: Asset;

  @Expose()
  @ValidateListingPublish('reservedCommunityTypes', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiPropertyOptional({ type: IdDTO })
  reservedCommunityTypes?: IdDTO;

  @Expose()
  @ValidateListingPublish('listingImages', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingImage)
  @ArrayMinSize(1, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ type: ListingImage, isArray: true })
  listingImages?: ListingImage[];

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
  @ValidateAtLeastOneUnit({
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateOnlyUnitsOrUnitGroups({
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => Unit)
  @ArrayMaxSize(256, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: Unit, isArray: true })
  units: Unit[];

  @Expose()
  @ValidateAtLeastOneUnit({
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateOnlyUnitsOrUnitGroups({
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitGroup)
  @ApiPropertyOptional({ type: UnitGroup, isArray: true })
  unitGroups?: UnitGroup[];

  @Expose()
  @ValidateListingPublish('unitsSummarized', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional({ type: UnitsSummarized })
  unitsSummarized?: UnitsSummarized;

  @Expose()
  @ValidateListingPublish('unitGroupsSummarized', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional({ type: UnitGroupsSummarized })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitGroupsSummarized)
  unitGroupsSummarized?: UnitGroupsSummarized;

  @Expose()
  @ValidateListingPublish('unitsSummary', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiPropertyOptional({ type: UnitsSummary, isArray: true })
  @Type(() => UnitsSummary)
  unitsSummary?: UnitsSummary[];

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  @Transform((value: TransformFnParams) => listingUrlSlug(value.obj as Listing))
  urlSlug?: string;

  @Expose()
  @ApiPropertyOptional()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  requestedChanges?: string;

  @Expose()
  @ApiPropertyOptional()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  requestedChangesDate?: Date;

  @Expose()
  @ApiPropertyOptional()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (obj: any) => {
      return obj.obj.requestedChangesUser
        ? requestedChangesUserMapper(obj.obj.requestedChangesUser as User)
        : undefined;
    },
    {
      toClassOnly: true,
    },
  )
  requestedChangesUser?: IdDTO;

  @Expose()
  @ValidateListingPublish('lotteryOptIn', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  isExternal?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  lotteryOptIn?: boolean;

  @Expose()
  @ValidateListingPublish('applicationLotteryTotals', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationLotteryTotal)
  @ApiProperty({ type: ApplicationLotteryTotal, isArray: true })
  applicationLotteryTotals: ApplicationLotteryTotal[];

  @Expose()
  @ValidateListingPublish('includeCommunityDisclaimer', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  includeCommunityDisclaimer?: boolean;

  @Expose()
  @ApiPropertyOptional()
  @ValidateIf((o) => o.includeCommunityDisclaimer, {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  communityDisclaimerTitle?: string;

  @Expose()
  @ApiPropertyOptional()
  @ValidateIf((o) => o.includeCommunityDisclaimer, {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  communityDisclaimerDescription?: string;

  @Expose()
  @ValidateListingPublish('marketingType', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsEnum(MarketingTypeEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    enum: MarketingTypeEnum,
    enumName: 'MarketingTypeEnum',
  })
  marketingType?: MarketingTypeEnum;

  @Expose()
  @ValidateIf((o) => o.marketingType === MarketingTypeEnum.comingSoon, {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  marketingYear?: number;

  @Expose()
  @ValidateListingPublish('marketingSeason', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsEnum(MarketingSeasonEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    enum: MarketingSeasonEnum,
    enumName: 'MarketingSeasonEnum',
  })
  marketingSeason?: MarketingSeasonEnum | null;

  @Expose()
  @ValidateListingPublish('homeType', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsEnum(HomeTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional({
    enum: HomeTypeEnum,
    enumName: 'HomeTypeEnum',
  })
  homeType?: HomeTypeEnum;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  isVerified?: boolean;

  @Expose()
  @ValidateListingPublish('section8Acceptance', {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  section8Acceptance?: boolean;

  @Expose()
  @ValidateListingPublish('listingNeighborhoodAmenities', {
    groups: [ValidationsGroupsEnum.default],
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingNeighborhoodAmenities)
  @ApiPropertyOptional({ type: ListingNeighborhoodAmenities })
  listingNeighborhoodAmenities?: ListingNeighborhoodAmenities;

  @Expose()
  requiredFields?: string[];
}

export { Listing as default, Listing };
