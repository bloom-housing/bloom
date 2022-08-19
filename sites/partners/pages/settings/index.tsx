import React, { useContext, useState } from "react"
import Head from "next/head"
import { ApplicationSection, MultiselectQuestion } from "@bloom-housing/backend-core"
import {
  AppearanceSizeType,
  AppearanceStyleType,
  AppearanceBorderType,
  Button,
  LoadingOverlay,
  MinimalTable,
  NavigationHeader,
  Modal,
  SiteAlert,
  StandardCard,
  t,
} from "@bloom-housing/ui-components"
import dayjs from "dayjs"
import { AuthContext } from "@bloom-housing/shared-helpers"
import Layout from "../../layouts"
import PreferenceDrawer from "../../src/settings/PreferenceDrawer"
import { useJurisdictionalMultiselectQuestionList } from "../../lib/hooks"
import ManageIconSection from "../../src/settings/ManageIconSection"
import { MultiselectOption } from "@bloom-housing/backend-core/types/src/backend-swagger"

export type PreferenceDrawerType = {
  type: "add" | "edit"
  preference?: MultiselectQuestion
}

export type OptionDrawerType = {
  type: "add" | "edit"
  option?: MultiselectOption
}

const Settings = () => {
  const { profile } = useContext(AuthContext)

  const [deleteModal, setDeleteModal] = useState(false)
  const [preferenceDrawerOpen, setPreferenceDrawerOpen] = useState<PreferenceDrawerType | null>(
    null
  )

  const { data, loading } = useJurisdictionalMultiselectQuestionList(
    profile?.jurisdictions?.reduce((acc, curr) => {
      return `${acc}${","}${curr.id}`
    }, ""),
    ApplicationSection.preferences
  )

  const getCardContent = () => {
    if (!loading && data?.length === 0) return null
    return (
      <>
        {data?.length ? (
          <MinimalTable
            headers={{
              name: "t.name",
              jurisdiction: "t.jurisdiction",
              updated: "t.updated",
              icons: "",
            }}
            cellClassName={"px-5 py-3"}
            data={data?.map((preference) => {
              return {
                name: { content: preference?.text },
                jurisdiction: {
                  content: preference?.jurisdictions?.reduce((acc, item, index) => {
                    return `${acc}${index > 0 ? ", " : ""}${item.name}`
                  }, ""),
                },
                updated: {
                  content: dayjs(preference?.updatedAt).format("MM/DD/YYYY"),
                },
                icons: {
                  content: (
                    <ManageIconSection
                      onCopy={() => alert("copy")}
                      onEdit={() => setPreferenceDrawerOpen({ type: "edit", preference })}
                      onDelete={() => setDeleteModal(true)}
                    />
                  ),
                },
              }
            })}
          />
        ) : (
          <div className={"ml-5 mb-5"}>{t("t.none")}</div>
        )}
      </>
    )
  }

  return (
    <>
      <Layout>
        <Head>
          <title>{t("nav.siteTitlePartners")}</title>
        </Head>

        <NavigationHeader className="relative" title={t("t.settings")}>
          <div className="flex top-4 right-4 absolute z-50 flex-col items-center">
            <SiteAlert type="success" timeout={5000} dismissable />
            <SiteAlert type="alert" timeout={5000} dismissable />
          </div>
        </NavigationHeader>

        <section>
          <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
            <LoadingOverlay isLoading={loading}>
              <StandardCard
                title={t("t.preferences")}
                emptyStateMessage={t("t.none")}
                footer={
                  <Button
                    size={AppearanceSizeType.small}
                    onClick={() => {
                      setPreferenceDrawerOpen({ type: "add", preference: null })
                    }}
                  >
                    {t("t.addItem")}
                  </Button>
                }
              >
                {getCardContent()}
              </StandardCard>
            </LoadingOverlay>
          </article>
        </section>
      </Layout>
      <Modal
        open={!!deleteModal}
        title={t("t.areYouSure")}
        ariaDescription={t("listings.closeThisListing")}
        onClose={() => setDeleteModal(false)}
        actions={[
          <Button
            type="button"
            styleType={AppearanceStyleType.alert}
            onClick={() => {
              setDeleteModal(false)
            }}
          >
            {t("t.delete")}
          </Button>,
          <Button
            type="button"
            styleType={AppearanceStyleType.primary}
            border={AppearanceBorderType.borderless}
            onClick={() => {
              setDeleteModal(false)
            }}
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        {t("settings.preferenceDelete")}
      </Modal>
      <PreferenceDrawer
        drawer={preferenceDrawerOpen}
        drawerOpen={!!preferenceDrawerOpen}
        setDrawerOpen={setPreferenceDrawerOpen}
      />
    </>
  )
}

export default Settings
