import { AmiChartCreateDto } from "../../ami-charts/dto/ami-chart.dto"
import { BaseEntity } from "typeorm"

export const AlamedaCountyTCAC2020: Omit<AmiChartCreateDto, keyof BaseEntity | "jurisdiction"> = {
  name: "AlamedaCountyTCAC2020",
  items: [
    {
      percentOfAmi: 80,
      householdSize: 1,
      income: 73100,
    },
    {
      percentOfAmi: 80,
      householdSize: 2,
      income: 83550,
    },
    {
      percentOfAmi: 80,
      householdSize: 3,
      income: 94000,
    },
    {
      percentOfAmi: 80,
      householdSize: 4,
      income: 104400,
    },
    {
      percentOfAmi: 80,
      householdSize: 5,
      income: 112800,
    },
    {
      percentOfAmi: 80,
      householdSize: 6,
      income: 121150,
    },
    {
      percentOfAmi: 80,
      householdSize: 7,
      income: 129500,
    },
    {
      percentOfAmi: 80,
      householdSize: 8,
      income: 137850,
    },
    {
      percentOfAmi: 60,
      householdSize: 1,
      income: 54840,
    },
    {
      percentOfAmi: 60,
      householdSize: 2,
      income: 62640,
    },
    {
      percentOfAmi: 60,
      householdSize: 3,
      income: 70500,
    },
    {
      percentOfAmi: 60,
      householdSize: 4,
      income: 78300,
    },
    {
      percentOfAmi: 60,
      householdSize: 5,
      income: 84600,
    },
    {
      percentOfAmi: 60,
      householdSize: 6,
      income: 90840,
    },
    {
      percentOfAmi: 60,
      householdSize: 7,
      income: 97140,
    },
    {
      percentOfAmi: 60,
      householdSize: 8,
      income: 103380,
    },
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
    {
      percentOfAmi: 50,
      householdSize: 5,
      income: 70500,
    },
    {
      percentOfAmi: 50,
      householdSize: 6,
      income: 75700,
    },
    {
      percentOfAmi: 50,
      householdSize: 7,
      income: 80950,
    },
    {
      percentOfAmi: 50,
      householdSize: 8,
      income: 86500,
    },
    {
      percentOfAmi: 30,
      householdSize: 1,
      income: 27450,
    },
    {
      percentOfAmi: 30,
      householdSize: 2,
      income: 31350,
    },
    {
      percentOfAmi: 30,
      householdSize: 3,
      income: 35250,
    },
    {
      percentOfAmi: 30,
      householdSize: 4,
      income: 39150,
    },
    {
      percentOfAmi: 30,
      householdSize: 5,
      income: 42300,
    },
    {
      percentOfAmi: 30,
      householdSize: 6,
      income: 45450,
    },
    {
      percentOfAmi: 30,
      householdSize: 7,
      income: 48550,
    },
    {
      percentOfAmi: 30,
      householdSize: 8,
      income: 51700,
    },
  ],
}
