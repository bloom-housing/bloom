import {
  RaceEthnicityConfiguration,
  RaceEthnicityOption,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export const getRaceEthnicityOptions = (configuration?: RaceEthnicityConfiguration) => {
  if (configuration) {
    return convertConfigToRaceKeysFormat(configuration)
  }
  return null
}

export const convertConfigToRaceKeysFormat = (config: RaceEthnicityConfiguration) => {
  const result: Record<string, string[]> = {}

  config.options?.forEach((option: RaceEthnicityOption) => {
    const subOptionIds = option.subOptions?.map((sub) => `${option.id}-${sub.id}`) || []
    result[option.id] = subOptionIds
  })

  return result
}
