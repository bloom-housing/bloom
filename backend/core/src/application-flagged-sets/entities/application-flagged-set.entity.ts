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
import { Applicant } from "../../applications/entities/applicant.entity"

export enum Rule {
  nameAndDOB = "Name and DOB",
  email = "Email",
  address = "Resident Address",
}

export enum FlaggedSetStatus {
  flagged = "flagged",
  resolved = "resolved",
}

@Entity({ name: "application-flagged-set" })
export class ApplicationFlaggedSet {
  @PrimaryGeneratedColumn("uuid")
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  id: string

  @CreateDateColumn()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  createdAt: Date

  @UpdateDateColumn()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  updatedAt: Date

  // Not sure what does the name holds? primary applicant name?
  // @Column({ type: "text", nullable: false })
  // @IsString({ groups: [ValidationsGroupsEnum.default] })
  // name: string

  @ManyToOne(() => Applicant, { eager: true, nullable: true, cascade: true })
  @JoinColumn()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Applicant)
  primaryApplicant: Applicant

  @Column({ enum: Rule, nullable: false })
  @IsEnum(Rule, { groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  rule: string

  @Column({ type: "bool", nullable: false })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  resolved: boolean

  @Column({ type: "timestamptz", nullable: true })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  resolvedTime?: Date | null

  @ManyToOne(() => User, { eager: true, nullable: true, cascade: true })
  @JoinColumn()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => User)
  resolvingUserId: User

  // resolved applications
  // did not really understand what to do here

  @Column({ enum: FlaggedSetStatus, nullable: false })
  @IsEnum(FlaggedSetStatus, { groups: [ValidationsGroupsEnum.default] })
  status: FlaggedSetStatus

  @ManyToMany(() => Application)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @JoinTable()
  applications: Application[]
}
