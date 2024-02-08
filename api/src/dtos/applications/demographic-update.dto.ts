import { OmitType } from '@nestjs/swagger';
import { Demographic } from './demographic.dto';

export class DemographicUpdate extends OmitType(Demographic, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
