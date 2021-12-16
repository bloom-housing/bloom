import { AmiChartDefaultSeed } from "./default-ami-chart"
import { itemInfo } from "./triton-ami-chart"
import { CountyCode } from "../../../shared/types/county-code"

export class AmiDefaultTritonDetroit extends AmiChartDefaultSeed {
  async seed() {
    const detroitJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      name: CountyCode.detroit,
    })
    return await this.amiChartRepository.save({
      name: "Detroit TCAC 2019",
      items: itemInfo,
      jurisdiction: detroitJurisdiction,
    })
  }
}
