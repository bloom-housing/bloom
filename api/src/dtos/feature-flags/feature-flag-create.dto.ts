import { OmitType } from '@nestjs/swagger';
import { FeatureFlagUpdate } from './feature-flag-update.dto';

export class FeatureFlagCreate extends OmitType(FeatureFlagUpdate, ['id']) {}
