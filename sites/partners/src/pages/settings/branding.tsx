import React, { useCallback, useContext, useMemo, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { useSWRConfig } from "swr"
import { Select, t, useMutate } from "@bloom-housing/ui-components"
import { Alert } from "@bloom-housing/ui-seeds"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { TabView } from "@bloom-housing/shared-helpers/src/views/components/TabView"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import { useSettingsTabs, SettingsIndexEnum } from "../../components/settings/SettingsViewHelpers"
import BrandingForm, { BrandingSubmission } from "../../components/settings/BrandingForm"
import { useJurisdiction } from "../../lib/hooks"
import { brandErrorsFrom, brandToFormValues, brandUpdateFrom } from "../../lib/branding"
import styles from "./branding.module.scss"

const SettingsBranding = () => {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const { addToast } = useContext(MessageContext)
  const { mutate: saveBrand, isLoading: isSaving } = useMutate()
  const { profile, jurisdictionsService } = useContext(AuthContext)
  const { enableBranding, hideTabs, tabs } = useSettingsTabs(SettingsIndexEnum.branding)

  const authorized = enableBranding && !!profile?.userRoles?.isAdmin

  const jurisdictions = useMemo(
    () =>
      (profile?.jurisdictions ?? []).filter((jurisdiction) =>
        jurisdiction.featureFlags?.some(
          (flag) => flag.name === FeatureFlagEnum.enableDbDrivenBranding && flag.active
        )
      ),
    [profile?.jurisdictions]
  )

  const [jurisdictionId, setJurisdictionId] = useState("")
  const [resetCount, setResetCount] = useState(0)
  const [dirty, setDirty] = useState(false)

  const activeJurisdictionId = jurisdictionId || jurisdictions[0]?.id || ""
  const {
    data: jurisdiction,
    cacheKey,
    error,
  } = useJurisdiction(authorized ? activeJurisdictionId : "")

  const discard = useCallback(() => {
    setResetCount((count) => count + 1)
  }, [])

  const save = ({ values, logoFileId, faviconFileId, clearBrand }: BrandingSubmission) => {
    return new Promise<{ name: keyof ReturnType<typeof brandToFormValues>; message: string }[]>(
      (resolve) =>
        void saveBrand(async () => {
          try {
            const updated = await jurisdictionsService.updateBrand({
              jurisdictionId: activeJurisdictionId,
              body: brandUpdateFrom(values, { logoFileId, faviconFileId, clearBrand }),
            })
            // The read endpoint is cacheable, so the response seeds the cache rather than a refetch.
            void mutate(cacheKey, updated, false)
            discard()
            addToast(t("branding.alertSaved"), { variant: "success" })
            resolve([])
          } catch (caught) {
            const response = (caught as { response?: { data?: { message?: unknown } } })?.response
            const { fields, unplaced } = brandErrorsFrom(response?.data?.message)
            if (unplaced.length) {
              addToast(unplaced.join(" "), { variant: "alert" })
            } else if (!fields.length) {
              addToast(t("errors.alert.badRequest"), { variant: "alert" })
            }
            resolve(fields)
          }
        })
    )
  }

  if (!authorized) {
    void router.push("/unauthorized")
    return null
  }

  return (
    <Layout>
      <Head>
        <title>
          {`${t("t.settings")} - ${t("settings.branding")} - ${t("nav.siteTitlePartners")}`}
        </title>
      </Head>
      <NavigationHeader className="relative" title={t("t.settings")} />
      <TabView hideTabs={hideTabs} tabs={tabs}>
        <div className={styles["toolbar"]}>
          <Select
            id="brandingJurisdiction"
            name="brandingJurisdiction"
            label={t("t.jurisdiction")}
            defaultValue={activeJurisdictionId}
            disabled={jurisdictions.length < 2 || dirty}
            options={jurisdictions.map((option) => ({ value: option.id, label: option.name }))}
            inputProps={{
              onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
                setJurisdictionId(event.target.value)
                discard()
              },
            }}
          />
        </div>

        {error && <Alert variant="alert">{t("branding.alertLoadFailed")}</Alert>}

        {jurisdiction && (
          <BrandingForm
            key={`${activeJurisdictionId}|${resetCount}`}
            defaultValues={brandToFormValues(jurisdiction)}
            logoUrl={jurisdiction.brand?.logoUrl}
            faviconUrl={jurisdiction.brand?.faviconUrl}
            isSaving={isSaving}
            onSubmit={save}
            onDirtyChange={setDirty}
            onDiscard={discard}
          />
        )}
      </TabView>
    </Layout>
  )
}

export default SettingsBranding
