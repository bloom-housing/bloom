import { DemographicUpdate } from './demographic-update.dto';
import { OmitType } from '@nestjs/swagger';

export class DemographicCreate extends OmitType(DemographicUpdate, ['id']) {}
