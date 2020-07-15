import { PrimaryColumn, CreateDateColumn, Entity } from "typeorm"

@Entity({ name: "revoked_tokens" })
class RevokedToken {
  @PrimaryColumn()
  token: string

  @CreateDateColumn()
  revokedAt: Date
}

export { RevokedToken as default, RevokedToken }
