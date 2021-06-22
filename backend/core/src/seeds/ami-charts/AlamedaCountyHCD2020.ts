import { AmiChartCreateDto } from "../../ami-charts/dto/ami-chart.dto"
import { BaseEntity } from "typeorm"

export const AlamedaCountyHCD2020: Omit<AmiChartCreateDto, keyof BaseEntity> = {
  name: "AlamedaCountyHCD2020",
  items: [
    {
      percentOfAmi: 60,
      householdSize: 1,
      income: 73100,
    },
    {
      percentOfAmi: 60,
      householdSize: 2,
      income: 83550,
    },
    {
      percentOfAmi: 60,
      householdSize: 3,
      income: 94000,
    },
    {
      percentOfAmi: 60,
      householdSize: 4,
      income: 104400,
    },
    {
      percentOfAmi: 60,
      householdSize: 5,
      income: 112800,
    },
    {
      percentOfAmi: 60,
      householdSize: 6,
      income: 121150,
    },
    {
      percentOfAmi: 60,
      householdSize: 7,
      income: 129500,
    },
  ],
}
