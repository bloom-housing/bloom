import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ArrayMaxSize, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AddressCreate } from '../addresses/address-create.dto';
import { AccessibilityUpdate } from './accessibility-update.dto';
import { AlternateContactUpdate } from './alternate-contact-update.dto';
import { ApplicantUpdate } from './applicant-update.dto';
import { Application } from './application.dto';
import { DemographicUpdate } from './demographic-update.dto';
import { HouseholdMemberUpdate } from './household-member-update.dto';
import { IdDTO } from '../shared/id.dto';

export class ApplicationUpdate extends OmitType(Application, [
  'createdAt',
  'updatedAt',
  'deletedAt',
  'applicant',
  'applicationsMailingAddress',
  'applicationsAlternateAddress',
  'alternateContact',
  'accessibility',
  'demographics',
  'householdMember',
  'markedAsDuplicate',
  'flagged',
  'confirmationCode',
  'preferredUnitTypes',
  'applicationLotteryPositions',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicantUpdate)
  @ApiProperty({ type: ApplicantUpdate })
  applicant: ApplicantUpdate;

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
  @Type(() => AlternateContactUpdate)
  @ApiProperty({ type: AlternateContactUpdate })
  alternateContact: AlternateContactUpdate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AccessibilityUpdate)
  @ApiProperty({ type: AccessibilityUpdate })
  accessibility: AccessibilityUpdate;

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
