import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IdDTO } from '../shared/id.dto';
import { IsString, IsUUID, ValidateNested } from 'class-validator';
import { UnitGroupAmiLevel } from './unit-group-ami-level.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class UnitGroupAmiLevelUpdate extends OmitType(UnitGroupAmiLevel, [
  'amiChart',
  'createdAt',
  'id',
  'updatedAt',
]) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  id?: string;

  @Expose()
  @Type(() => IdDTO)
  @ApiPropertyOptional({ type: IdDTO })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  amiChart?: IdDTO;
}
