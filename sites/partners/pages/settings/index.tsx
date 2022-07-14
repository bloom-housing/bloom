import React, { useContext, useState } from "react"
import Head from "next/head"
import {
  AppearanceSizeType,
  AppearanceStyleType,
  AppearanceBorderType,
  Button,
  Icon,
  IconFillColors,
  LoadingOverlay,
  MinimalTable,
  NavigationHeader,
  Modal,
  PageHeader,
  SiteAlert,
  StandardCard,
  t,
} from "@bloom-housing/ui-components"
import dayjs from "dayjs"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { faClone, faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import Layout from "../../layouts"
import { useJurisdictionalPreferenceList } from "../../lib/hooks"

const Settings = () => {
  const { profile } = useContext(AuthContext)

  const [deleteModal, setDeleteModal] = useState(false)

  const { data, loading } = useJurisdictionalPreferenceList(
    profile?.jurisdictions?.reduce((acc, curr) => {
      return `${acc}${","}${curr.id}`
    }, "")
  )

  const iconContent = () => {
    return (
      <div className={"flex justify-end"}>
        <div className={"w-max"}>
          <span onClick={() => alert("edit")} className={"cursor-pointer"}>
            <Icon
              symbol={faPenToSquare}
              size={"medium"}
              fill={IconFillColors.primary}
              className={"mr-5"}
            />
          </span>
          <span onClick={() => alert("copy")} className={"cursor-pointer"}>
            <Icon
              symbol={faClone}
              size={"medium"}
              fill={IconFillColors.primary}
              className={"mr-5"}
            />
          </span>
          <span onClick={() => setDeleteModal(true)} className={"cursor-pointer"}>
            <Icon symbol={faTrashCan} size={"medium"} fill={IconFillColors.alert} />
          </span>
        </div>
      </div>
    )
  }

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
                name: { content: preference?.title },
                jurisdiction: {
                  content: preference?.jurisdictions?.reduce((acc, item, index) => {
                    return `${acc}${index > 0 ? ", " : ""}${item.name}`
                  }, ""),
                },
                updated: {
                  content: dayjs(preference?.updatedAt).format("MM/DD/YYYY"),
                },
                icons: { content: iconContent() },
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
                footer={<Button size={AppearanceSizeType.small}>{t("t.addItem")}</Button>}
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
    </>
  )
}

export default Settings
