import { OmitType } from '@nestjs/swagger';
import { Asset } from './asset.dto';

export class AssetCreate extends OmitType(Asset, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
