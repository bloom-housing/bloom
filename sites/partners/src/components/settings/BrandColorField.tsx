import React from "react"
import { Field, t } from "@bloom-housing/ui-components"
import { UseFormMethods } from "react-hook-form"
import { HEX_COLOR } from "@bloom-housing/shared-helpers/src/utilities/brandRamp"
import * as styles from "./BrandColorField.module.scss"

interface BrandColorFieldProps {
  name: string
  label: string
  value?: string
  derived?: string
  required?: boolean
  register: UseFormMethods["register"]
  setValue: UseFormMethods["setValue"]
  errors: UseFormMethods["errors"]
  clearErrors: UseFormMethods["clearErrors"]
}

const SIX_DIGIT_HEX = /^#[0-9A-Fa-f]{6}$/

// The swatch only accepts six digits, so #ABC has to be expanded.
const expandHex = (value: string): string =>
  /^#[0-9A-Fa-f]{3}$/.test(value)
    ? `#${value
        .slice(1)
        .split("")
        .map((digit) => digit + digit)
        .join("")}`
    : value

export const swatchValue = (value?: string, derived?: string): string => {
  const shown = expandHex((value || derived || "").trim())
  return SIX_DIGIT_HEX.test(shown) ? shown : "#FFFFFF"
}

const BrandColorField = ({
  name,
  label,
  value,
  derived,
  required,
  register,
  setValue,
  errors,
  clearErrors,
}: BrandColorFieldProps) => {
  const error = !!errors?.[name]

  return (
    <Field
      id={name}
      name={name}
      label={label}
      placeholder={derived}
      register={register}
      validation={{ required, pattern: HEX_COLOR }}
      error={error}
      errorMessage={error ? t("errors.brandColorError") : undefined}
      inputProps={{
        onChange: () => error && clearErrors(name),
        "aria-required": !!required,
      }}
      postInputContent={
        <input
          type="color"
          className={styles["brand-color-field__swatch"]}
          // The api uppercases on save, so matching it here keeps a reload from looking dirty.
          onChange={(event) =>
            setValue(name, event.target.value.toUpperCase(), { shouldDirty: true })
          }
          value={swatchValue(value, derived)}
          aria-label={t("branding.colorSwatchLabel", { field: label })}
          data-testid={`${name}-swatch`}
        />
      }
    />
  )
}

export default BrandColorField
