import React, { useContext, useState } from "react"
import { useSWRConfig } from "swr"
import { AuthContext, MessageContext, useMutate } from "@bloom-housing/shared-helpers"
import {
  MultiselectQuestion,
  MultiselectQuestionCreate,
  MultiselectQuestionsStatusEnum,
  MultiselectQuestionUpdate,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
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

  const [updatedIds, setUpdatedIds] = useState<string[]>([])
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState<MultiselectQuestion | null>(
    null
  )

  const copyQuestion = (data: MultiselectQuestionCreate) => {
    const newData = {
      ...data,
      name: `${data.name} (Copy)`,
      text: "",
      options: null,
      status: MultiselectQuestionsStatusEnum.draft,
      hideFromListing: true,
    }
    newData.multiselectOptions.forEach((option) => (option.text = ""))
    saveQuestion(newData, "add")
  }

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
        copyQuestion={copyQuestion}
        setDeleteConfirmModalOpen={setDeleteConfirmModalOpen}
        isLoading={isCreateLoading || isUpdateLoading}
      />

      <PreferenceViewDrawer
        drawerOpen={preferenceDrawerOpen === "view"}
        questionData={questionData}
        questionsService={multiselectQuestionsService}
        copyQuestion={copyQuestion}
        cacheKey={cacheKey}
        onDrawerClose={() => {
          setPreferenceDrawerOpen(null)
        }}
      />

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
