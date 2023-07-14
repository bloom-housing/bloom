import React, { useState, useContext, useEffect, useMemo } from "react"
import {
  AppearanceSizeType,
  AppearanceStyleType,
  Button,
  Drawer,
  Field,
  FieldGroup,
  GridCell,
  GridSection,
  Select,
  Textarea,
  t,
  MinimalTable,
  StandardTableData,
} from "@bloom-housing/ui-components"
import { FormErrorMessage, FieldValue } from "@bloom-housing/ui-seeds"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { useForm } from "react-hook-form"
import { YesNoAnswer } from "../../lib/helpers"
import {
  ApplicationSection,
  MultiselectOption,
  MultiselectQuestion,
  MultiselectQuestionCreate,
  MultiselectQuestionUpdate,
} from "@bloom-housing/backend-core"
import ManageIconSection from "./ManageIconSection"
import { DrawerType } from "../../pages/settings/index"

type PreferenceDrawerProps = {
  drawerOpen: boolean
  questionData: MultiselectQuestion
  setQuestionData: React.Dispatch<React.SetStateAction<MultiselectQuestion>>
  drawerType: DrawerType
  onDrawerClose: () => void
  saveQuestion: (
    formattedData: MultiselectQuestionCreate | MultiselectQuestionUpdate,
    requestType: DrawerType
  ) => void
  isLoading: boolean
}

type OptionForm = {
  collectAddress: boolean
  exclusiveQuestion: "exclusive" | "multiselect"
  optionDescription: string
  optionLinkTitle: string
  optionTitle: string
  optionUrl: string
}

const PreferenceDrawer = ({
  drawerType,
  questionData,
  setQuestionData,
  drawerOpen,
  onDrawerClose,
  saveQuestion,
  isLoading,
}: PreferenceDrawerProps) => {
  const [optionDrawerOpen, setOptionDrawerOpen] = useState<DrawerType | null>(null)
  const [optionData, setOptionData] = useState<MultiselectOption>(null)
  const [dragOrder, setDragOrder] = useState([])

  const { profile } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register,
    getValues,
    trigger,
    errors,
    clearErrors,
    setError,
    watch,
    setValue,
    formState,
  } = useForm()

  useEffect(() => {
    if (!optOutQuestion) {
      setValue(
        "canYouOptOutQuestion",
        questionData?.optOutText !== null ? YesNoAnswer.Yes : YesNoAnswer.No
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionData])

  const optOutQuestion = watch("canYouOptOutQuestion")

  // Update local state with dragged state
  useEffect(() => {
    if (questionData?.options?.length > 0 && dragOrder?.length > 0) {
      const newDragOrder = []
      dragOrder.forEach((item, index) => {
        newDragOrder.push({
          ...questionData?.options?.filter((draftItem) => draftItem.text === item.name.content)[0],
          ordinal: index + 1,
        })
      })
      setQuestionData({ ...questionData, options: newDragOrder })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragOrder])

  const draggableTableData: StandardTableData = useMemo(
    () =>
      questionData?.options
        ?.sort((a, b) => (a.ordinal < b.ordinal ? -1 : 1))
        .map((item) => ({
          name: { content: item.text },
          description: { content: item.description },
          action: {
            content: (
              <ManageIconSection
                onCopy={() => {
                  const draftOptions = [...questionData.options]
                  draftOptions.push({ ...item, ordinal: questionData.options.length + 1 })
                  setQuestionData({ ...questionData, options: draftOptions })
                }}
                copyTestId={`option-copy-icon: ${item.text}`}
                onEdit={() => {
                  setOptionData(item)
                  setOptionDrawerOpen("edit")
                }}
                editTestId={`option-edit-icon: ${item.text}`}
                onDelete={() => {
                  setQuestionData({
                    ...questionData,
                    options: questionData.options
                      .filter((option) => option.ordinal !== item.ordinal)
                      .map((option, index) => {
                        return { ...option, ordinal: index + 1 }
                      }),
                  })
                }}
              />
            ),
          },
        })),
    [questionData, setQuestionData]
  )

  const drawerTitle =
    drawerType === "add" ? t("settings.preferenceAdd") : t("settings.preferenceEdit")

  const selectDrawerTitle = optionData
    ? t("settings.preferenceEditOption")
    : t("settings.preferenceAddOption")

  return (
    <>
      <Drawer
        open={!!drawerOpen}
        title={drawerTitle}
        ariaDescription={drawerTitle}
        onClose={() => {
          clearErrors()
          clearErrors("questions")
          onDrawerClose()
        }}
      >
        <div className="border rounded-md p-8 bg-white">
          <GridSection title={t("settings.preference")} columns={3}>
            <GridCell span={2}>
              <FieldValue label={t("t.title")}>
                <Field
                  id="text"
                  name="text"
                  label={t("t.title")}
                  placeholder={t("t.title")}
                  register={register}
                  type="text"
                  readerOnly
                  dataTestId={"preference-title"}
                  defaultValue={questionData?.text}
                  errorMessage={t("errors.requiredFieldError")}
                  validation={{ required: true }}
                  error={errors.text}
                  inputProps={{
                    onChange: () => clearErrors("text"),
                  }}
                />
              </FieldValue>
            </GridCell>
          </GridSection>
          <GridSection columns={3} className={"mb-4"}>
            <GridCell span={2}>
              <Textarea
                label={t("t.descriptionTitle")}
                name={"description"}
                id={"description"}
                fullWidth={true}
                placeholder={t("settings.preferenceDescription")}
                register={register}
                dataTestId={"preference-description"}
                defaultValue={questionData?.description}
              />
            </GridCell>
          </GridSection>
          <GridSection columns={3} className={"mt-4 mb-6"}>
            <GridCell>
              <FieldValue label={t("t.url")}>
                <Field
                  id="preferenceUrl"
                  name="preferenceUrl"
                  label={t("t.url")}
                  placeholder={"https://"}
                  register={register}
                  type="url"
                  readerOnly
                  dataTestId={"preference-link"}
                  error={!!errors?.preferenceUrl}
                  errorMessage={
                    errors?.preferenceUrl?.type === "https"
                      ? t("errors.urlHttpsError")
                      : t("errors.urlError")
                  }
                  defaultValue={questionData?.links?.length > 0 ? questionData?.links[0].url : ""}
                />
              </FieldValue>
            </GridCell>
            <GridCell>
              <FieldValue label={t("settings.preferenceLinkTitle")}>
                <Field
                  id="preferenceLinkTitle"
                  name="preferenceLinkTitle"
                  label={t("settings.preferenceLinkTitle")}
                  placeholder={t("settings.preferenceLinkTitle")}
                  register={register}
                  type="text"
                  readerOnly
                  dataTestId={"preference-link-title"}
                  defaultValue={questionData?.links?.length > 0 ? questionData?.links[0].title : ""}
                />
              </FieldValue>
            </GridCell>
          </GridSection>
          {questionData?.options?.length > 0 && (
            <div className="mb-5">
              <MinimalTable
                headers={{
                  name: "t.name",
                  description: "t.descriptionTitle",
                  action: "",
                }}
                data={draggableTableData}
                draggable={true}
                setData={setDragOrder}
              />
            </div>
          )}
          <GridSection columns={3} className={"mt-4"}>
            <div className={"flex flex-col"}>
              <Button
                type="button"
                size={AppearanceSizeType.small}
                styleType={
                  errors["questions"] ? AppearanceStyleType.alert : AppearanceStyleType.primary
                }
                onClick={() => {
                  clearErrors("questions")
                  setOptionData(null)
                  setOptionDrawerOpen("add")
                }}
                dataTestId={"preference-add-option-button"}
              >
                {t("settings.preferenceAddOption")}
              </Button>
              {errors["questions"] && (
                <FormErrorMessage className={"pt-1"}>
                  {errors["questions"].message}
                </FormErrorMessage>
              )}
            </div>
          </GridSection>
          <GridSection columns={3} className={"mt-4"}>
            <GridCell>
              <FieldValue label={t("settings.preferenceOptOut")} className="mb-1">
                <FieldGroup
                  name="canYouOptOutQuestion"
                  type="radio"
                  register={register}
                  fields={[
                    {
                      id: "optOutYes",
                      label: t("t.yes"),
                      value: YesNoAnswer.Yes,
                      defaultChecked: questionData === null || questionData?.optOutText !== null,
                      dataTestId: "opt-out-question-yes",
                    },
                    {
                      id: "optOutNo",
                      label: t("t.no"),
                      value: YesNoAnswer.No,
                      defaultChecked: questionData && questionData?.optOutText === null,
                      dataTestId: "opt-out-question-no",
                    },
                  ]}
                  fieldClassName="m-0"
                  fieldGroupClassName="flex h-12 items-center"
                  dataTestId={"preference-can-you-opt-out"}
                />
              </FieldValue>
            </GridCell>
            {optOutQuestion === YesNoAnswer.Yes && (
              <GridCell>
                <FieldValue label={t("settings.preferenceOptOutLabel")}>
                  <Field
                    id="optOutText"
                    name="optOutText"
                    label={t("settings.preferenceOptOutLabel")}
                    placeholder={t("settings.preferenceOptOutLabel")}
                    register={register}
                    type="text"
                    readerOnly
                    dataTestId={"preference-opt-out-label"}
                    defaultValue={
                      questionData?.optOutText ?? t("application.preferences.dontWantSingular")
                    }
                  />
                </FieldValue>
              </GridCell>
            )}
          </GridSection>
          <GridSection columns={3} className={"mt-4"}>
            <GridCell>
              <FieldValue label={t("settings.preferenceShowOnListing")} className="mb-1">
                <FieldGroup
                  name="showOnListingQuestion"
                  type="radio"
                  register={register}
                  fields={[
                    {
                      id: "showOnListingYes",
                      label: t("t.yes"),
                      value: YesNoAnswer.Yes,
                      defaultChecked: questionData === null || !questionData?.hideFromListing,
                      dataTestId: "show-on-listing-question-yes",
                    },
                    {
                      id: "showOnListingNo",
                      label: t("t.no"),
                      value: YesNoAnswer.No,
                      defaultChecked: questionData?.hideFromListing,
                      dataTestId: "show-on-listing-question-no",
                    },
                  ]}
                  fieldClassName="m-0"
                  fieldGroupClassName="flex h-12 items-center"
                  dataTestId={"preference-show-on-listing"}
                />
              </FieldValue>
            </GridCell>
          </GridSection>
          <GridSection columns={3}>
            <GridCell span={1}>
              <FieldValue label={t("t.jurisdiction")}>
                <Select
                  id={"jurisdictionId"}
                  name={"jurisdictionId"}
                  label={t("t.jurisdiction")}
                  labelClassName="sr-only"
                  register={register}
                  controlClassName={"control"}
                  keyPrefix={"jurisdictions"}
                  options={
                    profile
                      ? [
                          { label: "", value: "" },
                          ...profile?.jurisdictions.map((jurisdiction) => ({
                            label: jurisdiction.name,
                            value: jurisdiction.id,
                          })),
                        ]
                      : [{ label: "", value: "" }]
                  }
                  dataTestId={"preference-jurisdiction"}
                  defaultValue={
                    questionData?.jurisdictions?.length > 0
                      ? questionData.jurisdictions[0].id
                      : null
                  }
                  errorMessage={t("errors.requiredFieldError")}
                  error={errors.jurisdictionId}
                  validation={{ required: true }}
                  inputProps={{
                    onChange: () => clearErrors("jurisdictionId"),
                  }}
                />
              </FieldValue>
            </GridCell>
          </GridSection>
        </div>
        <Button
          type="button"
          className={"mt-4"}
          styleType={AppearanceStyleType.primary}
          size={AppearanceSizeType.normal}
          loading={isLoading}
          onClick={async () => {
            const validation = await trigger()
            if (!questionData || !questionData?.options?.length) {
              setError("questions", { message: t("errors.requiredFieldError") })
              return
            }
            if (!validation) return
            const formValues = getValues()

            const formattedQuestionData: MultiselectQuestionUpdate | MultiselectQuestionCreate = {
              applicationSection: ApplicationSection.preferences,
              text: formValues.text,
              description: formValues.description,
              hideFromListing: formValues.showOnListingQuestion === YesNoAnswer.No,
              optOutText:
                optOutQuestion === YesNoAnswer.Yes &&
                formValues.optOutText &&
                formValues.optOutText !== ""
                  ? formValues.optOutText
                  : null,
              options: questionData?.options,
              jurisdictions: [
                profile.jurisdictions.find((juris) => juris.id === formValues.jurisdictionId),
              ],
              links: formValues.preferenceUrl
                ? [{ title: formValues.preferenceLinkTitle, url: formValues.preferenceUrl }]
                : [],
            }
            clearErrors()
            clearErrors("questions")
            saveQuestion(formattedQuestionData, drawerType)
          }}
          dataTestId={"preference-save-button"}
        >
          {t("t.save")}
        </Button>
      </Drawer>

      <Drawer
        open={!!optionDrawerOpen}
        title={selectDrawerTitle}
        ariaDescription={drawerTitle}
        onClose={() => {
          setOptionDrawerOpen(null)
        }}
        className={"w-auto"}
      >
        <div className="border rounded-md p-8 bg-white">
          <GridSection title={t("t.option")} columns={3}>
            <GridCell span={2}>
              <FieldValue label={t("t.title")}>
                <Field
                  id="optionTitle"
                  name="optionTitle"
                  label={t("t.title")}
                  placeholder={t("t.title")}
                  register={register}
                  type="text"
                  readerOnly
                  dataTestId={"preference-option-title"}
                  defaultValue={optionData?.text}
                  errorMessage={t("errors.requiredFieldError")}
                  error={!!errors["optionTitle"]}
                  inputProps={{
                    onChange: () => {
                      clearErrors("optionTitle")
                    },
                  }}
                />
              </FieldValue>
            </GridCell>
          </GridSection>
          <GridSection columns={3} className={"mb-4"}>
            <GridCell span={2}>
              <Textarea
                label={t("t.descriptionTitle")}
                name={"optionDescription"}
                id={"optionDescription"}
                placeholder={t("settings.preferenceOptionDescription")}
                fullWidth={true}
                register={register}
                dataTestId={"preference-option-description"}
                defaultValue={optionData?.description}
              />
            </GridCell>
          </GridSection>
          <GridSection columns={3} className={"mt-4"}>
            <GridCell>
              <FieldValue label={t("t.url")}>
                <Field
                  id="optionUrl"
                  name="optionUrl"
                  label={t("t.url")}
                  placeholder={"https://"}
                  register={register}
                  type="url"
                  error={!!errors?.optionUrl}
                  errorMessage={
                    errors?.optionUrl?.type === "https"
                      ? t("errors.urlHttpsError")
                      : t("errors.urlError")
                  }
                  readerOnly
                  dataTestId={"preference-option-link"}
                  defaultValue={optionData?.links?.length > 0 ? optionData?.links[0].url : ""}
                />
              </FieldValue>
            </GridCell>
            <GridCell>
              <FieldValue label={t("settings.preferenceLinkTitle")}>
                <Field
                  id="optionLinkTitle"
                  name="optionLinkTitle"
                  label={t("settings.preferenceLinkTitle")}
                  placeholder={t("settings.preferenceLinkTitle")}
                  register={register}
                  type="text"
                  readerOnly
                  dataTestId={"preference-option-link-title"}
                  defaultValue={optionData?.links?.length > 0 ? optionData?.links[0].title : ""}
                />
              </FieldValue>
            </GridCell>
          </GridSection>
          <GridSection columns={3} className={"mt-8"}>
            <GridCell>
              <Field
                type="checkbox"
                id="collectAddress"
                name="collectAddress"
                label={t("settings.preferenceCollectAddress")}
                register={register}
                dataTestId={"preference-option-collect-address"}
                controlClassName={"font-normal"}
                inputProps={{
                  defaultChecked: optionData?.collectAddress,
                }}
              />
            </GridCell>
          </GridSection>
          <GridSection>
            <GridCell>
              <FieldValue label={t("settings.preferenceExclusiveQuestion")} className="mb-1">
                <FieldGroup
                  name="exclusiveQuestion"
                  type="radio"
                  register={register}
                  fields={[
                    {
                      id: "multiselect",
                      label: t("settings.preferenceMultiSelect"),
                      value: "multiselect",
                      defaultChecked: optionData === null || !optionData?.exclusive,
                      dataTestId: "exclusive-question-multiselect",
                    },
                    {
                      id: "exclusive",
                      label: t("settings.preferenceExclusive"),
                      value: "exclusive",
                      defaultChecked: optionData?.exclusive,
                      dataTestId: "exclusive-question-exclusive",
                    },
                  ]}
                  fieldClassName="m-0"
                  fieldGroupClassName="flex h-12 items-center"
                  dataTestId={"preference-exclusive-question"}
                />
              </FieldValue>
            </GridCell>
          </GridSection>
        </div>
        <Button
          type="button"
          className={"mt-4"}
          styleType={AppearanceStyleType.primary}
          size={AppearanceSizeType.normal}
          onClick={async () => {
            const formData = getValues() as OptionForm
            await trigger()
            if (!formData.optionTitle || formData.optionTitle === "") {
              setError("optionTitle", { message: t("errors.requiredFieldError") })
              return
            }
            if (formState.errors.optionUrl) return
            const existingOptionData = questionData?.options?.find(
              (option) => optionData?.ordinal === option.ordinal
            )

            const getNewOrdinal = () => {
              if (existingOptionData) return existingOptionData.ordinal
              return questionData?.options?.length ? questionData?.options.length + 1 : 1
            }

            const newOptionData: MultiselectOption = {
              text: formData.optionTitle,
              description: formData.optionDescription,
              links: formData.optionUrl
                ? [{ title: formData.optionLinkTitle, url: formData.optionUrl }]
                : [],
              ordinal: getNewOrdinal(),
              collectAddress: formData.collectAddress,
              exclusive: formData.exclusiveQuestion === "exclusive",
            }
            let newOptions = []

            if (existingOptionData) {
              newOptions = questionData.options.map((option) =>
                option.ordinal === existingOptionData.ordinal ? newOptionData : option
              )
            } else {
              newOptions = questionData?.options
                ? [...questionData.options, newOptionData]
                : [newOptionData]
            }
            setQuestionData({ ...questionData, options: newOptions })
            setOptionDrawerOpen(null)
          }}
          dataTestId={"preference-option-save"}
        >
          {t("t.save")}
        </Button>
      </Drawer>
    </>
  )
}

export default PreferenceDrawer
