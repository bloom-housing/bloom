import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDefined, ValidateNested, MaxLength } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AssetCreate } from '../assets/asset-create.dto';
import { ListingImage } from './listing-image.dto';

export class ListingImageCreate extends OmitType(ListingImage, [
  'assets',
  'description',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AssetCreate)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: AssetCreate })
  assets: AssetCreate;

  @Expose()
  @MaxLength(125, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ maxLength: 125 })
  description?: string;
}
