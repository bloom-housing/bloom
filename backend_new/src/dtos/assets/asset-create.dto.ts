import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Asset } from './asset.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { IsString, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

export class AssetCreate extends OmitType(Asset, [
  'id',
  'createdAt',
  'updatedAt',
]) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  id?: string;
}
