import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from "typeorm"
import { Application } from "./application.entity"
import { Exclude } from "class-transformer"
import { ApiHideProperty } from "@nestjs/swagger"

@Entity({ name: "user_accounts" })
@Index("user_accounts_email_lower", { synchronize: false })
class User {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column({ select: false })
  passwordHash: string
  @Column()
  email: string
  @Column()
  firstName: string
  @Column({ nullable: true })
  middleName?: string
  @Column()
  lastName: string
  @Column()
  dob: Date
  @CreateDateColumn()
  createdAt: Date
  @UpdateDateColumn()
  updatedAt: Date
  @OneToMany((type) => Application, (application) => application.user)
  applications: Application[]
}

export { User as default, User }
