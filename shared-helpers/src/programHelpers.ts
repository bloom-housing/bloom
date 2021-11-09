import { ApplicationProgram, Program } from "@bloom-housing/backend-core/types"

export const PROGRAMS_FORM_PATH = "application.programs"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapProgramsToApi = (programs: Program[], data: Record<string, any>) => {
  if (Object.keys(data).length === 0) return []

  const savedPrograms = [] as ApplicationProgram[]
  Object.entries(data).forEach(([key, value]) => {
    const program = programs.find((item) => item.formMetadata?.key === key)
    let claimed = true
    const options = []

    if (value == "none") {
      claimed = false
      program?.formMetadata?.options.forEach((option) => {
        options.push({
          key: option.key,
          checked: false,
          extraData: [],
        })
      })
    } else {
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
    }

    savedPrograms.push({
      key,
      claimed,
      options,
    })
  })
  return savedPrograms
}

export const getProgramOptionName = (key: string, metaKey: string) => {
  return key === "preferNotToSay"
    ? "t.preferNotToSay"
    : `${PROGRAMS_FORM_PATH}.${metaKey}.${key}.label`
}

export const getProgramOptionDescription = (key: string, metaKey: string) => {
  return `${PROGRAMS_FORM_PATH}.${metaKey}.${key}.description`
}
