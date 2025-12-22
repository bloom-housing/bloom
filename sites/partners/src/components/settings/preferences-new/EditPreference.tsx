import React, { useContext, useState, useEffect } from "react"
import { useSWRConfig } from "swr"
import { AuthContext, MessageContext, useMutate } from "@bloom-housing/shared-helpers"
import {
  MultiselectQuestion,
  MultiselectQuestionCreate,
  MultiselectQuestionUpdate,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog } from "@bloom-housing/ui-seeds"
import PreferenceEditDrawer from "./PreferenceEditDrawer"
import { PreferenceDeleteModal } from "./PreferenceDeleteModal"
import PreferenceViewDrawer from "./PreferenceViewDrawer"

export type DrawerType = "add" | "edit" | "view"

interface EditPreferenceProps {
  cacheKey: string
  preferenceDrawerOpen: DrawerType
  setPreferenceDrawerOpen: React.Dispatch<React.SetStateAction<DrawerType>>
  questionData: MultiselectQuestion
  setQuestionData: React.Dispatch<React.SetStateAction<MultiselectQuestion>>
}

const EditPreference = ({
  cacheKey,
  preferenceDrawerOpen,
  setPreferenceDrawerOpen,
  questionData,
  setQuestionData,
}: EditPreferenceProps) => {
  const { mutate } = useSWRConfig()

  const { multiselectQuestionsService } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)

  const { mutate: updateQuestion, isLoading: isUpdateLoading } = useMutate()
  const { mutate: createQuestion, isLoading: isCreateLoading } = useMutate()

  const [copyModalOpen, setCopyModalOpen] = useState<MultiselectQuestion>(null)
  const [updatedIds, setUpdatedIds] = useState<string[]>([])
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState<MultiselectQuestion | null>(
    null
  )

  useEffect(() => {
    if (!isCreateLoading) {
      setCopyModalOpen(null)
    }
  }, [isCreateLoading])

  const saveQuestion = (formattedData: MultiselectQuestionCreate, requestType: DrawerType) => {
    if (requestType === "edit") {
      void updateQuestion(() =>
        multiselectQuestionsService
          .update({
            body: {
              ...(formattedData as unknown as MultiselectQuestionUpdate),
              id: questionData.id,
            },
          })
          .then((result) => {
            setUpdatedIds(
              updatedIds.find((existingId) => existingId === result.id)
                ? updatedIds
                : [...updatedIds, result.id]
            )
            addToast(t(`settings.preferenceAlertUpdated`), { variant: "success" })
          })
          .catch((e) => {
            addToast(t(`errors.alert.badRequest`), { variant: "alert" })
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
            body: formattedData as unknown as MultiselectQuestionCreate,
          })
          .then((result) => {
            setUpdatedIds(
              updatedIds.find((existingId) => existingId === result.id)
                ? updatedIds
                : [...updatedIds, result.id]
            )
            addToast(t(`settings.preferenceAlertCreated`), { variant: "success" })
          })
          .catch((e) => {
            addToast(t(`errors.alert.badRequest`), { variant: "alert" })
            console.log(e)
          })
          .finally(() => {
            setPreferenceDrawerOpen(null)
            void mutate(cacheKey)
          })
      )
    }
  }

  return (
    <>
      <PreferenceEditDrawer
        drawerOpen={!!preferenceDrawerOpen && preferenceDrawerOpen != "view"}
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

      <PreferenceViewDrawer
        drawerOpen={preferenceDrawerOpen === "view"}
        questionData={questionData}
        onDrawerClose={() => {
          setPreferenceDrawerOpen(null)
        }}
      />

      <Dialog
        isOpen={!!copyModalOpen}
        ariaLabelledBy="settings-dialog-header"
        onClose={() => setCopyModalOpen(null)}
      >
        <Dialog.Header id="settings-dialog-header">{t("t.copy")}</Dialog.Header>
        <Dialog.Content>{t("settings.createCopyDescription")}</Dialog.Content>
        <Dialog.Footer>
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
            {t("actions.copy")}
          </Button>
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
          </Button>
        </Dialog.Footer>
      </Dialog>
      {deleteConfirmModalOpen && (
        <PreferenceDeleteModal
          multiselectQuestion={deleteConfirmModalOpen}
          onClose={() => {
            setDeleteConfirmModalOpen(null)
            void mutate(cacheKey)
          }}
        />
      )}
    </>
  )
}

export default EditPreference
