import { AccessibilityCreate } from './accessibility-create.dto';
import { AddressCreate } from '../addresses/address-create.dto';
import { AlternateContactCreate } from './alternate-contact-create.dto';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { ApplicantCreate } from './applicant-create.dto';
import { ApplicationSelectionCreate } from './application-selection-create.dto';
import { ApplicationUpdate } from './application-update.dto';
import { ArrayMaxSize, ValidateNested } from 'class-validator';
import { DemographicCreate } from './demographic-create.dto';
import { Expose, Type } from 'class-transformer';
import { HouseholdMemberCreate } from './household-member-create.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ApplicationCreate extends OmitType(ApplicationUpdate, [
  'id',
  'applicationSelections',
  'accessibility',
  'alternateContact',
  'applicant',
  'applicationsMailingAddress',
  'applicationsAlternateAddress',
  'demographics',
  'householdMember',
]) {
  // TODO: Temporarily optional until after MSQ refactor
  @Expose()
  // @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationSelectionCreate)
  @ApiPropertyOptional({
    type: ApplicationSelectionCreate,
    isArray: true,
  })
  applicationSelections?: ApplicationSelectionCreate[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AccessibilityCreate)
  @ApiProperty({ type: AccessibilityCreate })
  accessibility: AccessibilityCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AlternateContactCreate)
  @ApiProperty({ type: AlternateContactCreate })
  alternateContact: AlternateContactCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicantCreate)
  @ApiProperty({ type: ApplicantCreate })
  applicant: ApplicantCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiProperty({ type: AddressCreate })
  applicationsMailingAddress: AddressCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiProperty({ type: AddressCreate })
  applicationsAlternateAddress: AddressCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => DemographicCreate)
  @ApiProperty({ type: DemographicCreate })
  demographics: DemographicCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMaxSize(32, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => HouseholdMemberCreate)
  @ApiProperty({ type: HouseholdMemberCreate, isArray: true })
  householdMember: HouseholdMemberCreate[];
}
