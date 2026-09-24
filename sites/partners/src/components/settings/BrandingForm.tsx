import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Dropzone, Field, Select, t } from "@bloom-housing/ui-components"
import { Button, Card, Dialog, Grid } from "@bloom-housing/ui-seeds"
import { BrandRadiusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../shared/SectionWithGrid"
import BrandColorField from "./BrandColorField"
import BrandColorWarning from "./BrandColorWarning"
import BrandPreview from "./BrandPreview"
import { fileUploader, FileUploadData } from "../../lib/helpers"
import { useUnsavedChangesWarning } from "../../lib/hooks"
import {
  BrandFormValues,
  derivedShades,
  fieldName,
  PREVIEW_FIELDS,
  RampName,
  RAMP_SHADES,
} from "../../lib/branding"
import styles from "./BrandingForm.module.scss"

// An absent fileId means the admin did not touch the asset, a string is a new upload, and null is
// a removal. The api reads the three the same way.
interface AssetChange {
  fileId?: string | null
  url?: string
}

export interface BrandingSubmission {
  values: BrandFormValues
  logoFileId?: string | null
  faviconFileId?: string | null
  clearBrand?: boolean
}

interface BrandingFormProps {
  defaultValues: BrandFormValues
  logoUrl?: string
  faviconUrl?: string
  isSaving: boolean
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
  onSubmit,
  onDirtyChange,
  onDiscard,
}: BrandingFormProps) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors, clearErrors, setError, setValue, watch, formState } =
    useForm<BrandFormValues>({ defaultValues })

  const [logo, setLogo] = useState<AssetChange>({})
  const [favicon, setFavicon] = useState<AssetChange>({})
  const [logoProgress, setLogoProgress] = useState(0)
  const [faviconProgress, setFaviconProgress] = useState(0)
  const [confirmingRemoval, setConfirmingRemoval] = useState(false)

  const dirty = formState.isDirty || logo.fileId !== undefined || favicon.fileId !== undefined

  const uploading = [logoProgress, faviconProgress].some(
    (progress) => progress > 0 && progress < 100
  )

  useUnsavedChangesWarning(dirty, t("branding.unsavedChangesWarning"))
  React.useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange])

  const uploaderFor =
    (setChange: (change: AssetChange) => void, setProgress: (value: number) => void) =>
    async (file: File) => {
      await fileUploader({
        file,
        setFileUploadData: ((data: FileUploadData) => {
          if (data.fileId) setChange({ fileId: data.fileId, url: data.url })
        }) as never,
        setProgressValue: setProgress as never,
        contentType: file.type,
        contentDisposition: "inline",
      })
    }

  const submit = async (values: BrandFormValues) => {
    const fieldErrors = await onSubmit({
      values,
      logoFileId: logo.fileId,
      faviconFileId: favicon.fileId,
    })
    fieldErrors.forEach(({ name, message }) => setError(name, { message }))
  }

  const removeBranding = async () => {
    setConfirmingRemoval(false)
    await onSubmit({ values: defaultValues, clearBrand: true })
  }

  const assetField = ({
    id,
    label,
    helptext,
    accept,
    change,
    setChange,
    progress,
    setProgress,
    storedUrl,
  }: {
    id: string
    label: string
    helptext: string
    accept: string
    change: AssetChange
    setChange: (change: AssetChange) => void
    progress: number
    setProgress: (value: number) => void
    storedUrl?: string
  }) => {
    const shown = change.fileId === null ? undefined : change.url || storedUrl

    return (
      <>
        <Dropzone
          id={id}
          label={label}
          helptext={helptext}
          uploader={uploaderFor(setChange, setProgress)}
          accept={accept}
          progress={progress}
        />
        {shown && (
          <div className={styles["asset"]}>
            <img className={styles["asset-preview"]} src={shown} alt={label} />
            <Button
              type="button"
              variant="alert-outlined"
              size="sm"
              onClick={() => setChange({ fileId: null })}
              id={`${id}-delete`}
            >
              {t("t.delete")}
            </Button>
          </div>
        )}
      </>
    )
  }

  const applyColor = (field: keyof BrandFormValues, hex: string) =>
    setValue(field, hex, { shouldDirty: true, shouldValidate: true })

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
              register={register}
              setValue={setValue}
              errors={errors}
              clearErrors={clearErrors}
            />
          </Grid.Cell>
        </Grid.Row>
        <BrandColorWarning
          value={base}
          shade="base"
          fieldLabel={t("branding.baseColor")}
          testId={fieldName(ramp, "base")}
          onApply={(hex) => applyColor(fieldName(ramp, "base"), hex)}
        />
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
        {RAMP_SHADES.map((shade) => (
          <BrandColorWarning
            key={shade}
            value={watch(fieldName(ramp, shade))}
            shade={shade}
            fieldLabel={t(`branding.shade.${shade}`)}
            derived={derived[shade]}
            testId={fieldName(ramp, shade)}
            onApply={(hex) => applyColor(fieldName(ramp, shade), hex)}
          />
        ))}
      </SectionWithGrid>
    )
  }

  return (
    <form onSubmit={handleSubmit(submit)} className={styles["branding-form"]}>
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
                {assetField({
                  id: "brand-logo-upload",
                  label: t("branding.logo"),
                  helptext: t("branding.logoNote"),
                  accept: "image/png,image/svg+xml,image/webp",
                  change: logo,
                  setChange: setLogo,
                  progress: logoProgress,
                  setProgress: setLogoProgress,
                  storedUrl: logoUrl,
                })}
              </Grid.Cell>
              <Grid.Cell>
                {assetField({
                  id: "brand-favicon-upload",
                  label: t("branding.favicon"),
                  helptext: t("branding.faviconNote"),
                  accept: "image/png",
                  change: favicon,
                  setChange: setFavicon,
                  progress: faviconProgress,
                  setProgress: setFaviconProgress,
                  storedUrl: faviconUrl,
                })}
              </Grid.Cell>
            </Grid.Row>
          </SectionWithGrid>
        </Card.Section>
      </Card>

      <BrandPreview values={watch(PREVIEW_FIELDS)} />

      <div className={styles["actions"]}>
        <Button type="submit" variant="primary" disabled={isSaving || uploading}>
          {t("t.save")}
        </Button>
        <Button type="button" variant="primary-outlined" onClick={onDiscard} disabled={!dirty}>
          {t("t.discard")}
        </Button>
        <Button
          type="button"
          variant="alert-outlined"
          onClick={() => setConfirmingRemoval(true)}
          disabled={isSaving || uploading}
        >
          {t("branding.remove")}
        </Button>
      </div>

      <Dialog
        isOpen={confirmingRemoval}
        onClose={() => setConfirmingRemoval(false)}
        ariaLabelledBy="branding-remove-header"
      >
        <Dialog.Header id="branding-remove-header">{t("branding.remove")}</Dialog.Header>
        <Dialog.Content>{t("branding.removeDescription")}</Dialog.Content>
        <Dialog.Footer>
          <Button variant="alert" onClick={removeBranding} size="sm">
            {t("branding.remove")}
          </Button>
          <Button variant="primary-outlined" onClick={() => setConfirmingRemoval(false)} size="sm">
            {t("t.cancel")}
          </Button>
        </Dialog.Footer>
      </Dialog>
    </form>
  )
}

export default BrandingForm
