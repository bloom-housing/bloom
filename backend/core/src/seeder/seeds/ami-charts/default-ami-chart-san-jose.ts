import { AmiChartDefaultSeed, getDefaultAmiChart } from "./default-ami-chart"
import { CountyCode } from "../../../shared/types/county-code"

export class AmiDefaultSanJose extends AmiChartDefaultSeed {
  async seed() {
    const bayAreaJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      name: CountyCode.bay_area,
    })
    return await this.amiChartRepository.save({
      ...getDefaultAmiChart(),
      name: "San Jose TCAC 2021",
      jurisdiction: bayAreaJurisdiction,
    })
  }
}
