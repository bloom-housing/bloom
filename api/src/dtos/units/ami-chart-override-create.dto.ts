import { OmitType } from '@nestjs/swagger';
import { UnitAmiChartOverrideUpdate } from './ami-chart-override-update.dto';

export class UnitAmiChartOverrideCreate extends OmitType(
  UnitAmiChartOverrideUpdate,
  ['id'],
) {}
