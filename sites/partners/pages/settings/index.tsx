import React, { useContext, useState } from "react"
import Head from "next/head"
import { useSWRConfig } from "swr"

import {
  ApplicationSection,
  MultiselectQuestion,
  MultiselectQuestionCreate,
  MultiselectQuestionUpdate,
} from "@bloom-housing/backend-core"
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
  AlertTypes,
  useMutate,
} from "@bloom-housing/ui-components"
import dayjs from "dayjs"
import { AuthContext } from "@bloom-housing/shared-helpers"
import Layout from "../../layouts"
import PreferenceDrawer from "../../src/settings/PreferenceDrawer"
import { useJurisdictionalMultiselectQuestionList } from "../../lib/hooks"
import ManageIconSection from "../../src/settings/ManageIconSection"

export type DrawerType = "add" | "edit"

const Settings = () => {
  const { mutate } = useSWRConfig()

  const { profile, multiselectQuestionsService } = useContext(AuthContext)

  const { mutate: updateQuestion, isLoading: isUpdateLoading } = useMutate()
  const { mutate: createQuestion, isLoading: isCreateLoading } = useMutate()
  const { mutate: deleteQuestion, isLoading: isDeleteLoading } = useMutate()

  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [preferenceDrawerOpen, setPreferenceDrawerOpen] = useState<DrawerType | null>(null)
  const [questionData, setQuestionData] = useState<MultiselectQuestion>(null)
  const [alertMessage, setAlertMessage] = useState({
    type: "alert" as AlertTypes,
    message: undefined,
  })

  const { data, loading, cacheKey } = useJurisdictionalMultiselectQuestionList(
    profile?.jurisdictions?.reduce((acc, curr) => {
      return `${acc}${","}${curr.id}`
    }, ""),
    ApplicationSection.preferences
  )

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
          .then(() => {
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
          .then(() => {
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

  const onDelete = (questionId: string) => {
    void deleteQuestion(() =>
      multiselectQuestionsService //TODO: How should we safeguard this? Atm doesn't work: "update or delete on table "multiselect_questions" violates foreign key constraint "FK_ab91e5d403a6cf21656f7d5ae20" on table "jurisdictions_multiselect_questions_multiselect_questions"
        .delete({
          body: {
            id: questionId,
          },
        })
        .then(() => {
          setAlertMessage({ message: t(`settings.preferenceAlertDeleted`), type: "success" })
        })
        .catch(() => {
          setAlertMessage({ message: t(`errors.alert.badRequest`), type: "alert" })
        })
        .finally(() => {
          setPreferenceDrawerOpen(null)
          void mutate(cacheKey)
        })
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
            data={data
              ?.sort((a, b) => {
                const aChar = a.jurisdictions[0].name[0]
                const bChar = b.jurisdictions[0].name[0]
                if (aChar === bChar)
                  return a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0
                return aChar < bChar ? -1 : aChar > bChar ? 1 : 0
              })
              .map((preference) => {
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
                        onCopy={() => saveQuestion(preference, "add")}
                        onEdit={() => {
                          setQuestionData(preference)
                          setPreferenceDrawerOpen("edit")
                        }}
                        onDelete={() => setDeleteModal(preference.id)}
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
            <SiteAlert timeout={5000} dismissable alertMessage={alertMessage} />
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
                      setQuestionData(null)
                      setPreferenceDrawerOpen("add")
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
        onClose={() => setDeleteModal(null)}
        actions={[
          <Button
            type="button"
            styleType={AppearanceStyleType.alert}
            onClick={() => {
              onDelete(deleteModal)
            }}
            loading={isDeleteLoading}
          >
            {t("t.delete")}
          </Button>,
          <Button
            type="button"
            styleType={AppearanceStyleType.primary}
            border={AppearanceBorderType.borderless}
            onClick={() => {
              setDeleteModal(null)
            }}
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        {t("settings.preferenceDelete")}
      </Modal>
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
    </>
  )
}

export default Settings
