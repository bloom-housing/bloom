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
  // This field is optional since on update assets like images can be either new or an
  // existing asset and we need to know the id in order to not recreate the object in the db
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  id?: string;
}
