import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm"

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
}

export { User as default, User }
