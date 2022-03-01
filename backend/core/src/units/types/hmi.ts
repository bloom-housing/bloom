import { AnyDict } from "../../shared/units-transformations-deprecated"
import { ApiProperty } from "@nestjs/swagger"

export class HMI {
  @ApiProperty()
  columns: AnyDict

  @ApiProperty({ type: [Object] })
  rows: AnyDict[]
}
