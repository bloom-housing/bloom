import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: "map_layers" })
export class MapLayer {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column()
  jurisdictionId: string
}
