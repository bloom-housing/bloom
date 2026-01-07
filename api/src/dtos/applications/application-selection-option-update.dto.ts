import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString, IsUUID, ValidateNested } from 'class-validator';
import { ApplicationSelectionOption } from './application-selection-option.dto';
import { AddressUpdate } from '../addresses/address-update.dto';
import { IdDTO } from '../shared/id.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ApplicationSelectionOptionUpdate extends OmitType(
  ApplicationSelectionOption,
  [
    'id',
    'createdAt',
    'updatedAt',
    'addressHolderAddress',
    'applicationSelection',
  ],
) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  id?: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdate)
  @ApiPropertyOptional({ type: AddressUpdate })
  addressHolderAddress?: AddressUpdate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiPropertyOptional({ type: IdDTO })
  applicationSelection?: IdDTO;
}
