import { OmitType } from '@nestjs/swagger';
import { AmiChart } from './ami-chart-get.dto';

export class AmiChartCreate extends OmitType(AmiChart, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
