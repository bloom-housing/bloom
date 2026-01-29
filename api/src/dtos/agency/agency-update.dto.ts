import { OmitType } from '@nestjs/swagger';
import Agency from './agency.dto';

export class AgencyUpdate extends OmitType(Agency, [
  'createdAt',
  'updatedAt',
]) {}
