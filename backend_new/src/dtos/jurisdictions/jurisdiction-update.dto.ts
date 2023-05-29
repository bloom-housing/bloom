import { OmitType } from '@nestjs/swagger';
import { Jurisdiction } from './jurisdiction-get.dto';

export class JurisdictionUpdate extends OmitType(Jurisdiction, [
  'createdAt',
  'updatedAt',
  'multiselectQuestions',
]) {}
