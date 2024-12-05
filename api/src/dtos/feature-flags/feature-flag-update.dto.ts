import { OmitType } from '@nestjs/swagger';
import { FeatureFlag } from './feature-flag.dto';

export class FeatureFlagUpdate extends OmitType(FeatureFlag, [
  'createdAt',
  'updatedAt',
  'name',
  'jurisdictions',
]) {}
