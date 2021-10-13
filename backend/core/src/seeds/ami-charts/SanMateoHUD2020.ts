import { AmiChartCreateDto } from "../../ami-charts/dto/ami-chart.dto"
import { BaseEntity } from "typeorm"

export const SanMateoHUD2020: Omit<AmiChartCreateDto, keyof BaseEntity | "jurisdiction"> = {
  name: "SanMateoHUD2020",
  items: [
    {
      percentOfAmi: 120,
      householdSize: 1,
      income: 120200,
    },
    {
      percentOfAmi: 120,
      householdSize: 2,
      income: 137350,
    },
    {
      percentOfAmi: 120,
      householdSize: 3,
      income: 154550,
    },
    {
      percentOfAmi: 120,
      householdSize: 4,
      income: 171700,
    },
    {
      percentOfAmi: 120,
      householdSize: 5,
      income: 185450,
    },
    {
      percentOfAmi: 120,
      householdSize: 6,
      income: 199150,
    },
    {
      percentOfAmi: 120,
      householdSize: 7,
      income: 212900,
    },
    {
      percentOfAmi: 80,
      householdSize: 1,
      income: 97600,
    },
    {
      percentOfAmi: 80,
      householdSize: 2,
      income: 111550,
    },
    {
      percentOfAmi: 80,
      householdSize: 3,
      income: 125500,
    },
    {
      percentOfAmi: 80,
      householdSize: 4,
      income: 139400,
    },
    {
      percentOfAmi: 80,
      householdSize: 5,
      income: 150600,
    },
    {
      percentOfAmi: 80,
      householdSize: 6,
      income: 161750,
    },
    {
      percentOfAmi: 80,
      householdSize: 7,
      income: 172900,
    },
    {
      percentOfAmi: 50,
      householdSize: 1,
      income: 60900,
    },
    {
      percentOfAmi: 50,
      householdSize: 2,
      income: 69600,
    },
    {
      percentOfAmi: 50,
      householdSize: 3,
      income: 78300,
    },
    {
      percentOfAmi: 50,
      householdSize: 4,
      income: 87000,
    },
    {
      percentOfAmi: 50,
      householdSize: 5,
      income: 94000,
    },
    {
      percentOfAmi: 50,
      householdSize: 6,
      income: 100950,
    },
    {
      percentOfAmi: 50,
      householdSize: 7,
      income: 107900,
    },
  ],
}
