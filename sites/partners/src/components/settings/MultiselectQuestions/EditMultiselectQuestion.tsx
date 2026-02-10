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
import MultiselectQuestionEditDrawer from "./MultiselectQuestionEditDrawer"
import MultiselectQuestionDeleteModal from "./MultiselectQuestionDeleteModal"
import MultiselectQuestionViewDrawer from "./MultiselectQuestionViewDrawer"

export type DrawerType = "add" | "edit" | "view"

interface EditMultiselectQuestionProps {
  cacheKey: string
  multiselectQuestionDrawerOpen: DrawerType
  setMultiselectQuestionDrawerOpen: React.Dispatch<React.SetStateAction<DrawerType>>
  questionData: MultiselectQuestion
  setQuestionData: React.Dispatch<React.SetStateAction<MultiselectQuestion>>
}

const EditMultiselectQuestion = ({
  cacheKey,
  multiselectQuestionDrawerOpen,
  setMultiselectQuestionDrawerOpen,
  questionData,
  setQuestionData,
}: EditMultiselectQuestionProps) => {
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
            setMultiselectQuestionDrawerOpen(null)
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
            setMultiselectQuestionDrawerOpen(null)
            void mutate(cacheKey)
          })
      )
    }
  }

  return (
    <>
      <MultiselectQuestionEditDrawer
        drawerOpen={!!multiselectQuestionDrawerOpen && multiselectQuestionDrawerOpen != "view"}
        questionData={questionData}
        setQuestionData={setQuestionData}
        drawerType={multiselectQuestionDrawerOpen}
        onDrawerClose={() => {
          setMultiselectQuestionDrawerOpen(null)
          void mutate(cacheKey)
        }}
        saveQuestion={saveQuestion}
        copyQuestion={copyQuestion}
        setDeleteConfirmModalOpen={setDeleteConfirmModalOpen}
        isLoading={isCreateLoading || isUpdateLoading}
      />

      <MultiselectQuestionViewDrawer
        drawerOpen={multiselectQuestionDrawerOpen === "view"}
        questionData={questionData}
        questionsService={multiselectQuestionsService}
        copyQuestion={copyQuestion}
        cacheKey={cacheKey}
        onDrawerClose={() => {
          setMultiselectQuestionDrawerOpen(null)
        }}
      />

      {deleteConfirmModalOpen && (
        <MultiselectQuestionDeleteModal
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

export default EditMultiselectQuestion
