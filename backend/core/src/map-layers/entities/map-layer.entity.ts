import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { Expose } from "class-transformer"
import { IsString, IsUUID } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"

@Entity({ name: "map_layers" })
export class MapLayer {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id: string

  @Expose()
  @Column()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  name: string

  @Expose()
  @Column()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  jurisdictionId: string

  @Column("jsonb")
  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  featureCollection: any
}
