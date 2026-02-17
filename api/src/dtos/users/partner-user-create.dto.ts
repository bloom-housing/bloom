import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PartnerUserUpdate } from './partner-user-update.dto';
import { Expose, Type } from 'class-transformer';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { IdDTO } from '../shared/id.dto';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

export class PartnerUserCreate extends OmitType(PartnerUserUpdate, [
  'id',
  'newEmail',
  'password',
  'currentPassword',
  'jurisdictions',
] as const) {
  /* Fields inherited from PartnerUserUpdate:
   * - firstName (inherited as required from PartnerUserUpdate)
   * - lastName (inherited as required from PartnerUserUpdate)
   * - email (inherited as required from PartnerUserUpdate)
   * - userRoles (inherited as required from PartnerUserUpdate)
   **/
  @Expose()
  @Type(() => IdDTO)
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMinSize(1, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty({ type: IdDTO, isArray: true })
  jurisdictions: IdDTO[];
}
