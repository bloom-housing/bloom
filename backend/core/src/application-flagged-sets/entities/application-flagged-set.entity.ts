import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator"
import { Expose, Type } from "class-transformer"
import { ValidationsGroupsEnum } from "../../shared/validations-groups.enum"
import { Application } from "../../applications/entities/application.entity"
import { User } from "../../user/entities/user.entity"
import { Listing } from "../../.."

export enum Rule {
  nameAndDOB = "Name and DOB",
  email = "Email",
}

export enum FlaggedSetStatus {
  flagged = "flagged",
  resolved = "resolved",
}

@Entity()
export class ApplicationFlaggedSet extends AbstractEntity {
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

  @ManyToMany(() => Application)
  @JoinTable()
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  applications: Application[]

  @ManyToOne(() => Listing, (listing) => listing.applications)
  listing: Listing

  @Column()
  listingId: string
}
