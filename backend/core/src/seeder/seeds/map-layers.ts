import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { MapLayer } from "../../map-layers/entities/map-layer.entity"
import { Jurisdiction } from "../../../types"

export class MapLayerSeeder {
  constructor(
    @InjectRepository(MapLayer)
    protected readonly mapLayerRepository: Repository<MapLayer>
  ) {}

  async seed(jurisdictions: Jurisdiction[]) {
    const mapLayers = [
      {
        name: "Map Layer 1",
        jurisdictionId: jurisdictions?.[0]?.id ?? "1",
      },
      {
        name: "Map Layer 2",
        jurisdictionId: jurisdictions?.[0]?.id ?? "1",
      },
      {
        name: "Map Layer 3",
        jurisdictionId: jurisdictions?.[0]?.id ?? "1",
      },
      {
        name: "Map Layer 4",
        jurisdictionId: jurisdictions?.[1]?.id ?? "2",
      },
      {
        name: "Map Layer 5",
        jurisdictionId: jurisdictions?.[2]?.id ?? "3",
      },
    ]

    await this.mapLayerRepository.save(mapLayers)
  }
}
