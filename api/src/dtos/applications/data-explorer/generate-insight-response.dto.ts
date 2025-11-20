import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../../shared/abstract.dto';

export class GenerateInsightResponse extends AbstractDTO {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'The data shows significant trends...',
    description: 'Markdown-formatted AI-generated insights',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  insight: string;
}
