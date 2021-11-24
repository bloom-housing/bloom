import { Program } from "@bloom-housing/backend-core/types"

export const PROGRAMS_FORM_PATH = "application.programs"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapProgramToApi = (program: Program, data: Record<string, any>) => {
  if (Object.keys(data).length === 0) return []

  const [key, value] = Object.entries(data)[0]
  const options = []

  options.push({
    key: value,
    checked: true,
    extraData: [],
  })
  program?.formMetadata?.options.forEach((option) => {
    if (option.key !== value) {
      options.push({
        key: option.key,
        checked: false,
        extraData: [],
      })
    }
  })

  return {
    key,
    claimed: true,
    options,
  }
}

export const getProgramOptionName = (key: string, metaKey: string) => {
  return key === "preferNotToSay"
    ? "t.preferNotToSay"
    : `${PROGRAMS_FORM_PATH}.${metaKey}.${key}.label`
}

export const getProgramOptionDescription = (key: string, metaKey: string) => {
  return `${PROGRAMS_FORM_PATH}.${metaKey}.${key}.description`
}
