import {
  BrandDTO,
  BrandRadiusEnum,
  Jurisdiction,
  JurisdictionBrandUpdate,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  BrandRamp,
  completeRamp,
  HEX_COLOR,
} from "@bloom-housing/shared-helpers/src/utilities/brandRamp"

export const RAMP_SHADES = ["dark", "darker", "light", "lighter"] as const
export type RampShade = (typeof RAMP_SHADES)[number]
export type RampName = "primary" | "secondary"

export interface BrandFormValues {
  primaryBase: string
  primaryDark: string
  primaryDarker: string
  primaryLight: string
  primaryLighter: string
  secondaryBase: string
  secondaryDark: string
  secondaryDarker: string
  secondaryLight: string
  secondaryLighter: string
  fontFamily: string
  headingFontFamily: string
  serifFontFamily: string
  fontUrl: string
  buttonRadius: string
}

export const fieldName = (ramp: RampName, shade: RampShade | "base"): keyof BrandFormValues =>
  `${ramp}${shade.charAt(0).toUpperCase()}${shade.slice(1)}` as keyof BrandFormValues

const FONT_FIELDS = ["fontFamily", "headingFontFamily", "serifFontFamily", "fontUrl"] as const

const blank = (): BrandFormValues => ({
  primaryBase: "",
  primaryDark: "",
  primaryDarker: "",
  primaryLight: "",
  primaryLighter: "",
  secondaryBase: "",
  secondaryDark: "",
  secondaryDarker: "",
  secondaryLight: "",
  secondaryLighter: "",
  fontFamily: "",
  headingFontFamily: "",
  serifFontFamily: "",
  fontUrl: "",
  buttonRadius: "",
})

export const derivedShades = (base?: string): Partial<Record<RampShade, string>> => {
  if (!base || !HEX_COLOR.test(base)) return {}

  const complete = completeRamp({ base })
  return {
    dark: complete.dark,
    darker: complete.darker,
    light: complete.light,
    lighter: complete.lighter,
  }
}

const rampToValues = (values: BrandFormValues, ramp: RampName, stored?: BrandRamp) => {
  if (!stored?.base) return
  values[fieldName(ramp, "base")] = stored.base
  const derived = derivedShades(stored.base)
  RAMP_SHADES.forEach((shade) => {
    const value = stored[shade]
    values[fieldName(ramp, shade)] = value && value !== derived[shade] ? value : ""
  })
}

export const brandToFormValues = (jurisdiction?: Jurisdiction): BrandFormValues => {
  const values = blank()
  const brand = jurisdiction?.brand
  if (!brand) return values

  rampToValues(values, "primary", brand.primary as BrandRamp)
  rampToValues(values, "secondary", brand.secondary as BrandRamp)
  FONT_FIELDS.forEach((field) => {
    values[field] = brand[field] ?? ""
  })
  values.buttonRadius = brand.buttonRadius ?? ""
  return values
}

const rampFromValues = (values: BrandFormValues, ramp: RampName): BrandRamp | undefined => {
  const base = values[fieldName(ramp, "base")]?.trim()
  if (!base) return undefined

  const built: BrandRamp = { base }
  RAMP_SHADES.forEach((shade) => {
    const value = values[fieldName(ramp, shade)]?.trim()
    if (value) built[shade] = value
  })
  return built
}

export const hasBrandValues = (values: BrandFormValues): boolean =>
  !!rampFromValues(values, "primary") ||
  !!values.buttonRadius ||
  FONT_FIELDS.some((field) => !!values[field]?.trim())

export const brandFromValues = (values: BrandFormValues): BrandDTO | undefined => {
  if (!hasBrandValues(values)) return undefined

  const brand = { primary: rampFromValues(values, "primary") } as BrandDTO
  const secondary = rampFromValues(values, "secondary")
  if (secondary) brand.secondary = secondary as BrandDTO["secondary"]
  FONT_FIELDS.forEach((field) => {
    const value = values[field]?.trim()
    if (value) brand[field] = value
  })
  if (values.buttonRadius) brand.buttonRadius = values.buttonRadius as BrandRadiusEnum
  return brand
}

export const brandUpdateFrom = (
  values: BrandFormValues,
  assets: { logoFileId?: string | null; faviconFileId?: string | null; clearBrand?: boolean }
): JurisdictionBrandUpdate => {
  if (assets.clearBrand) {
    return { brand: null, logoFileId: null, faviconFileId: null }
  }

  const update: JurisdictionBrandUpdate = { brand: brandFromValues(values) }
  if (assets.logoFileId !== undefined) update.logoFileId = assets.logoFileId
  if (assets.faviconFileId !== undefined) update.faviconFileId = assets.faviconFileId
  return update
}

const FIELD_FOR_MESSAGE: Record<string, keyof BrandFormValues> = {
  fontFamily: "fontFamily",
  headingFontFamily: "headingFontFamily",
  serifFontFamily: "serifFontFamily",
  fontUrl: "fontUrl",
  buttonRadius: "buttonRadius",
}

export interface BrandErrors {
  fields: { name: keyof BrandFormValues; message: string }[]
  unplaced: string[]
}

export const brandErrorsFrom = (messages: unknown): BrandErrors => {
  const list = (Array.isArray(messages) ? messages : [messages]).filter(
    (message): message is string => typeof message === "string"
  )

  return list.reduce<BrandErrors>(
    (errors, message) => {
      const field = FIELD_FOR_MESSAGE[message.split(" ")[0]]
      if (field) {
        errors.fields.push({ name: field, message })
      } else {
        errors.unplaced.push(message)
      }
      return errors
    },
    { fields: [], unplaced: [] }
  )
}
