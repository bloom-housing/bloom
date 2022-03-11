import { ApiProperty } from "@nestjs/swagger"
import { HMIColumns } from "./household-max-income-columns"

export class HouseholdMaxIncomeSummary {
  @ApiProperty()
  columns: HMIColumns

  @ApiProperty({ type: [HMIColumns] })
  rows: HMIColumns[]
}
