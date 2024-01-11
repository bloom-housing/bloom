import { point } from "@turf/helpers"
import buffer from "@turf/buffer"
import booleanPointInPolygon from "@turf/boolean-point-in-polygon"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Address } from "../../shared/entities/address.entity"
import { Application } from "../entities/application.entity"
import { Listing } from "../../listings/entities/listing.entity"
import { ValidationMethod } from "../../multiselect-question/types/validation-method-enum"
import { MultiselectOption } from "../../multiselect-question/types/multiselect-option"
import { ApplicationMultiselectQuestion } from "../entities/application-multiselect-question.entity"
import { ApplicationMultiselectQuestionOption } from "../types/application-multiselect-question-option"
import { InputType } from "../../shared/types/input-type"
import { GeocodingValues } from "../../shared/types/geocoding-values"

export class GeocodingService {
  constructor(
    @InjectRepository(Application) private readonly repository: Repository<Application>
  ) {}

  public async validateGeocodingPreferences(application: Application, listing: Listing) {
    await this.validateRadiusPreferences(application, listing)
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
      await this.repository.update({ id: application.id }, { preferences: preferences })
    }
  }
}
