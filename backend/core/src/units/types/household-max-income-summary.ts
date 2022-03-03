import { ApiProperty } from "@nestjs/swagger"

export class HouseholdMaxIncomeSummary {
  @ApiProperty()
  columns: { [key: string]: unknown }

  @ApiProperty({ type: [Object] })
  rows: { [key: string]: unknown }[]
}
