import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Application } from "../entity/application.entity"
import { Expose } from "class-transformer"
import { IsDate, IsEmail, IsOptional, IsString, IsUUID } from "class-validator"

@Entity({ name: "user_accounts" })
@Index("user_accounts_email_unique_idx", { synchronize: false })
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsUUID()
  id: string

  @Column("varchar", { select: false })
  passwordHash: string

  @Column("varchar")
  @Expose()
  @IsEmail()
  email: string

  @Column("varchar")
  @Expose()
  @IsString()
  firstName: string

  @Column("varchar", { nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  middleName?: string

  @Column("varchar")
  @Expose()
  @IsString()
  lastName: string

  @Column("timestamp without time zone")
  @Expose()
  @IsDate()
  dob: Date

  @CreateDateColumn()
  @Expose()
  @IsDate()
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate()
  updatedAt: Date

  @OneToMany((type) => Application, (application) => application.user)
  applications: Application[]
}
