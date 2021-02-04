import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator"
import { Application } from "../../applications/entities/application.entity"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"
import { User } from "../../user/entities/user.entity"
import { Expose, Type } from "class-transformer"

export enum Rule {
  nameAndDOB = "Name and DOB",
  email = "Email",
}

export enum FlaggedSetStatus {
  flagged = "flagged",
  resolved = "resolved",
}

@Entity({ name: "application_flagged_sets" })
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

  @Column({ enum: Rule, nullable: false })
  @Expose()
  @IsEnum(Rule, { groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  rule: string

  @Column({ type: "bool", nullable: false })
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  resolved: boolean

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  resolvedTime?: Date | null

  @ManyToOne(() => User, { eager: true, nullable: true, cascade: true })
  @JoinColumn()
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => User)
  resolvingUserId: User

  @Column({ enum: FlaggedSetStatus, nullable: false, default: FlaggedSetStatus.flagged })
  @Expose()
  @IsEnum(FlaggedSetStatus, { groups: [ValidationsGroupsEnum.default] })
  status: FlaggedSetStatus

  @ManyToMany(() => Application, (application) => application.applicationFlaggedSets)
  @JoinTable()
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  applications: Application[]
}
