import { OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { PaperApplication } from './paper-application.dto';
import { AssetCreate } from '../assets/asset-create.dto';

export class PaperApplicationCreate extends OmitType(PaperApplication, [
  'id',
  'createdAt',
  'updatedAt',
  'assets',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AssetCreate)
  @ApiProperty({ type: AssetCreate, required: false })
  assets?: AssetCreate;
}
