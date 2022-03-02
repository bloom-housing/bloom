import { ApiProperty } from "@nestjs/swagger"

export class HMI {
  @ApiProperty()
  columns: { [key: string]: unknown }

  @ApiProperty({ type: [Object] })
  rows: { [key: string]: unknown }[]
}
