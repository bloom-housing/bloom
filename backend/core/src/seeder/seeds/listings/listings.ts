import { BaseEntity } from "typeorm"
import { UnitCreateDto } from "../../../units/dto/unit-create.dto"
import { ApplicationMethodCreateDto } from "../../../application-methods/dto/application-method.dto"
import { ListingPublishedCreateDto } from "../../../listings/dto/listing-published-create.dto"
import { PreferenceCreateDto } from "../../../preferences/dto/preference-create.dto"
import { ProgramCreateDto } from "../../../program/dto/program-create.dto"
import { AssetCreateDto } from "../../../assets/dto/asset.dto"
import { AmiChartCreateDto } from "../../../ami-charts/dto/ami-chart.dto"
import { ListingEventCreateDto } from "../../../listings/dto/listing-event.dto"
import { UserCreateDto } from "../../../auth/dto/user-create.dto"

export type UnitSeedType = Omit<UnitCreateDto, "listing">

export type ApplicationMethodSeedType = ApplicationMethodCreateDto

export type ListingSeedType = Omit<
  ListingPublishedCreateDto,
  | keyof BaseEntity
  | "property"
  | "urlSlug"
  | "applicationMethods"
  | "events"
  | "assets"
  | "preferences"
  | "leasingAgents"
  | "showWaitlist"
  | "units"
  | "unitsSummary"
  | "unitsSummarized"
  | "amiChartOverrides"
  | "jurisdiction"
> & {
  jurisdictionName: string
}

export type PreferenceSeedType = PreferenceCreateDto
export type ProgramSeedType = Omit<ProgramCreateDto, "listing">

export type AssetDtoSeedType = Omit<AssetCreateDto, "listing">

// Properties that are ommited in DTOS derived types are relations and getters
export interface ListingSeed {
  amiChart: AmiChartCreateDto
  units: Array<UnitSeedType>
  applicationMethods: Array<ApplicationMethodSeedType>
  preferences: Array<PreferenceSeedType>
  listingEvents: Array<ListingEventCreateDto>
  assets: Array<AssetDtoSeedType>
  listing: ListingSeedType
  leasingAgents: UserCreateDto[]
}
