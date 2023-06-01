import { OmitType } from '@nestjs/swagger';
import { AmiChartUpdate } from './ami-chart-update.dto';

export class AmiChartCreate extends OmitType(AmiChartUpdate, ['id']) {}
