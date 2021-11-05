import { PropertyCreateDto } from "../../property/dto/property.dto"
import { ApplicationMethodCreateDto } from "../../application-methods/dto/application-method.dto"
import { ListingEventCreateDto } from "../../listings/dto/listing-event.dto"
import { AssetCreateDto } from "../../assets/dto/asset.dto"
import { AmiChartCreateDto } from "../../ami-charts/dto/ami-chart.dto"
import { BaseEntity } from "typeorm"
import { UserCreateDto } from "../../auth/dto/user-create.dto"
import { ListingPublishedCreateDto } from "../../listings/dto/listing-published-create.dto"
import { UnitCreateDto } from "../../units/dto/unit-create.dto"
import { PreferenceCreateDto } from "../../preferences/dto/preference-create.dto"
import { ProgramCreateDto } from "../../program/dto/program-create.dto"

export type PropertySeedType = Omit<
  PropertyCreateDto,
  | "propertyGroups"
  | "listings"
  | "units"
  | "unitsSummarized"
  | "householdSizeMin"
  | "householdSizeMax"
>

export type UnitSeedType = Omit<UnitCreateDto, "property">

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
  | "propertyGroups"
  | "accessibility"
  | "amenities"
  | "buildingAddress"
  | "buildingTotalUnits"
  | "developer"
  | "householdSizeMax"
  | "householdSizeMin"
  | "neighborhood"
  | "petPolicy"
  | "smokingPolicy"
  | "unitsAvailable"
  | "unitAmenities"
  | "servicesOffered"
  | "yearBuilt"
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
  property: PropertySeedType
  preferences: Array<PreferenceSeedType>
  listingEvents: Array<ListingEventCreateDto>
  assets: Array<AssetDtoSeedType>
  listing: ListingSeedType
  leasingAgents: UserCreateDto[]
}
