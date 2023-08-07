import { Expose, Type } from 'class-transformer';
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
import { ApplicationMethod } from '../application-methods/application-method-get.dto';
import { Asset } from '../assets/asset-get.dto';
import { ListingEvent } from './listing-event.dto';
import { Address } from '../addresses/address-get.dto';
import { Jurisdiction } from '../jurisdictions/jurisdiction.dto';
import { ReservedCommunityType } from '../reserved-community-types/reserved-community-type.dto';
import { ListingImage } from './listing-image.dto';
import { ListingFeatures } from './listing-feature.dto';
import { ListingUtilities } from './listing-utility.dto';
import { Unit } from '../units/unit-get.dto';
import { UnitsSummarized } from '../units/unit-summarized.dto';
import { UnitsSummary } from '../units/units-summery-get.dto';

class ListingGet extends AbstractDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  additionalApplicationSubmissionNotes?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  digitalApplication?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  commonDigitalApplication?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  paperApplication?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  referralOpportunity?: boolean;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  accessibility?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  amenities?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  buildingTotalUnits?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  developer?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  householdSizeMax?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  householdSizeMin?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  neighborhood?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  petPolicy?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  smokingPolicy?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  unitsAvailable?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  unitAmenities?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  servicesOffered?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  yearBuilt?: number;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty()
  applicationDueDate?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty()
  applicationOpenDate?: Date;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  applicationFee?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  applicationOrganization?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  applicationPickUpAddressOfficeHours?: string;

  @Expose()
  @IsEnum(ApplicationAddressTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: ApplicationAddressTypeEnum,
    enumName: 'ApplicationAddressTypeEnum',
  })
  applicationPickUpAddressType?: ApplicationAddressTypeEnum;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  applicationDropOffAddressOfficeHours?: string;

  @Expose()
  @IsEnum(ApplicationAddressTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: ApplicationAddressTypeEnum,
    enumName: 'ApplicationAddressTypeEnum',
  })
  applicationDropOffAddressType?: ApplicationAddressTypeEnum;

  @Expose()
  @IsEnum(ApplicationAddressTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: ApplicationAddressTypeEnum,
    enumName: 'ApplicationAddressTypeEnum',
  })
  applicationMailingAddressType?: ApplicationAddressTypeEnum;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  buildingSelectionCriteria?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  costsNotIncluded?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  creditHistory?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  criminalBackground?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  depositMin?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  depositMax?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  depositHelperText?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  disableUnitsAccordion?: boolean;

  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  @ApiProperty()
  leasingAgentEmail?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  leasingAgentName?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  leasingAgentOfficeHours?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  leasingAgentPhone?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  leasingAgentTitle?: string;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  name: string;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty()
  postmarkedApplicationsReceivedByDate?: Date;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  programRules?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  rentalAssistance?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  rentalHistory?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  requiredDocuments?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  specialNotes?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  waitlistCurrentSize?: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  waitlistMaxSize?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  whatToExpect?: string;

  @Expose()
  @IsEnum(ListingsStatusEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: ListingsStatusEnum, enumName: 'ListingsStatusEnum' })
  status: ListingsStatusEnum;

  @Expose()
  @IsEnum(ReviewOrderTypeEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ReviewOrderTypeEnum,
    enumName: 'ReviewOrderTypeEnum',
  })
  reviewOrderType?: ReviewOrderTypeEnum;

  @Expose()
  @ApiProperty()
  applicationConfig?: Record<string, unknown>;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  displayWaitlistSize: boolean;

  @Expose()
  @ApiProperty()
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
  @ApiProperty()
  reservedCommunityDescription?: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  reservedCommunityMinAge?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  resultLink?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  isWaitlistOpen?: boolean;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  waitlistOpenSpots?: number;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  customMapPin?: boolean;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty()
  publishedAt?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty()
  closedAt?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty()
  afsLastRunAt?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty()
  lastApplicationUpdateAt?: Date;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingMultiselectQuestion)
  @ApiProperty({ type: ListingMultiselectQuestion, isArray: true })
  listingMultiselectQuestions?: ListingMultiselectQuestion[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
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

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => Asset)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: Asset, isArray: true })
  assets: Asset[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEvent)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: Asset, isArray: true })
  events: ListingEvent[];

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address })
  listingsBuildingAddress: Address;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address })
  listingsApplicationPickUpAddress?: Address;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address })
  listingsApplicationDropOffAddress?: Address;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address })
  listingsApplicationMailingAddress?: Address;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address })
  listingsLeasingAgentAddress?: Address;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  @ApiProperty({ type: Asset })
  listingsBuildingSelectionCriteriaFile?: Asset;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Jurisdiction)
  @ApiProperty({ type: Jurisdiction })
  jurisdictions: Jurisdiction;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  @ApiProperty({ type: Asset })
  listingsResult?: Asset;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ReservedCommunityType)
  @ApiProperty({ type: ReservedCommunityType })
  reservedCommunityTypes?: ReservedCommunityType;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingImage)
  @ApiProperty({ type: ListingImage, isArray: true })
  listingImages?: ListingImage[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingFeatures)
  @ApiProperty({ type: ListingFeatures })
  listingFeatures?: ListingFeatures;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingUtilities)
  @ApiProperty({ type: ListingUtilities })
  listingUtilities?: ListingUtilities;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => Unit)
  @ApiProperty({ type: Unit, isArray: true })
  units: Unit[];

  @Expose()
  @ApiProperty({ type: UnitsSummarized })
  unitsSummarized: UnitsSummarized | undefined;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty({ type: UnitsSummary, isArray: true })
  @Type(() => UnitsSummary)
  unitsSummary: UnitsSummary[];
}

export { ListingGet as default, ListingGet };
