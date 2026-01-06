import { Expose, Type } from 'class-transformer';
import { ArrayMaxSize, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { AccessibilityUpdate } from './accessibility-update.dto';
import { AlternateContactUpdate } from './alternate-contact-update.dto';
import { ApplicantUpdate } from './applicant-update.dto';
import { Application } from './application.dto';
import { ApplicationSelectionUpdate } from './application-selection-update.dto';
import { DemographicUpdate } from './demographic-update.dto';
import { HouseholdMemberUpdate } from './household-member-update.dto';
import { AddressCreate } from '../addresses/address-create.dto';
import { IdDTO } from '../shared/id.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ApplicationUpdate extends OmitType(Application, [
  'createdAt',
  'updatedAt',
  'deletedAt',
  'accessibility',
  'alternateContact',
  'applicant',
  'applicationLotteryPositions',
  'applicationSelections',
  'applicationsAlternateAddress',
  'applicationsMailingAddress',
  'confirmationCode',
  'demographics',
  'flagged',
  'householdMember',
  'markedAsDuplicate',
  'preferredUnitTypes',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AccessibilityUpdate)
  @ApiProperty({ type: AccessibilityUpdate })
  accessibility: AccessibilityUpdate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AlternateContactUpdate)
  @ApiProperty({ type: AlternateContactUpdate })
  alternateContact: AlternateContactUpdate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicantUpdate)
  @ApiProperty({ type: ApplicantUpdate })
  applicant: ApplicantUpdate;

  // TODO: Temporarily optional until after MSQ refactor
  @Expose()
  // @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationSelectionUpdate)
  @ApiPropertyOptional({
    type: ApplicationSelectionUpdate,
    isArray: true,
  })
  applicationSelections?: ApplicationSelectionUpdate[];

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
  @Type(() => DemographicUpdate)
  @ApiProperty({ type: DemographicUpdate })
  demographics: DemographicUpdate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMaxSize(32, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => HouseholdMemberUpdate)
  @ApiProperty({ type: HouseholdMemberUpdate, isArray: true })
  householdMember: HouseholdMemberUpdate[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDTO)
  @ApiProperty({ type: IdDTO, isArray: true })
  preferredUnitTypes: IdDTO[];
}
