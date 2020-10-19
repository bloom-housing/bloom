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
import { IsDateString, IsEmail, IsISO8601, IsOptional, IsString, IsUUID } from "class-validator"

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
  @IsDateString()
  dob: string

  @CreateDateColumn()
  @Expose()
  @IsDateString()
  createdAt: string

  @UpdateDateColumn()
  @Expose()
  @IsDateString()
  updatedAt: string

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
