import {
  ApplicationProgram,
  InputType,
  Program,
  FormMetadataOptions,
} from "@bloom-housing/backend-core/types"

export const PROGRAMS_FORM_PATH = "application.programs.options"
export const PROGRAMS_NONE_FORM_PATH = "application.programs.none"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapProgramsToApi = (data: Record<string, any>) => {
  if (!data.application?.programs) return []

  const CLAIMED_KEY = "claimed"

  const programsFormData = data.application.programs.options

  const keys = Object.keys(programsFormData)

  return keys.map((key) => {
    const currentProgram = programsFormData[key]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentProgramValues = Object.values(currentProgram) as Record<string, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const claimed = currentProgramValues.map((c: { claimed: any }) => c.claimed).includes(true)

    const options = Object.keys(currentProgram).map((option) => {
      const currentOption = currentProgram[option]

      // count keys except claimed
      const extraKeys = Object.keys(currentOption).filter((item) => item !== CLAIMED_KEY)

      const response = {
        key: option,
        checked: currentOption[CLAIMED_KEY],
      }

      // assign extra data and detect data type
      if (extraKeys.length) {
        const extraData = extraKeys.map((extraKey) => {
          const type = (() => {
            if (typeof currentOption[extraKey] === "boolean") return InputType.boolean
            // if object includes "city" property, it should be an address
            if (Object.keys(currentOption[extraKey]).includes("city")) return InputType.address

            return InputType.text
          })()

          return {
            key: extraKey,
            type,
            value: currentOption[extraKey],
          }
        })

        Object.assign(response, { extraData })
      } else {
        Object.assign(response, { extraData: [] })
      }

      return response
    })

    return {
      key,
      claimed,
      options,
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapApiToProgramsForm = (programs: ApplicationProgram[]) => {
  const programsFormData = {}

  programs.forEach((item) => {
    const options = item.options.reduce((acc, curr) => {
      // extraData which comes from the API is an array, in the form we expect an object
      const extraData =
        curr?.extraData?.reduce((extraAcc, extraCurr) => {
          // value - it can be string or nested address object
          const value = extraCurr.value
          Object.assign(extraAcc, {
            [extraCurr.key]: value,
          })

          return extraAcc
        }, {}) || {}

      // each form option has "claimed" property - it's "checked" property in the API
      const claimed = curr.checked

      Object.assign(acc, {
        [curr.key]: {
          claimed,
          ...extraData,
        },
      })
      return acc
    }, {})

    Object.assign(programsFormData, {
      [item.key]: options,
    })
  })

  const noneValues = programs.reduce((acc, item) => {
    const isClaimed = item.claimed

    Object.assign(acc, {
      [`${item.key}-none`]: !isClaimed,
    })

    return acc
  }, {})

  return { options: programsFormData, none: noneValues }
}

/*
  It generates checkbox name in proper prefrences structure
*/
export const getProgramOptionName = (key: string, metaKey: string, noneOption?: boolean) => {
  if (noneOption) return getExclusiveProgramOptionName(key)
  else return getNormalProgramOptionName(metaKey, key)
}

export const getNormalProgramOptionName = (metaKey: string, key: string) => {
  return `${PROGRAMS_FORM_PATH}.${metaKey}.${key}.claimed`
}

export const getExclusiveProgramOptionName = (key: string | undefined) => {
  return `${PROGRAMS_NONE_FORM_PATH}.${key}-none`
}

export type ExclusiveKey = {
  optionKey: string
  programKey: string | undefined
}
/*
  Create an array of all exclusive keys from a program set
*/
export const getExclusiveKeys = (programs: Program[]) => {
  const exclusive: ExclusiveKey[] = []
  programs?.forEach((program) => {
    program?.formMetadata?.options.forEach((option: FormMetadataOptions) => {
      if (option.exclusive)
        exclusive.push({
          optionKey: getProgramOptionName(option.key, program?.formMetadata?.key ?? ""),
          programKey: program?.formMetadata?.key,
        })
    })
    if (!program?.formMetadata?.hideGenericDecline)
      exclusive.push({
        optionKey: getExclusiveProgramOptionName(program?.formMetadata?.key),
        programKey: program?.formMetadata?.key,
      })
  })
  return exclusive
}

const uncheckProgram = (
  metaKey: string,
  options: FormMetadataOptions[] | undefined,
  setValue: (key: string, value: boolean) => void
) => {
  options?.forEach((option) => {
    setValue(getProgramOptionName(option.key, metaKey), false)
  })
}

/*
  Set the value of an exclusive checkbox, unchecking all the appropriate boxes in response to the value
*/
export const setExclusive = (
  value: boolean,
  setValue: (key: string, value: boolean) => void,
  exclusiveKeys: ExclusiveKey[],
  key: string,
  program: Program
) => {
  if (value) {
    // Uncheck all other keys if setting an exclusive key to true
    uncheckProgram(program?.formMetadata?.key ?? "", program?.formMetadata?.options, setValue)
    setValue(key ?? "", true)
  } else {
    // Uncheck all exclusive keys if setting a normal key to true
    exclusiveKeys.forEach((thisKey) => {
      if (thisKey.programKey === program?.formMetadata?.key) setValue(thisKey.optionKey, false)
    })
  }
}
