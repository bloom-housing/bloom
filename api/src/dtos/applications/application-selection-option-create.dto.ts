import { AddressCreate } from '../addresses/address-create.dto';
import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { ApplicationSelectionOptionUpdate } from './application-selection-option-update.dto';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../../src/enums/shared/validation-groups-enum';

export class ApplicationSelectionOptionCreate extends OmitType(
  ApplicationSelectionOptionUpdate,
  ['id', 'addressHolderAddress'],
) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiPropertyOptional({ type: AddressCreate })
  addressHolderAddress?: AddressCreate;
}
