import { FeatureCollection, point, polygons } from "@turf/helpers"
import buffer from "@turf/buffer"
import booleanPointInPolygon from "@turf/boolean-point-in-polygon"
import pointsWithinPolygon from "@turf/points-within-polygon"
import { InjectRepository } from "@nestjs/typeorm"
import { In, Repository } from "typeorm"
import { Address } from "../../shared/entities/address.entity"
import { Application } from "../entities/application.entity"
import { MapLayer } from "../../map-layers/entities/map-layer.entity"
import { Listing } from "../../listings/entities/listing.entity"
import { ValidationMethod } from "../../multiselect-question/types/validation-method-enum"
import { MultiselectOption } from "../../multiselect-question/types/multiselect-option"
import { ApplicationMultiselectQuestion } from "../entities/application-multiselect-question.entity"
import { ApplicationMultiselectQuestionOption } from "../types/application-multiselect-question-option"
import { InputType } from "../../shared/types/input-type"
import { GeocodingValues } from "../../shared/types/geocoding-values"

export class GeocodingService {
  constructor(
    @InjectRepository(Application) private readonly applicationRepository: Repository<Application>,
    @InjectRepository(MapLayer) private readonly mapLayerRepository: Repository<MapLayer>
  ) {}

  public async validateGeocodingPreferences(application: Application, listing: Listing) {
    await this.validateRadiusPreferences(application, listing)
    await this.validateGeoLayerPreferences(application, listing)
  }

  verifyRadius(
    preferenceAddress: Address,
    radius: number,
    listingAddress: Address
  ): GeocodingValues {
    try {
      if (preferenceAddress.latitude && preferenceAddress.longitude) {
        const preferencePoint = point([
          Number.parseFloat(preferenceAddress.longitude.toString()),
          Number.parseFloat(preferenceAddress.latitude.toString()),
        ])
        const listingPoint = point([
          Number.parseFloat(listingAddress.longitude.toString()),
          Number.parseFloat(listingAddress.latitude.toString()),
        ])
        const calculatedBuffer = buffer(listingPoint.geometry, radius, { units: "miles" })
        return booleanPointInPolygon(preferencePoint, calculatedBuffer)
          ? GeocodingValues.true
          : GeocodingValues.false
      }
    } catch (e) {
      console.log("error happened while calculating radius")
    }
    return GeocodingValues.unknown
  }

  verifyLayers(
    preferenceAddress: Address,
    featureCollectionLayers: FeatureCollection
  ): GeocodingValues {
    try {
      if (preferenceAddress.latitude && preferenceAddress.longitude) {
        const preferencePoint = point([
          Number.parseFloat(preferenceAddress.longitude.toString()),
          Number.parseFloat(preferenceAddress.latitude.toString()),
        ])

        // Convert the features to the format that turfjs wants
        const polygonsFromFeature = []
        featureCollectionLayers.features.forEach((feature) => {
          if (feature.geometry.type === "MultiPolygon" || feature.geometry.type === "Polygon") {
            feature.geometry.coordinates.forEach((coordinate) => {
              polygonsFromFeature.push(coordinate)
            })
          }
        })
        const layer = polygons(polygonsFromFeature)

        const points = pointsWithinPolygon(preferencePoint, layer)
        if (points && points.features?.length) {
          return GeocodingValues.true
        }

        return GeocodingValues.false
      }
    } catch (e) {
      console.log("e", e)
    }
    // If the geocoding value was not able to be verified we need to set it as "unknown"
    // in order to signify we are unable to automatically verify and manually checking will need to be done
    return GeocodingValues.unknown
  }

  public async validateRadiusPreferences(application: Application, listing: Listing) {
    // Get all radius preferences from the listing
    const radiusPreferenceOptions: MultiselectOption[] = listing.listingMultiselectQuestions.reduce(
      (options, multiselectQuestion) => {
        const newOptions = multiselectQuestion.multiselectQuestion.options?.filter(
          (option) => option.validationMethod === ValidationMethod.radius
        )
        return [...options, ...newOptions]
      },
      []
    )
    // If there are any radius preferences do the calculation and save the new preferences
    if (radiusPreferenceOptions.length) {
      const preferences: ApplicationMultiselectQuestion[] = application.preferences.map(
        (preference) => {
          const newPreferenceOptions: ApplicationMultiselectQuestionOption[] = preference.options.map(
            (option) => {
              const addressData = option.extraData.find((data) => data.type === InputType.address)
              if (option.checked && addressData) {
                const foundOption = radiusPreferenceOptions.find(
                  (preferenceOption) => preferenceOption.text === option.key
                )
                if (foundOption) {
                  const geocodingVerified = this.verifyRadius(
                    addressData.value as Address,
                    foundOption.radiusSize,
                    listing.buildingAddress
                  )
                  return {
                    ...option,
                    extraData: [
                      ...option.extraData,
                      {
                        key: "geocodingVerified",
                        type: InputType.text,
                        value: geocodingVerified,
                      },
                    ],
                  }
                }
              }
              return option
            }
          )
          return { ...preference, options: newPreferenceOptions }
        }
      )
      await this.applicationRepository.update({ id: application.id }, { preferences: preferences })
    }
  }

  public async validateGeoLayerPreferences(application: Application, listing: Listing) {
    // Get all map layer preferences from the listing
    const mapPreferenceOptions: MultiselectOption[] = listing.listingMultiselectQuestions?.reduce(
      (options, multiselectQuestion) => {
        const newOptions = multiselectQuestion.multiselectQuestion?.options?.filter(
          (option) => option.validationMethod === ValidationMethod.map
        )
        return [...options, ...newOptions]
      },
      []
    )

    const preferencesOptions = (
      preference: ApplicationMultiselectQuestion,
      mapLayers: MapLayer[]
    ): ApplicationMultiselectQuestionOption[] => {
      const preferenceOptions = []
      preference.options.forEach((option) => {
        const addressData = option.extraData.find((data) => data.type === InputType.address)
        if (option.checked && addressData) {
          const foundOption = mapPreferenceOptions.find(
            (preferenceOption) => preferenceOption.text === option.key
          )
          if (foundOption && foundOption.mapLayerId) {
            const layer = mapLayers.find((layer) => layer.id === foundOption.mapLayerId)
            const geocodingVerified = this.verifyLayers(
              addressData.value as Address,
              layer?.featureCollection
            )
            preferenceOptions.push({
              ...option,
              extraData: [
                ...option.extraData,
                {
                  key: "geocodingVerified",
                  type: InputType.text,
                  value: geocodingVerified,
                },
              ],
            })
            return
          }
        }
        preferenceOptions.push(option)
      })
      return preferenceOptions
    }
    if (mapPreferenceOptions?.length) {
      const preferences = []
      const mapLayers = await this.mapLayerRepository.findBy({
        id: In(mapPreferenceOptions.map((option) => option.mapLayerId)),
      })
      application.preferences.forEach((preference) => {
        const newPreferenceOptions = preferencesOptions(preference, mapLayers)
        preferences.push({ ...preference, options: newPreferenceOptions })
      })

      await this.applicationRepository.update({ id: application.id }, { preferences: preferences })
    }
  }
}
