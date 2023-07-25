import { AmiChartDefaultSeed, getDefaultAmiChart } from "./default-ami-chart"
import { CountyCode } from "../../../shared/types/county-code"

export class AmiDefaultSanMateo extends AmiChartDefaultSeed {
  async seed() {
    const bayAreaJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      where: { name: CountyCode.bay_area },
    })
    return await this.amiChartRepository.save({
      ...getDefaultAmiChart(),
      name: "San mateo TCAC 2021",
      jurisdiction: bayAreaJurisdiction,
    })
  }
}
