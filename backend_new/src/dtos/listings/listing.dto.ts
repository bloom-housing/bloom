import { Expose, Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';
import {
  ApplicationAddressTypeEnum,
  ApplicationMethodsTypeEnum,
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
} from '@prisma/client';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { ListingMultiselectQuestion } from './listing-multiselect-question.dto';
import { ApplicationMethod } from '../application-methods/application-method.dto';
import { Asset } from '../assets/asset.dto';
import { ListingEvent } from './listing-event.dto';
import { Address } from '../addresses/address.dto';
import { ListingImage } from './listing-image.dto';
import { ListingFeatures } from './listing-feature.dto';
import { ListingUtilities } from './listing-utility.dto';
import { Unit } from '../units/unit.dto';
import { UnitsSummarized } from '../units/unit-summarized.dto';
import { UnitsSummary } from '../units/units-summary.dto';
import { IdDTO } from '../shared/id.dto';
import { listingUrlSlug } from '../../utilities/listing-url-slug';

class Listing extends AbstractDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  additionalApplicationSubmissionNotes?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  digitalApplication?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  commonDigitalApplication?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  paperApplication?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  referralOpportunity?: boolean;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  accessibility?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  amenities?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  buildingTotalUnits?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  developer?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  householdSizeMax?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  householdSizeMin?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  neighborhood?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  petPolicy?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  smokingPolicy?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  unitsAvailable?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  unitAmenities?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  servicesOffered?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  yearBuilt?: number;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty({ required: false })
  applicationDueDate?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty({ required: false })
  applicationOpenDate?: Date;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  applicationFee?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  applicationOrganization?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  applicationPickUpAddressOfficeHours?: string;

  @Expose()
  @IsEnum(ApplicationAddressTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: ApplicationAddressTypeEnum,
    enumName: 'ApplicationAddressTypeEnum',
    required: false,
  })
  applicationPickUpAddressType?: ApplicationAddressTypeEnum;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  applicationDropOffAddressOfficeHours?: string;

  @Expose()
  @IsEnum(ApplicationAddressTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: ApplicationAddressTypeEnum,
    enumName: 'ApplicationAddressTypeEnum',
    required: false,
  })
  applicationDropOffAddressType?: ApplicationAddressTypeEnum;

  @Expose()
  @IsEnum(ApplicationAddressTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: ApplicationAddressTypeEnum,
    enumName: 'ApplicationAddressTypeEnum',
    required: false,
  })
  applicationMailingAddressType?: ApplicationAddressTypeEnum;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  buildingSelectionCriteria?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  costsNotIncluded?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  creditHistory?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  criminalBackground?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  depositMin?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  depositMax?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  depositHelperText?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  disableUnitsAccordion?: boolean;

  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  @ApiProperty({ required: false })
  leasingAgentEmail?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  leasingAgentName?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  leasingAgentOfficeHours?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  leasingAgentPhone?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  leasingAgentTitle?: string;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  name: string;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty({ required: false })
  postmarkedApplicationsReceivedByDate?: Date;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  programRules?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  rentalAssistance?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  rentalHistory?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  requiredDocuments?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  specialNotes?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  waitlistCurrentSize?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  waitlistMaxSize?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  whatToExpect?: string;

  @Expose()
  @IsEnum(ListingsStatusEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ListingsStatusEnum,
    enumName: 'ListingsStatusEnum',
    required: true,
  })
  status: ListingsStatusEnum;

  @Expose()
  @IsEnum(ReviewOrderTypeEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ReviewOrderTypeEnum,
    enumName: 'ReviewOrderTypeEnum',
    required: false,
  })
  reviewOrderType?: ReviewOrderTypeEnum;

  @Expose()
  @ApiProperty({ required: false })
  applicationConfig?: Record<string, unknown>;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  displayWaitlistSize: boolean;

  @Expose()
  @ApiProperty({ required: false })
  get showWaitlist(): boolean {
    return (
      this.waitlistMaxSize !== null &&
      this.waitlistCurrentSize !== null &&
      this.waitlistCurrentSize < this.waitlistMaxSize
    );
  }

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  reservedCommunityDescription?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  reservedCommunityMinAge?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  resultLink?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  isWaitlistOpen?: boolean;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  waitlistOpenSpots?: number;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  customMapPin?: boolean;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty({ required: false })
  publishedAt?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty({ required: false })
  closedAt?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty({ required: false })
  afsLastRunAt?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty({ required: false })
  lastApplicationUpdateAt?: Date;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingMultiselectQuestion)
  @ApiProperty({
    type: ListingMultiselectQuestion,
    isArray: true,
    required: false,
  })
  listingMultiselectQuestions?: ListingMultiselectQuestion[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicationMethod)
  @ApiProperty({ type: ApplicationMethod, isArray: true, required: true })
  applicationMethods: ApplicationMethod[];

  @Expose()
  @ApiPropertyOptional()
  get referralApplication(): ApplicationMethod | undefined {
    return this.applicationMethods?.find(
      (method) => method.type === ApplicationMethodsTypeEnum.Referral,
    );
  }

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => Asset)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: Asset, isArray: true, required: true })
  assets: Asset[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEvent)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: Asset, isArray: true, required: true })
  listingEvents: ListingEvent[];

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address, required: true })
  listingsBuildingAddress: Address;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address, required: false })
  listingsApplicationPickUpAddress?: Address;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address, required: false })
  listingsApplicationDropOffAddress?: Address;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address, required: false })
  listingsApplicationMailingAddress?: Address;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address, required: false })
  listingsLeasingAgentAddress?: Address;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  @ApiProperty({ type: Asset, required: false })
  listingsBuildingSelectionCriteriaFile?: Asset;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiProperty({ type: IdDTO, required: true })
  jurisdictions: IdDTO;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  @ApiProperty({ type: Asset, required: false })
  listingsResult?: Asset;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiProperty({ type: IdDTO, required: false })
  reservedCommunityTypes?: IdDTO;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingImage)
  @ApiProperty({ type: ListingImage, isArray: true, required: false })
  listingImages?: ListingImage[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingFeatures)
  @ApiProperty({ type: ListingFeatures, required: false })
  listingFeatures?: ListingFeatures;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingUtilities)
  @ApiProperty({ type: ListingUtilities, required: false })
  listingUtilities?: ListingUtilities;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => Unit)
  @ApiProperty({ type: Unit, isArray: true, required: true })
  units: Unit[];

  @Expose()
  @ApiProperty({ type: UnitsSummarized, required: false })
  unitsSummarized?: UnitsSummarized;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty({ type: UnitsSummary, isArray: true, required: false })
  @Type(() => UnitsSummary)
  unitsSummary?: UnitsSummary[];

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  @Transform((value: TransformFnParams) => listingUrlSlug(value.obj as Listing))
  urlSlug: string;
}

export { Listing as default, Listing };
