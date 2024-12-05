import { OmitType } from '@nestjs/swagger';
import { Jurisdiction } from './jurisdiction.dto';

export class JurisdictionUpdate extends OmitType(Jurisdiction, [
  'createdAt',
  'updatedAt',
  'featureFlags',
  'multiselectQuestions',
]) {}
