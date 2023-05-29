import { OmitType } from '@nestjs/swagger';
import { Asset } from './asset-get.dto';

export class AssetCreate extends OmitType(Asset, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
