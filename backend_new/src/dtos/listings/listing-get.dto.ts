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
import { Jurisdiction } from '../jurisdictions/jurisdiction-get.dto';
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
  additionalApplicationSubmissionNotes?: string | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  digitalApplication?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  commonDigitalApplication?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  paperApplication?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  referralOpportunity?: boolean;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  accessibility?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  amenities?: string | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  buildingTotalUnits?: number | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  developer?: string | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  householdSizeMax?: number | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  householdSizeMin?: number | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  neighborhood?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  petPolicy?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  smokingPolicy?: string | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  unitsAvailable?: number | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  unitAmenities?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  servicesOffered?: string | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  yearBuilt?: number | null;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  applicationDueDate?: Date | null;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  applicationOpenDate?: Date | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicationFee?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicationOrganization?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicationPickUpAddressOfficeHours?: string | null;

  @Expose()
  @IsEnum(ApplicationAddressTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: ApplicationAddressTypeEnum,
    enumName: 'ApplicationAddressTypeEnum',
  })
  applicationPickUpAddressType?: ApplicationAddressTypeEnum | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  applicationDropOffAddressOfficeHours?: string | null;

  @Expose()
  @IsEnum(ApplicationAddressTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: ApplicationAddressTypeEnum,
    enumName: 'ApplicationAddressTypeEnum',
  })
  applicationDropOffAddressType?: ApplicationAddressTypeEnum | null;

  @Expose()
  @IsEnum(ApplicationAddressTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: ApplicationAddressTypeEnum,
    enumName: 'ApplicationAddressTypeEnum',
  })
  applicationMailingAddressType?: ApplicationAddressTypeEnum | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  buildingSelectionCriteria?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  costsNotIncluded?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  creditHistory?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  criminalBackground?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  depositMin?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  depositMax?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  depositHelperText?: string | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  disableUnitsAccordion?: boolean | null;

  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  leasingAgentEmail?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  leasingAgentName?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  leasingAgentOfficeHours?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  leasingAgentPhone?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  leasingAgentTitle?: string | null;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  name: string;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  postmarkedApplicationsReceivedByDate?: Date | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  programRules?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  rentalAssistance?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  rentalHistory?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  requiredDocuments?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  specialNotes?: string | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  waitlistCurrentSize?: number | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  waitlistMaxSize?: number | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  whatToExpect?: string | null;

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
  reviewOrderType?: ReviewOrderTypeEnum | null;

  @Expose()
  applicationConfig?: Record<string, unknown>;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
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
  reservedCommunityDescription?: string | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  reservedCommunityMinAge?: number | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  resultLink?: string | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  isWaitlistOpen?: boolean | null;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  waitlistOpenSpots?: number | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  customMapPin?: boolean | null;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  publishedAt?: Date | null;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  closedAt?: Date | null;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  afsLastRunAt?: Date | null;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  lastApplicationUpdateAt?: Date | null;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingMultiselectQuestion)
  listingMultiselectQuestions?: ListingMultiselectQuestion[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicationMethod)
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
  assets: Asset[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEvent)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  events: ListingEvent[];

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  listingsBuildingAddress: Address;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  listingsApplicationPickUpAddress?: Address;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  listingsApplicationDropOffAddress?: Address;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  listingsApplicationMailingAddress?: Address;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  listingsLeasingAgentAddress?: Address;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  listingsBuildingSelectionCriteriaFile?: Asset | null;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Jurisdiction)
  jurisdictions: Jurisdiction;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  listingsResult?: Asset | null;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ReservedCommunityType)
  reservedCommunityTypes?: ReservedCommunityType;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingImage)
  listingImages?: ListingImage[] | null;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingFeatures)
  listingFeatures?: ListingFeatures;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingUtilities)
  listingUtilities?: ListingUtilities;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => Unit)
  units: Unit[];

  @Expose()
  @ApiProperty({ type: UnitsSummarized })
  unitsSummarized: UnitsSummarized | undefined;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitsSummary)
  unitsSummary: UnitsSummary[];
}

export { ListingGet as default, ListingGet };
