import { AmiChartCreateDto } from "../../ami-charts/dto/ami-chart.dto"
import { BaseEntity } from "typeorm"

export const OaklandFremontHUD2020: Omit<AmiChartCreateDto, keyof BaseEntity | "jurisdiction"> = {
  name: "OaklandFremontHUD2020",
  items: [
    {
      percentOfAmi: 50,
      householdSize: 1,
      income: 45700,
    },
    {
      percentOfAmi: 50,
      householdSize: 2,
      income: 52200,
    },
    {
      percentOfAmi: 50,
      householdSize: 3,
      income: 58750,
    },
    {
      percentOfAmi: 50,
      householdSize: 4,
      income: 65250,
    },
  ],
}
