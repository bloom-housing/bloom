import { Expose } from "class-transformer"

export class MapLayerDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  jurisdictionId: string
}
