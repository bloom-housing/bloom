import { PrimaryColumn, CreateDateColumn, Entity } from "typeorm"

@Entity()
class RevokedToken {
  @PrimaryColumn()
  token: string

  @CreateDateColumn()
  revokedAt: Date
}

export { RevokedToken as default, RevokedToken }
