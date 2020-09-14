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
}

export { User as default, User }
