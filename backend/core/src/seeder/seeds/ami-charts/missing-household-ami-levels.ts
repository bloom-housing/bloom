import { AmiChartDefaultSeed } from "./default-ami-chart"
import { CountyCode } from "../../../shared/types/county-code"

export class AmiDefaultMissingAMI extends AmiChartDefaultSeed {
  async seed() {
    const alamedaJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      name: CountyCode.alameda,
    })
    return await this.amiChartRepository.save({
      name: "Missing Household Ami Levels",
      items: [
        {
          percentOfAmi: 50,
          householdSize: 3,
          income: 65850,
        },
        {
          percentOfAmi: 50,
          householdSize: 4,
          income: 73150,
        },
        {
          percentOfAmi: 50,
          householdSize: 5,
          income: 79050,
        },
        {
          percentOfAmi: 50,
          householdSize: 6,
          income: 84900,
        },
        {
          percentOfAmi: 50,
          householdSize: 7,
          income: 90750,
        },
        {
          percentOfAmi: 50,
          householdSize: 8,
          income: 96600,
        },
      ],
      jurisdiction: alamedaJurisdiction,
    })
  }
}
