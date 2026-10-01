import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog, Heading } from "@bloom-housing/ui-seeds"
import {
  ContentTransferPreview,
  SiteEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

const SITE_LABELS: Record<SiteEnum, string> = {
  [SiteEnum.public]: "translations.sitePublic",
  [SiteEnum.partners]: "translations.sitePartners",
  [SiteEnum.email]: "translations.siteEmail",
}

type ContentTransferPreviewDialogProps = {
  preview: ContentTransferPreview | null
  imageCount: number
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ContentTransferPreviewDialog = ({
  preview,
  imageCount,
  isLoading,
  onClose,
  onConfirm,
}: ContentTransferPreviewDialogProps) => {
  const brand = preview?.brand
  const brandChanged = !!brand && (brand.fields.length > 0 || !!brand.logo || !!brand.favicon)

  return (
    <Dialog
      isOpen={!!preview}
      onClose={onClose}
      ariaLabelledBy="content-transfer-header"
      ariaDescribedBy="content-transfer-description"
    >
      <Dialog.Header id="content-transfer-header">{t("transfer.reviewTitle")}</Dialog.Header>
      {preview && (
        <Dialog.Content>
          <p id="content-transfer-description">
            {preview.jurisdictionName
              ? t("transfer.replacesJurisdiction", { jurisdiction: preview.jurisdictionName })
              : t("transfer.replacesGlobal")}
          </p>
          {imageCount > 0 && <p>{t("transfer.imageCount", { smart_count: imageCount })}</p>}

          <Heading priority={3} size="lg">
            {t("transfer.strings")}
          </Heading>
          {preview.translations.length ? (
            <table data-testid="transfer-string-changes">
              <thead>
                <tr>
                  <th>{t("transfer.site")}</th>
                  <th>{t("transfer.language")}</th>
                  <th>{t("transfer.added")}</th>
                  <th>{t("transfer.changed")}</th>
                  <th>{t("transfer.removed")}</th>
                </tr>
              </thead>
              <tbody>
                {preview.translations.map((row) => (
                  <tr key={`${row.site}|${row.language}`}>
                    <td>{row.site ? t(SITE_LABELS[row.site]) : ""}</td>
                    <td>{t(`languages.${row.language}`)}</td>
                    <td>{row.added}</td>
                    <td>{row.changed}</td>
                    <td>{row.removed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>{t("transfer.noStringChanges")}</p>
          )}

          {preview.jurisdictionName && (
            <>
              <Heading priority={3} size="lg">
                {t("transfer.content")}
              </Heading>
              {preview.content.length ? (
                <ul data-testid="transfer-content-changes">
                  {preview.content.map((row) => (
                    <li key={row.language}>
                      {`${t(`languages.${row.language}`)}: ${t(`transfer.change.${row.change}`)}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{t("transfer.noContentChanges")}</p>
              )}

              <Heading priority={3} size="lg">
                {t("transfer.brand")}
              </Heading>
              {brandChanged ? (
                <ul data-testid="transfer-brand-changes">
                  {brand.fields.length > 0 && (
                    <li>{t("transfer.brandFields", { fields: brand.fields.join(", ") })}</li>
                  )}
                  {brand.logo && (
                    <li>{t("transfer.logo", { change: t(`transfer.change.${brand.logo}`) })}</li>
                  )}
                  {brand.favicon && (
                    <li>
                      {t("transfer.favicon", { change: t(`transfer.change.${brand.favicon}`) })}
                    </li>
                  )}
                </ul>
              ) : (
                <p>{t("transfer.noBrandChanges")}</p>
              )}
            </>
          )}
        </Dialog.Content>
      )}
      <Dialog.Footer>
        <Button variant="primary" onClick={onConfirm} loadingMessage={isLoading && t("t.loading")}>
          {t("transfer.import")}
        </Button>
        <Button variant="primary-outlined" onClick={onClose} disabled={isLoading}>
          {t("t.cancel")}
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}
