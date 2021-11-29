import { ApplicationProgram, Program } from "@bloom-housing/backend-core/types"

export const PROGRAMS_FORM_PATH = "application.programs"

export const mapProgramToApi = (program: Program, data: Record<string, any>) => {
  if (Object.keys(data).length === 0) {
    return {
      key: "",
      claimed: false,
      options: [],
    }
  }

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapProgramsToApi = (programs: Program[], data: Record<string, any>) => {
  if (Object.keys(data).length === 0) return []
  const savedPrograms = [] as ApplicationProgram[]
  Object.entries(data).forEach(([key, value]) => {
    const program = programs.find((item) => item.formMetadata?.key === key)
    if (!program) return

    const mappedProgram = mapProgramToApi(program, { [key]: value })
    if (mappedProgram.key) {
      savedPrograms.push(mappedProgram)
    }
  })
  return savedPrograms
}

// used in the paper apps only
export const mapApiToProgramsPaperForm = (programs: ApplicationProgram[]) => {
  const result = {}

  programs?.forEach((program) => {
    const key = program.key
    const selectedOption = program.options.find((item) => item.checked === true)?.key

    if (program.claimed) {
      Object.assign(result, { [key]: selectedOption })
    }
  })

  return result
}

export const getProgramOptionName = (key: string, metaKey: string) => {
  return key === "preferNotToSay"
    ? "t.preferNotToSay"
    : `${PROGRAMS_FORM_PATH}.${metaKey}.${key}.label`
}

export const getProgramOptionDescription = (key: string, metaKey: string) => {
  return `${PROGRAMS_FORM_PATH}.${metaKey}.${key}.description`
}
