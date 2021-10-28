import { AmiChartCreateDto } from "../../ami-charts/dto/ami-chart.dto"
import { BaseEntity } from "typeorm"

export const AlamedaCountyTCAC2019: Omit<AmiChartCreateDto, keyof BaseEntity | "jurisdiction"> = {
  name: "AlamedaCountyTCAC2019",
  items: [
    {
      percentOfAmi: 80,
      householdSize: 1,
      income: 69000,
    },
    {
      percentOfAmi: 80,
      householdSize: 2,
      income: 78850,
    },
    {
      percentOfAmi: 80,
      householdSize: 3,
      income: 88700,
    },
    {
      percentOfAmi: 80,
      householdSize: 4,
      income: 98550,
    },
    {
      percentOfAmi: 80,
      householdSize: 5,
      income: 106450,
    },
    {
      percentOfAmi: 80,
      householdSize: 6,
      income: 115040,
    },
    {
      percentOfAmi: 80,
      householdSize: 7,
      income: 122960,
    },
    {
      percentOfAmi: 80,
      householdSize: 8,
      income: 130800,
    },
    {
      percentOfAmi: 60,
      householdSize: 1,
      income: 52080,
    },
    {
      percentOfAmi: 60,
      householdSize: 2,
      income: 59520,
    },
    {
      percentOfAmi: 60,
      householdSize: 3,
      income: 66960,
    },
    {
      percentOfAmi: 60,
      householdSize: 4,
      income: 74340,
    },
    {
      percentOfAmi: 60,
      householdSize: 5,
      income: 80340,
    },
    {
      percentOfAmi: 60,
      householdSize: 6,
      income: 86280,
    },
    {
      percentOfAmi: 60,
      householdSize: 7,
      income: 92220,
    },
    {
      percentOfAmi: 60,
      householdSize: 8,
      income: 98160,
    },
    {
      percentOfAmi: 30,
      householdSize: 1,
      income: 26040,
    },
    {
      percentOfAmi: 30,
      householdSize: 2,
      income: 29760,
    },
    {
      percentOfAmi: 30,
      householdSize: 3,
      income: 33480,
    },
    {
      percentOfAmi: 30,
      householdSize: 4,
      income: 37170,
    },
    {
      percentOfAmi: 30,
      householdSize: 5,
      income: 40170,
    },
    {
      percentOfAmi: 30,
      householdSize: 6,
      income: 43140,
    },
    {
      percentOfAmi: 30,
      householdSize: 7,
      income: 46110,
    },
    {
      percentOfAmi: 30,
      householdSize: 8,
      income: 49080,
    },
  ],
}
