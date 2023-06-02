import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { Expose, Type, Transform, TransformFnParams } from 'class-transformer';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';
import { AmiChartItem } from '../units/ami-chart-item-get.dto';
import { IdDTO } from '../shared/id.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AmiChart extends AbstractDTO {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AmiChartItem)
  @ApiProperty({
    type: AmiChartItem,
    isArray: true,
    required: true,
  })
  @Transform(
    (value: TransformFnParams) =>
      value?.value && typeof value.value === 'string'
        ? JSON.parse(value.value)
        : value.value,
    {
      toClassOnly: true,
    },
  )
  items: AmiChartItem[];

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  name: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  jurisdictions: IdDTO;
}
