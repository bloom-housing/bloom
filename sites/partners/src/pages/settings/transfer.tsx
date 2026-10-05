import React, { useContext, useMemo, useRef, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import dayjs from "dayjs"
import { Dropzone, Select, t } from "@bloom-housing/ui-components"
import { Button, Card, Heading } from "@bloom-housing/ui-seeds"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import {
  ContentTransferAsset,
  ContentTransferFile,
  ContentTransferImport,
  ContentTransferPreview,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { TabView } from "@bloom-housing/shared-helpers/src/views/components/TabView"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import { useSettingsTabs, SettingsIndexEnum } from "../../components/settings/SettingsViewHelpers"
import { ContentTransferPreviewDialog } from "../../components/settings/ContentTransferPreviewDialog"
import { fileUploader, FileUploadData } from "../../lib/helpers"

const GLOBAL_SCOPE = "global"

const TRANSFER_FLAGS: string[] = [
  FeatureFlagEnum.enableDbDrivenContent,
  FeatureFlagEnum.enableDbDrivenBranding,
]

const IMAGE_TYPES = ["image/png", "image/svg+xml", "image/webp"]
const FAVICON_TYPES = ["image/png"]

class ImageError extends Error {}

class UploadError extends Error {
  constructor(readonly fileId: string) {
    super(`${fileId} did not upload`)
  }
}

const imagesToUpload = (file: ContentTransferFile): ContentTransferAsset[] => {
  const keys = [
    file.brand?.logoFileId,
    file.brand?.faviconFileId,
    ...(file.content ?? []).map(
      (row) => (row.footer as { logo?: { logoFileId?: string } } | null)?.logo?.logoFileId
    ),
  ].filter((key): key is string => !!key)

  return [...new Set(keys)].map((key) => {
    const asset = (file.assets ?? []).find((candidate) => candidate.fileId === key)
    if (!asset) throw new ImageError(t("transfer.missingImage", { fileId: key }))
    const types = key === file.brand?.faviconFileId ? FAVICON_TYPES : IMAGE_TYPES
    if (!types.includes(asset.contentType)) {
      throw new ImageError(t("transfer.imageType", { fileId: key }))
    }
    return asset
  })
}

const withoutAssets = (file: ContentTransferFile): ContentTransferImport => {
  const { assets, exportedAt, ...rest } = file
  void assets
  void exportedAt
  return rest
}

const readText = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })

const uploadAsset = (asset: ContentTransferAsset) =>
  new Promise<string>((resolve, reject) => {
    const bytes = Uint8Array.from(atob(asset.data), (char) => char.charCodeAt(0))
    const file = new File([bytes], asset.fileId.split("/").pop() || "file", {
      type: asset.contentType,
    })
    fileUploader({
      file,
      setFileUploadData: ((data: FileUploadData) =>
        data.fileId ? resolve(data.fileId) : reject(new UploadError(asset.fileId))) as never,
      setProgressValue: ((value: number) => {
        if (value === 0) reject(new UploadError(asset.fileId))
      }) as never,
      contentType: asset.contentType,
      contentDisposition: "inline",
    }).catch(() => reject(new UploadError(asset.fileId)))
  })

const errorMessage = (caught: unknown) => {
  if (caught instanceof UploadError) return t("transfer.uploadFailed", { fileId: caught.fileId })
  const message = (caught as { response?: { data?: { message?: unknown } } })?.response?.data
    ?.message
  if (Array.isArray(message)) return message.join(" ")
  return typeof message === "string" ? message : t("errors.alert.badRequest")
}

const SettingsTransfer = () => {
  const router = useRouter()
  const { addToast } = useContext(MessageContext)
  const { profile, contentTransferService } = useContext(AuthContext)
  const { enableContent, enableBranding, hideTabs, tabs } = useSettingsTabs(
    SettingsIndexEnum.transfer
  )

  const authorized = (enableContent || enableBranding) && !!profile?.userRoles?.isAdmin

  const jurisdictions = useMemo(
    () =>
      (profile?.jurisdictions ?? []).filter((jurisdiction) =>
        jurisdiction.featureFlags?.some((flag) => TRANSFER_FLAGS.includes(flag.name) && flag.active)
      ),
    [profile?.jurisdictions]
  )

  const [scope, setScope] = useState("")
  const [exporting, setExporting] = useState(false)
  const [pending, setPending] = useState<{
    file: ContentTransferFile
    preview: ContentTransferPreview
    images: ContentTransferAsset[]
  } | null>(null)
  const [importing, setImporting] = useState(false)
  const uploadedKeys = useRef<Record<string, string>>({})
  const latestReview = useRef(0)
  const importInProgress = useRef(false)

  const activeScope = scope || jurisdictions[0]?.id || GLOBAL_SCOPE

  const runExport = async () => {
    setExporting(true)
    try {
      const file =
        activeScope === GLOBAL_SCOPE
          ? await contentTransferService.exportGlobal()
          : await contentTransferService.exportJurisdiction({ jurisdictionId: activeScope })
      const url = window.URL.createObjectURL(
        new Blob([JSON.stringify(file, null, 2)], { type: "application/json" })
      )
      const name = (file.jurisdictionName ?? GLOBAL_SCOPE)
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "")
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${name}-content-${dayjs().format("YYYY-MM-DD")}.json`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      // Some browsers start the download after the click returns.
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000)
    } catch (caught) {
      addToast(errorMessage(caught), { variant: "alert" })
    } finally {
      setExporting(false)
    }
  }

  const reviewFile = async (upload: File) => {
    const review = ++latestReview.current
    let file: ContentTransferFile
    try {
      file = JSON.parse(await readText(upload)) as ContentTransferFile
    } catch {
      addToast(t("transfer.invalidFile"), { variant: "alert" })
      return
    }
    try {
      const images = imagesToUpload(file)
      const preview = await contentTransferService.previewImport({ body: withoutAssets(file) })
      if (review !== latestReview.current) return
      uploadedKeys.current = {}
      setPending({ file, preview, images })
    } catch (caught) {
      addToast(caught instanceof ImageError ? caught.message : errorMessage(caught), {
        variant: "alert",
      })
    }
  }

  const runImport = async () => {
    importInProgress.current = true
    setImporting(true)
    try {
      for (const image of pending.images) {
        if (!uploadedKeys.current[image.fileId]) {
          uploadedKeys.current[image.fileId] = await uploadAsset(image)
        }
      }
      await contentTransferService.applyImport({
        body: { ...withoutAssets(pending.file), fileIds: { ...uploadedKeys.current } },
      })
      setPending(null)
      addToast(t("transfer.imported"), { variant: "success" })
    } catch (caught) {
      addToast(errorMessage(caught), { variant: "alert" })
    } finally {
      importInProgress.current = false
      setImporting(false)
    }
  }

  if (!authorized) {
    void router.push("/unauthorized")
    return null
  }

  return (
    <Layout>
      <Head>
        <title>
          {`${t("t.settings")} - ${t("settings.transfer")} - ${t("nav.siteTitlePartners")}`}
        </title>
      </Head>
      <NavigationHeader className="relative" title={t("t.settings")} />
      <TabView hideTabs={hideTabs} tabs={tabs}>
        <Card className="seeds-m-be-6">
          <Card.Header>
            <Heading priority={2} size="xl">
              {t("transfer.exportTitle")}
            </Heading>
          </Card.Header>
          <Card.Section>
            <p className="seeds-m-be-4">{t("transfer.exportNote")}</p>
            <Select
              id="transferScope"
              name="transferScope"
              label={t("transfer.exportScope")}
              defaultValue={activeScope}
              options={[
                ...jurisdictions.map((jurisdiction) => ({
                  value: jurisdiction.id,
                  label: jurisdiction.name,
                })),
                { value: GLOBAL_SCOPE, label: t("transfer.globalStrings") },
              ]}
              inputProps={{
                onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
                  setScope(event.target.value),
              }}
            />
            <Button
              variant="primary"
              onClick={() => void runExport()}
              loadingMessage={exporting && t("t.loading")}
            >
              {t("transfer.export")}
            </Button>
          </Card.Section>
        </Card>

        <Card>
          <Card.Header>
            <Heading priority={2} size="xl">
              {t("transfer.importTitle")}
            </Heading>
          </Card.Header>
          <Card.Section>
            <p className="seeds-m-be-4">{t("transfer.importNote")}</p>
            <Dropzone
              id="transfer-import-file"
              label={t("transfer.importFile")}
              uploader={(upload) => void reviewFile(upload)}
              accept="application/json,.json"
            />
          </Card.Section>
        </Card>

        <ContentTransferPreviewDialog
          preview={pending?.preview ?? null}
          imageCount={pending?.images.length ?? 0}
          isLoading={importing}
          onClose={() => {
            if (!importInProgress.current) setPending(null)
          }}
          onConfirm={() => void runImport()}
        />
      </TabView>
    </Layout>
  )
}

export default SettingsTransfer
