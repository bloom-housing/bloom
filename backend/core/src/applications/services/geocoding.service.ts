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
    let preferences = application.preferences
    preferences = this.validateRadiusPreferences(preferences, listing)
    preferences = await this.validateGeoLayerPreferences(preferences, listing)

    await this.applicationRepository.update({ id: application.id }, { preferences: preferences })
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

  /**
   * Checks if there are any preferences that have a validation method of radius, validates those preferences addresses,
   * and then adds the appropriate validation check field to those preferences
   *
   * @param preferences
   * @param listing
   * @returns the preferences with the geocoding verified field added to preferences that have validation method of radius
   */
  public validateRadiusPreferences(
    preferences: ApplicationMultiselectQuestion[],
    listing: Listing
  ): ApplicationMultiselectQuestion[] {
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
      const newPreferences: ApplicationMultiselectQuestion[] = preferences.map((preference) => {
        const newPreferenceOptions: ApplicationMultiselectQuestionOption[] = preference.options.map(
          (option) => {
            const addressData = option.extraData?.find((data) => data.type === InputType.address)
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
      })
      return newPreferences
    }
    return preferences
  }

  /**
   * Checks if there are any preferences that have a validation method of 'map', validates those preferences addresses,
   * and then adds the appropriate validation check field to those preferences
   *
   * @param preferences
   * @param listing
   * @returns all preferences on the application
   */
  public async validateGeoLayerPreferences(
    preferences: ApplicationMultiselectQuestion[],
    listing: Listing
  ): Promise<ApplicationMultiselectQuestion[]> {
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
        const addressData = option.extraData?.find((data) => data.type === InputType.address)
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
      const newPreferences = []
      const mapLayers = await this.mapLayerRepository.findBy({
        id: In(mapPreferenceOptions.map((option) => option.mapLayerId)),
      })
      preferences.forEach((preference) => {
        const newPreferenceOptions = preferencesOptions(preference, mapLayers)
        newPreferences.push({ ...preference, options: newPreferenceOptions })
      })
      return newPreferences
    }
    return preferences
  }
}
