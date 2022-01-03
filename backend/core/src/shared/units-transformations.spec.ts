import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { UnitAmiChartOverride } from "../units/entities/unit-ami-chart-override.entity"
import { mergeAmiChartWithOverrides } from "./hmi-data"
import { Language } from "./types/language-enum"

describe("Unit Transformations", () => {
  it("Ami chart items are correctly overwritten", () => {
    let amiChart: AmiChart = {
      id: "id",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: "name",
      items: [
        {
          percentOfAmi: 1,
          householdSize: 1,
          income: 1,
        },
        {
          percentOfAmi: 2,
          householdSize: 2,
          income: 2,
        },
        {
          percentOfAmi: 3,
          householdSize: 3,
          income: 3,
        },
      ],
      jurisdiction: {
        id: "id",
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "name",
        programs: [],
        languages: [Language.en],
        preferences: [],
        publicUrl: "",
      },
    }

    const amiChartOverride: UnitAmiChartOverride = {
      id: "id",
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          percentOfAmi: 2,
          householdSize: 2,
          income: 20,
        },
      ],
    }
    amiChart = mergeAmiChartWithOverrides(amiChart, amiChartOverride)
    expect(amiChart.items.length).toBe(3)
    expect(amiChart.items[0].income).toBe(1)
    expect(amiChart.items[1].income).toBe(20)
    expect(amiChart.items[2].income).toBe(3)
  })
})
