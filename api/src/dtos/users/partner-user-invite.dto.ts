import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { IdDTO } from '../shared/id.dto';
import { PartnerUserUpdate } from './partner-user-update.dto';

export class PartnerUserInvite extends OmitType(PartnerUserUpdate, [
  'id',
  'password',
  'currentPassword',
  'agreedToTermsOfService',
  'jurisdictions',
]) {
  /* Fields inherited from User:
   * - email (inherited as required from User)
   **/

  @Expose()
  @Type(() => IdDTO)
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMinSize(1, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty({ type: IdDTO, isArray: true })
  jurisdictions: IdDTO[];
}
