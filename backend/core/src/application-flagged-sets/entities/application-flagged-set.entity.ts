import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { IsDate, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator"
import { Expose, Type } from "class-transformer"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { Application } from "../../applications/entities/application.entity"
import { User } from "../../auth/entities/user.entity"
import { Listing } from "../../listings/entities/listing.entity"
import { Rule } from "../types/rule-enum"

@Entity()
@Index(["listing"])
export class ApplicationFlaggedSet extends AbstractEntity {
  @Column({ enum: Rule, nullable: false })
  @Expose()
  @IsEnum(Rule, { groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  rule: Rule

  @Column({ nullable: false, unique: true })
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  ruleKey: string

  @Column({ type: "timestamptz", nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  resolvedTime?: Date | null

  @ManyToOne(() => User, { eager: true, nullable: true, cascade: false })
  @JoinColumn()
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => User)
  resolvingUser: User

  @ManyToMany(() => Application)
  @JoinTable({ name: "application_flagged_set_applications_applications" })
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  applications: Application[]

  @ManyToOne(() => Listing)
  listing: Listing

  @Column()
  listingId: string
}
