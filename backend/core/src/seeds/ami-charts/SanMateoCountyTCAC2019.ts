import { AmiChartCreateDto } from "../../ami-charts/dto/ami-chart.dto"
import { BaseEntity } from "typeorm"

export const SanMateoCountyTCAC2019: Omit<AmiChartCreateDto, keyof BaseEntity | "jurisdiction"> = {
  name: "SanMateoCountyTCAC2019",
  items: [
    {
      percentOfAmi: 60,
      householdSize: 1,
      income: 71170,
    },
    {
      percentOfAmi: 50,
      householdSize: 1,
      income: 56450,
    },
  ],
}
