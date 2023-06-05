import { OmitType } from '@nestjs/swagger';
import { AmiChart } from './ami-chart.dto';

export class AmiChartUpdate extends OmitType(AmiChart, [
  'createdAt',
  'updatedAt',
]) {}
