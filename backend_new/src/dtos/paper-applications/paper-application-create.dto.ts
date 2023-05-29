import { OmitType, ApiProperty } from '@nestjs/swagger';
import { PaperApplication } from './paper-application-get.dto';
import { Expose, Type } from 'class-transformer';
import { IsString, IsUUID, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AssetCreate } from '../assets/asset-create.dto';

export class PaperApplicationCreate extends OmitType(PaperApplication, [
  'id',
  'createdAt',
  'updatedAt',
  'assets',
]) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  id?: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetCreate)
  @ApiProperty()
  assets?: AssetCreate;
}
