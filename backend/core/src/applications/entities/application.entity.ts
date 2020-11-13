import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm"
import { User } from "../../entity/user.entity"
import { Listing } from "../../entity/listing.entity"
import { IsDefined, IsString, ValidateNested } from "class-validator"
import { Expose, Type } from "class-transformer"
import { AbstractEntity } from "../../shared/entities/abstract.entity"
import { ApplicationData } from "./application-data.entity"

@Entity({ name: "applications" })
export class Application extends AbstractEntity {

  @Column({ type: "text", nullable: false })
  @Expose()
  @IsString()
  appUrl: string

  @ManyToOne(() => User, (user) => user.applications, { nullable: true })
  user: User | null

  @ManyToOne(() => Listing, (listing) => listing.applications)
  listing: Listing

  @OneToOne(() => ApplicationData, { eager: true, cascade: true })
  @JoinColumn()
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => ApplicationData)
  application: ApplicationData
}
