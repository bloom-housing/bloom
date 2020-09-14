import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  Unique,
} from "typeorm"
import { Application } from "./application.entity"

@Entity({ name: "user_accounts" })
@Index("user_accounts_email_lower", { synchronize: false })
class User {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column("varchar", { select: false })
  passwordHash: string
  @Column("varchar", { unique: true })
  email: string
  @Column("varchar")
  firstName: string
  @Column("varchar", { nullable: true })
  middleName?: string
  @Column("varchar")
  lastName: string
  @Column("timestamp without time zone")
  dob: Date
  @CreateDateColumn()
  createdAt: Date
  @UpdateDateColumn()
  updatedAt: Date
  @OneToMany((type) => Application, (application) => application.user)
  applications: Application[]
  @Column("boolean", { default: false })
  isAdmin: boolean

  /**
   * Array of roles this user can become. Logic is simple right now, but in theory this will expand to take into
   * account membership in a domain (company-level or admin area level for example).
   *
   * In that case, this logic will likely be based on joined entities (another table/entity that keeps track of
   * group membership, for example), and these relations will need to be loaded in order for the list of roles to
   * work properly.
   */
  get roles(): string[] {
    return ["user", ...(this.isAdmin ? ["admin"] : [])]
  }
}

export { User as default, User }
