import { OmitType } from '@nestjs/swagger';
import { JurisdictionUpdate } from './jurisdiction-update.dto';

export class JurisdictionCreate extends OmitType(JurisdictionUpdate, ['id']) {}
