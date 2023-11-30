import { DoorwayJurisdictions } from "../../../../src/shared/types/doorway-jurisdictions"
import { AmiChartDefaultSeed, getDefaultAmiChart } from "./default-ami-chart"

export class AmiDefaultDoorway extends AmiChartDefaultSeed {
  async seed() {
    const promiseArr = Object.values(DoorwayJurisdictions).map(async (name) => {
      const doorwayJurisdiction = await this.jurisdictionRepository.findOneOrFail({
        where: { name: name },
      })
      return await this.amiChartRepository.save({
        ...getDefaultAmiChart(),
        name: `${name} - HUD`,
        jurisdiction: doorwayJurisdiction,
      })
    })

    return await Promise.all(promiseArr)
  }
}
