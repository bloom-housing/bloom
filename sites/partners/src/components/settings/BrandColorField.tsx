import React from "react"
import { Field, t } from "@bloom-housing/ui-components"
import { UseFormMethods } from "react-hook-form"
import { expandHex, HEX_COLOR } from "@bloom-housing/shared-helpers/src/utilities/brandRamp"
import { defaultFieldProps } from "../../lib/helpers"
import * as styles from "./BrandColorField.module.scss"

interface BrandColorFieldProps {
  name: string
  label: string
  value?: string
  derived?: string
  subNote?: string
  register: UseFormMethods["register"]
  setValue: UseFormMethods["setValue"]
  errors: UseFormMethods["errors"]
  clearErrors: UseFormMethods["clearErrors"]
}

const SIX_DIGIT_HEX = /^#[0-9A-Fa-f]{6}$/

// The swatch only accepts six digits, so #ABC has to be expanded.
export const swatchValue = (value?: string, derived?: string): string => {
  const shown = expandHex((value || derived || "").trim())
  return SIX_DIGIT_HEX.test(shown) ? shown : "#FFFFFF"
}

const BrandColorField = ({
  name,
  label,
  value,
  derived,
  subNote,
  register,
  setValue,
  errors,
  clearErrors,
}: BrandColorFieldProps) => {
  return (
    <Field
      {...defaultFieldProps(name, label, [], errors, clearErrors)}
      controlClassName={styles["brand-color-field__control"]}
      placeholder={derived || "#RRGGBB"}
      subNote={subNote}
      register={register}
      validation={{ pattern: HEX_COLOR }}
      errorMessage={errors?.[name] ? t("errors.brandColorError") : undefined}
      postInputContent={
        <input
          type="color"
          className={styles["brand-color-field__swatch"]}
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
