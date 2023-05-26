import { AmiChartDefaultSeed, getDefaultAmiChart } from "./default-ami-chart"
import { CountyCode } from "../../../shared/types/county-code"

export class AmiDefaultSanJose extends AmiChartDefaultSeed {
  async seed() {
    const sanjoseJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      where: { name: CountyCode.san_jose },
    })
    return await this.amiChartRepository.save({
      ...getDefaultAmiChart(),
      name: "San Jose TCAC 2021",
      jurisdiction: sanjoseJurisdiction,
    })
  }
}
