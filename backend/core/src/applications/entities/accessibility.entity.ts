import { Column, Entity } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { Expose } from "class-transformer"
import { IsBoolean, IsOptional } from "class-validator"

@Entity()
export class Accessibility extends AbstractEntity {
  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional()
  @IsBoolean()
  mobility: boolean | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional()
  @IsBoolean()
  vision: boolean | null

  @Column({ type: "boolean", nullable: true })
  @Expose()
  @IsOptional()
  @IsBoolean()
  hearing: boolean | null
}
