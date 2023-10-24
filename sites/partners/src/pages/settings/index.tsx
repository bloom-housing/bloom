import React, { useContext, useState, useMemo, useEffect } from "react"
import Head from "next/head"
import { useSWRConfig } from "swr"

import {
  ApplicationSection,
  MultiselectQuestion,
  MultiselectQuestionCreate,
  MultiselectQuestionUpdate,
} from "@bloom-housing/backend-core"
import {
  LoadingOverlay,
  MinimalTable,
  SiteAlert,
  StandardCard,
  t,
  AlertTypes,
  useMutate,
  Modal,
} from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import dayjs from "dayjs"
import { AuthContext } from "@bloom-housing/shared-helpers"
import Layout from "../../layouts"
import PreferenceDrawer from "../../components/settings/PreferenceDrawer"
import { useJurisdictionalMultiselectQuestionList } from "../../lib/hooks"
import ManageIconSection from "../../components/settings/ManageIconSection"
import { PreferenceDeleteModal } from "../../components/settings/PreferenceDeleteModal"
import { NavigationHeader } from "../../components/shared/NavigationHeader"

export type DrawerType = "add" | "edit"

const Settings = () => {
  const { mutate } = useSWRConfig()

  const { profile, multiselectQuestionsService } = useContext(AuthContext)

  const { mutate: updateQuestion, isLoading: isUpdateLoading } = useMutate()
  const { mutate: createQuestion, isLoading: isCreateLoading } = useMutate()

  const [preferenceDrawerOpen, setPreferenceDrawerOpen] = useState<DrawerType | null>(null)
  const [copyModalOpen, setCopyModalOpen] = useState<MultiselectQuestion>(null)
  const [questionData, setQuestionData] = useState<MultiselectQuestion>(null)
  const [updatedIds, setUpdatedIds] = useState<string[]>([])

  const [alertMessage, setAlertMessage] = useState({
    type: "alert" as AlertTypes,
    message: undefined,
  })
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState<MultiselectQuestion | null>(
    null
  )

  const { data, loading, cacheKey } = useJurisdictionalMultiselectQuestionList(
    profile?.jurisdictions?.reduce((acc, curr) => {
      return `${acc}${","}${curr.id}`
    }, ""),
    ApplicationSection.preferences
  )

  const tableData = useMemo(() => {
    return data
      ?.sort((a, b) => {
        const aChar = a.text.toUpperCase()
        const bChar = b.text.toUpperCase()
        if (aChar === bChar)
          return a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0
        return aChar.localeCompare(bChar)
      })
      .map((preference) => {
        // const rowClass = updatedIds.indexOf(preference.id) >= 0 ? "bg-gray-400" : ""
        return {
          name: {
            content: preference?.text,
          },
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
                onCopy={() => setCopyModalOpen(preference)}
                copyTestId={`preference-copy-icon: ${preference.text}`}
                onEdit={() => {
                  setQuestionData(preference)
                  setPreferenceDrawerOpen("edit")
                }}
                editTestId={`preference-edit-icon: ${preference.text}`}
                onDelete={() => setDeleteConfirmModalOpen(preference)}
                deleteTestId={`preference-delete-icon: ${preference.text}`}
              />
            ),
          },
        }
      })
  }, [updatedIds, data])

  useEffect(() => {
    if (!isCreateLoading) {
      setCopyModalOpen(null)
    }
  }, [isCreateLoading])

  const saveQuestion = (
    formattedData: MultiselectQuestionCreate | MultiselectQuestionUpdate,
    requestType: DrawerType
  ) => {
    if (requestType === "edit") {
      void updateQuestion(() =>
        multiselectQuestionsService
          .update({
            body: { ...formattedData, id: questionData.id },
          })
          .then((result) => {
            setUpdatedIds(
              updatedIds.find((existingId) => existingId === result.id)
                ? updatedIds
                : [...updatedIds, result.id]
            )
            setAlertMessage({ message: t(`settings.preferenceAlertUpdated`), type: "success" })
          })
          .catch((e) => {
            setAlertMessage({ message: t(`errors.alert.badRequest`), type: "alert" })
            console.log(e)
          })
          .finally(() => {
            setPreferenceDrawerOpen(null)
            void mutate(cacheKey)
          })
      )
    } else {
      void createQuestion(() =>
        multiselectQuestionsService
          .create({
            body: formattedData,
          })
          .then((result) => {
            setUpdatedIds(
              updatedIds.find((existingId) => existingId === result.id)
                ? updatedIds
                : [...updatedIds, result.id]
            )
            setAlertMessage({ message: t(`settings.preferenceAlertCreated`), type: "success" })
          })
          .catch((e) => {
            setAlertMessage({ message: t(`errors.alert.badRequest`), type: "alert" })
            console.log(e)
          })
          .finally(() => {
            setPreferenceDrawerOpen(null)
            void mutate(cacheKey)
          })
      )
    }
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
            data={tableData}
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
        <SiteAlert timeout={5000} dismissable alertMessage={alertMessage} sticky={true} />
        <NavigationHeader className="relative" title={t("t.settings")} />
        <section>
          <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
            <LoadingOverlay isLoading={loading}>
              <StandardCard
                title={t("t.preferences")}
                emptyStateMessage={t("t.none")}
                footer={
                  <Button
                    size="sm"
                    onClick={() => {
                      setQuestionData(null)
                      setPreferenceDrawerOpen("add")
                    }}
                    id={"preference-add-item"}
                    disabled={loading}
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
      <PreferenceDrawer
        drawerOpen={!!preferenceDrawerOpen}
        questionData={questionData}
        setQuestionData={setQuestionData}
        drawerType={preferenceDrawerOpen}
        onDrawerClose={() => {
          setPreferenceDrawerOpen(null)
          void mutate(cacheKey)
        }}
        saveQuestion={saveQuestion}
        isLoading={isCreateLoading || isUpdateLoading}
      />
      <Modal
        open={!!copyModalOpen}
        title={t("t.copy")}
        ariaDescription={t("listings.listingIsAlreadyLive")}
        onClose={() => setCopyModalOpen(null)}
        actions={[
          <Button
            type="button"
            variant="primary-outlined"
            onClick={() => {
              saveQuestion({ ...copyModalOpen, text: `${copyModalOpen.text} (Copy)` }, "add")
            }}
            id={"copy-button-confirm"}
            loadingMessage={isCreateLoading && t("t.formSubmitted")}
            size="sm"
          >
            {t("settings.copy")}
          </Button>,
          <Button
            variant="primary-outlined"
            type="button"
            onClick={() => {
              setCopyModalOpen(null)
            }}
            disabled={isCreateLoading}
            id={"copy-button-cancel"}
            size="sm"
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        {t("settings.createCopyDescription")}
      </Modal>
      {deleteConfirmModalOpen && (
        <PreferenceDeleteModal
          multiselectQuestion={deleteConfirmModalOpen}
          setAlertMessage={setAlertMessage}
          onClose={() => {
            setDeleteConfirmModalOpen(null)
            void mutate(cacheKey)
          }}
        />
      )}
    </>
  )
}

export default Settings
