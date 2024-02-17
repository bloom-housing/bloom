import { OmitType } from '@nestjs/swagger';
import { UnitAmiChartOverride } from './ami-chart-override.dto';

export class UnitAmiChartOverrideCreate extends OmitType(UnitAmiChartOverride, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
