import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Dropzone, Field, Select, t } from "@bloom-housing/ui-components"
import { Alert, Button, Card, Grid } from "@bloom-housing/ui-seeds"
import { BrandRadiusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../shared/SectionWithGrid"
import BrandColorField from "./BrandColorField"
import { fileUploader, FileUploadData } from "../../lib/helpers"
import { useUnsavedChangesWarning } from "../../lib/hooks"
import {
  BrandFormValues,
  derivedShades,
  fieldName,
  RampName,
  RAMP_SHADES,
} from "../../lib/branding"
import styles from "./BrandingForm.module.scss"

const NO_UPLOAD: FileUploadData = { id: "", url: "", fileId: "" }

export interface BrandingSubmission {
  values: BrandFormValues
  logoFileId?: string
  faviconFileId?: string
}

interface BrandingFormProps {
  defaultValues: BrandFormValues
  logoUrl?: string
  faviconUrl?: string
  isSaving: boolean
  unplacedErrors: string[]
  onSubmit: (
    submission: BrandingSubmission
  ) => Promise<{ name: keyof BrandFormValues; message: string }[]>
  onDirtyChange: (dirty: boolean) => void
  onDiscard: () => void
}

const BrandingForm = ({
  defaultValues,
  logoUrl,
  faviconUrl,
  isSaving,
  unplacedErrors,
  onSubmit,
  onDirtyChange,
  onDiscard,
}: BrandingFormProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, clearErrors, setError, setValue, watch, formState } =
    useForm<BrandFormValues>({ defaultValues })

  const [logo, setLogo] = useState<FileUploadData>(NO_UPLOAD)
  const [favicon, setFavicon] = useState<FileUploadData>(NO_UPLOAD)
  const [logoProgress, setLogoProgress] = useState(0)
  const [faviconProgress, setFaviconProgress] = useState(0)

  const dirty = formState.isDirty || !!logo.fileId || !!favicon.fileId
  useUnsavedChangesWarning(dirty, t("branding.unsavedChangesWarning"))
  React.useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange])

  const uploaderFor =
    (setData: (data: FileUploadData) => void, setProgress: (value: number) => void) =>
    async (file: File) => {
      await fileUploader({
        file,
        setFileUploadData: setData as never,
        setProgressValue: setProgress as never,
        contentType: file.type,
        contentDisposition: "inline",
      })
    }

  const submit = async (values: BrandFormValues) => {
    const fieldErrors = await onSubmit({
      values,
      logoFileId: logo.fileId || undefined,
      faviconFileId: favicon.fileId || undefined,
    })
    fieldErrors.forEach(({ name, message }) => setError(name, { message }))
  }

  const rampSection = (ramp: RampName, label: string) => {
    const base = watch(fieldName(ramp, "base"))
    const derived = derivedShades(base)

    return (
      <SectionWithGrid heading={label}>
        <Grid.Row columns={3}>
          <Grid.Cell>
            <BrandColorField
              name={fieldName(ramp, "base")}
              label={t("branding.baseColor")}
              value={base}
              subNote={t("branding.colorPickerNote")}
              required={ramp === "primary"}
              register={register}
              setValue={setValue}
              errors={errors}
              clearErrors={clearErrors}
            />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row columns={4}>
          {RAMP_SHADES.map((shade) => (
            <Grid.Cell key={shade}>
              <BrandColorField
                name={fieldName(ramp, shade)}
                label={t(`branding.shade.${shade}`)}
                value={watch(fieldName(ramp, shade))}
                derived={derived[shade]}
                register={register}
                setValue={setValue}
                errors={errors}
                clearErrors={clearErrors}
              />
            </Grid.Cell>
          ))}
        </Grid.Row>
      </SectionWithGrid>
    )
  }

  return (
    <form onSubmit={handleSubmit(submit)} className={styles["branding-form"]}>
      {!!unplacedErrors.length && <Alert variant="alert">{unplacedErrors.join(" ")}</Alert>}

      <Card>
        <Card.Section>
          {rampSection("primary", t("branding.primary"))}
          {rampSection("secondary", t("branding.secondary"))}

          <SectionWithGrid heading={t("branding.typography")}>
            <Grid.Row columns={2}>
              <Grid.Cell>
                <Field
                  id="fontFamily"
                  name="fontFamily"
                  label={t("branding.fontFamily")}
                  subNote={t("branding.fontFamilyNote")}
                  register={register}
                  error={!!errors?.fontFamily}
                  errorMessage={errors?.fontFamily?.message}
                />
              </Grid.Cell>
              <Grid.Cell>
                <Field
                  id="headingFontFamily"
                  name="headingFontFamily"
                  label={t("branding.headingFontFamily")}
                  register={register}
                  error={!!errors?.headingFontFamily}
                  errorMessage={errors?.headingFontFamily?.message}
                />
              </Grid.Cell>
              <Grid.Cell>
                <Field
                  id="serifFontFamily"
                  name="serifFontFamily"
                  label={t("branding.serifFontFamily")}
                  register={register}
                  error={!!errors?.serifFontFamily}
                  errorMessage={errors?.serifFontFamily?.message}
                />
              </Grid.Cell>
              <Grid.Cell>
                <Field
                  id="fontUrl"
                  name="fontUrl"
                  type="url"
                  label={t("branding.fontUrl")}
                  subNote={t("branding.fontUrlNote")}
                  register={register}
                  error={!!errors?.fontUrl}
                  // Field registers its own https and invalid checks for type=url, and neither
                  // sets a message. A server rejection does, so that wins.
                  errorMessage={
                    errors?.fontUrl?.message ||
                    (errors?.fontUrl?.type === "https"
                      ? t("errors.urlHttpsError")
                      : t("errors.urlError"))
                  }
                />
              </Grid.Cell>
            </Grid.Row>
          </SectionWithGrid>

          <SectionWithGrid heading={t("branding.components")}>
            <Grid.Row columns={2}>
              <Grid.Cell>
                <Select
                  id="buttonRadius"
                  name="buttonRadius"
                  label={t("branding.buttonRadius")}
                  register={register}
                  keyPrefix="branding.radius"
                  options={["", ...Object.values(BrandRadiusEnum)]}
                />
              </Grid.Cell>
            </Grid.Row>
          </SectionWithGrid>

          <SectionWithGrid heading={t("branding.assets")}>
            <Grid.Row columns={2}>
              <Grid.Cell>
                <Dropzone
                  id="brand-logo-upload"
                  label={t("branding.logo")}
                  helptext={t("branding.logoNote")}
                  uploader={uploaderFor(setLogo, setLogoProgress)}
                  accept="image/png,image/svg+xml,image/webp"
                  progress={logoProgress}
                />
                {(logo.url || logoUrl) && (
                  <img
                    className={styles["asset-preview"]}
                    src={logo.url || logoUrl}
                    alt={t("branding.logo")}
                  />
                )}
              </Grid.Cell>
              <Grid.Cell>
                <Dropzone
                  id="brand-favicon-upload"
                  label={t("branding.favicon")}
                  helptext={t("branding.faviconNote")}
                  uploader={uploaderFor(setFavicon, setFaviconProgress)}
                  accept="image/png"
                  progress={faviconProgress}
                />
                {(favicon.url || faviconUrl) && (
                  <img
                    className={styles["asset-preview"]}
                    src={favicon.url || faviconUrl}
                    alt={t("branding.favicon")}
                  />
                )}
              </Grid.Cell>
            </Grid.Row>
          </SectionWithGrid>
        </Card.Section>
      </Card>

      <div className={styles["actions"]}>
        <Button type="submit" variant="primary" disabled={isSaving}>
          {t("t.save")}
        </Button>
        <Button type="button" variant="primary-outlined" onClick={onDiscard} disabled={!dirty}>
          {t("t.discard")}
        </Button>
      </div>
    </form>
  )
}

export default BrandingForm
