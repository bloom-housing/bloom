import { OmitType } from '@nestjs/swagger';
import { UnitsSummary } from './units-summary.dto';

export class UnitsSummaryCreate extends OmitType(UnitsSummary, ['id']) {}
