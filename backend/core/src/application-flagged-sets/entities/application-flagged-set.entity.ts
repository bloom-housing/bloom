import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { Expose, Type } from "class-transformer"
import { IsDate, IsString, IsUUID } from "class-validator"
import { Application } from "../../applications/entities/application.entity"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"

@Entity({ name: "application-flagged-set" })
export class ApplicationFlaggedSet {
  @PrimaryGeneratedColumn("uuid")
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id: string

  @CreateDateColumn()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt: Date

  @UpdateDateColumn()
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt: Date

  // flaggedSet column holds the primary applicant's name
  @Column({ type: "text", nullable: false })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  flaggedSet: string

  @Column({ type: "text", nullable: false })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  ruleName: string

  @ManyToMany(() => Application)
  @JoinTable()
  application: Application[]
}
