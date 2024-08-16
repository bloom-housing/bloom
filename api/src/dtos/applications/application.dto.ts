import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ApplicationReviewStatusEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  IncomePeriodEnum,
  LanguagesEnum,
} from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { Address } from '../addresses/address.dto';
import { AbstractDTO } from '../shared/abstract.dto';
import { IdDTO } from '../shared/id.dto';
import { Accessibility } from './accessibility.dto';
import { AlternateContact } from './alternate-contact.dto';
import { Applicant } from './applicant.dto';
import { ApplicationMultiselectQuestion } from './application-multiselect-question.dto';
import { Demographic } from './demographic.dto';
import { HouseholdMember } from './household-member.dto';
import { UnitType } from '../unit-types/unit-type.dto';
import { ApplicationLotteryPosition } from './application-lottery-position.dto';

export class Application extends AbstractDTO {
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  deletedAt?: Date;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  appUrl?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  additionalPhone?: boolean;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  additionalPhoneNumber?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  additionalPhoneNumberType?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMaxSize(8, { groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty()
  contactPreferences: string[];

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  householdSize?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  housingStatus?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  sendMailToMailingAddress?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  householdExpectingChanges?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  householdStudent?: boolean;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @IsString({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiPropertyOptional()
  incomeVouchers?: string[];

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  income?: string;

  @Expose()
  @IsEnum(IncomePeriodEnum, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional({ enum: IncomePeriodEnum, enumName: 'IncomePeriodEnum' })
  incomePeriod?: IncomePeriodEnum;

  @Expose()
  @IsEnum(ApplicationStatusEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ApplicationStatusEnum,
    enumName: 'ApplicationStatusEnum',
  })
  status: ApplicationStatusEnum;

  @Expose()
  @IsEnum(LanguagesEnum, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional({ enum: LanguagesEnum, enumName: 'LanguagesEnum' })
  language?: LanguagesEnum;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  acceptedTerms?: boolean;

  @Expose()
  @IsEnum(ApplicationSubmissionTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: ApplicationSubmissionTypeEnum,
    enumName: 'ApplicationSubmissionTypeEnum',
  })
  submissionType: ApplicationSubmissionTypeEnum;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  submissionDate?: Date;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @MinLength(1, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  receivedBy?: string;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  receivedAt?: Date;

  // if this field is true then the application is a confirmed duplicate
  // meaning that the record in the applicaiton flagged set table has a status of duplicate
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  markedAsDuplicate: boolean;

  // This is a 'virtual field' needed for CSV export
  // if this field is true then the application is a possible duplicate
  // meaning there exists a record in the application_flagged_set table for this application
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  flagged?: boolean;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  confirmationCode: string;

  @Expose()
  @IsEnum(ApplicationReviewStatusEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: ApplicationReviewStatusEnum,
    enumName: 'ApplicationReviewStatusEnum',
  })
  @ApiPropertyOptional()
  reviewStatus?: ApplicationReviewStatusEnum;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address })
  applicationsMailingAddress: Address;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address })
  applicationsAlternateAddress: Address;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Accessibility)
  @ApiProperty({ type: Accessibility })
  accessibility: Accessibility;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Demographic)
  @ApiProperty({ type: Demographic })
  demographics: Demographic;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitType)
  @ApiProperty({ type: UnitType, isArray: true })
  preferredUnitTypes: UnitType[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Applicant)
  @ApiProperty({ type: Applicant })
  applicant: Applicant;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AlternateContact)
  @ApiProperty({ type: AlternateContact })
  alternateContact: AlternateContact;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMaxSize(32, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => HouseholdMember)
  @ApiProperty({ type: HouseholdMember, isArray: true })
  householdMember: HouseholdMember[];

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationMultiselectQuestion)
  @ApiPropertyOptional({
    type: ApplicationMultiselectQuestion,
    isArray: true,
  })
  preferences?: ApplicationMultiselectQuestion[];

  @Expose()
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationMultiselectQuestion)
  @ApiPropertyOptional({
    type: ApplicationMultiselectQuestion,
    isArray: true,
  })
  programs?: ApplicationMultiselectQuestion[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiProperty({ type: IdDTO })
  listings: IdDTO;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationLotteryPosition)
  @ApiProperty({ type: ApplicationLotteryPosition, isArray: true })
  applicationLotteryPositions: ApplicationLotteryPosition[];
}
