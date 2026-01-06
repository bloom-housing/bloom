import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { AssetCreate } from '../assets/asset-create.dto';
import { Expose, Type } from 'class-transformer';
import { IsString, IsUUID, ValidateNested } from 'class-validator';
import { PaperApplication } from './paper-application.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class PaperApplicationUpdate extends OmitType(PaperApplication, [
  'assets',
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
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AssetCreate)
  @ApiPropertyOptional({ type: AssetCreate })
  assets?: AssetCreate;
}
