import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { AssetCreate } from '../assets/asset-create.dto';
import { Expose, Type } from 'class-transformer';
import { PaperApplicationUpdate } from './paper-application-update.dto';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class PaperApplicationCreate extends OmitType(PaperApplicationUpdate, [
  'assets',
  'id',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AssetCreate)
  @ApiPropertyOptional({ type: AssetCreate })
  assets?: AssetCreate;
}
