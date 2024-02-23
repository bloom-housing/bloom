import { ApiProperty } from '@nestjs/swagger';

type AnyDict = { [key: string]: unknown };

export class HMI {
  @ApiProperty()
  columns: AnyDict;

  @ApiProperty({ type: [Object] })
  rows: AnyDict[];
}
