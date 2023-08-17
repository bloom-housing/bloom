import { ApiProperty } from '@nestjs/swagger';
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
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { Address } from '../addresses/address.dto';
import { AbstractDTO } from '../shared/abstract.dto';
import { UnitType } from '../unit-types/unit-type.dto';
import { Accessibility } from './accessibility.dto';
import { AlternateContact } from './alternate-contact.dto';
import { Applicant } from './applicant.dto';
import { ApplicationMultiselectQuestion } from './application-multiselect-question.dto';
import { Demographic } from './demographic.dto';
import { HouseholdMember } from './household-member.dto';

export class Application extends AbstractDTO {
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty()
  deletedAt?: Date;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  appUrl?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  additionalPhone?: boolean;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  additionalPhoneNumber?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
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
  @ApiProperty()
  housingStatus?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  sendMailToMailingAddress?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  householdExpectingChanges?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  householdStudent?: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  incomeVouchers?: boolean;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  income?: string;

  @Expose()
  @IsEnum(IncomePeriodEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: IncomePeriodEnum, enumName: 'IncomePeriodEnum' })
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
  @ApiProperty({ enum: LanguagesEnum, enumName: 'LanguagesEnum' })
  language?: LanguagesEnum;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
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
  @ApiProperty()
  submissionDate?: Date;

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
  @ApiProperty()
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
  @ApiProperty()
  reviewStatus?: ApplicationReviewStatusEnum;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty()
  applicationsMailingAddress: Address;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty()
  applicationsAlternateAddress: Address;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Accessibility)
  @ApiProperty()
  accessibility: Accessibility;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Demographic)
  @ApiProperty()
  demographics: Demographic;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty()
  @Type(() => UnitType)
  preferredUnitTypes: UnitType[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Applicant)
  @ApiProperty()
  applicant: Applicant;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AlternateContact)
  @ApiProperty()
  alternateContact: AlternateContact;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMaxSize(32, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => HouseholdMember)
  @ApiProperty()
  householdMember: HouseholdMember[];

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationMultiselectQuestion)
  @ApiProperty({
    type: ApplicationMultiselectQuestion,
    isArray: true,
    required: false,
  })
  preferences: ApplicationMultiselectQuestion[];

  @Expose()
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationMultiselectQuestion)
  @ApiProperty({
    type: ApplicationMultiselectQuestion,
    isArray: true,
    required: false,
  })
  programs?: ApplicationMultiselectQuestion[];
}
