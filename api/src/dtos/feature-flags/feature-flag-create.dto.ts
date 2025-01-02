import { OmitType } from '@nestjs/swagger';
import { FeatureFlag } from './feature-flag.dto';

export class FeatureFlagCreate extends OmitType(FeatureFlag, [
  'id',
  'createdAt',
  'updatedAt',
  'jurisdictions',
]) {}
