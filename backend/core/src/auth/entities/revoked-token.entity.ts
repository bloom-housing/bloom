import { PrimaryColumn, CreateDateColumn, Entity } from "typeorm"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Type } from "class-transformer"
import { IsDate, IsString } from "class-validator"

@Entity({ name: "revoked_tokens" })
class RevokedToken {
  @PrimaryColumn("varchar")
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  token: string

  @CreateDateColumn()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  revokedAt: Date
}

export { RevokedToken as default, RevokedToken }
