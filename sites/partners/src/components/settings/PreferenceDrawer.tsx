import React, { useContext, useEffect, useMemo, useState } from "react"
import {
  Drawer,
  Field,
  FieldGroup,
  Select,
  Textarea,
  t,
  MinimalTable,
  StandardTableData,
} from "@bloom-housing/ui-components"
import { Button, FormErrorMessage, FieldValue, Card, Grid } from "@bloom-housing/ui-seeds"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { useForm } from "react-hook-form"
import { YesNoAnswer } from "../../lib/helpers"
import {
  ApplicationSection,
  MultiselectOption,
  MultiselectQuestion,
  MultiselectQuestionCreate,
  MultiselectQuestionUpdate,
  ValidationMethod,
} from "@bloom-housing/backend-core"
import ManageIconSection from "./ManageIconSection"
import { DrawerType } from "../../pages/settings/index"
import SectionWithGrid from "../shared/SectionWithGrid"

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
  collectAddress: YesNoAnswer
  validationMethod?: ValidationMethod
  radiusSize?: string
  collectRelationship?: YesNoAnswer
  collectName?: YesNoAnswer
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

  const collectAddressExpand =
    (optionData?.collectAddress && watch("collectAddress") === undefined) ||
    watch("collectAddress") === YesNoAnswer.Yes
  const readiusExpand =
    (optionData?.validationMethod === ValidationMethod.radius &&
      watch("validationMethod") === undefined) ||
    watch("validationMethod") === ValidationMethod.radius

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
        <Card>
          <Card.Section>
            <SectionWithGrid heading={t("settings.preference")}>
              <Grid.Row columns={3}>
                <Grid.Cell className="seeds-grid-span-2">
                  <Field
                    id="text"
                    name="text"
                    label={t("t.title")}
                    placeholder={t("t.title")}
                    register={register}
                    type="text"
                    dataTestId={"preference-title"}
                    defaultValue={questionData?.text}
                    errorMessage={t("errors.requiredFieldError")}
                    validation={{ required: true }}
                    error={errors.text}
                    inputProps={{
                      onChange: () => clearErrors("text"),
                    }}
                  />
                </Grid.Cell>
              </Grid.Row>
              <Grid.Row columns={3}>
                <Grid.Cell className="seeds-grid-span-2">
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
                </Grid.Cell>
              </Grid.Row>
              <Grid.Row columns={3}>
                <Grid.Cell>
                  <Field
                    id="preferenceUrl"
                    name="preferenceUrl"
                    label={t("t.url")}
                    placeholder={"https://"}
                    register={register}
                    type="url"
                    dataTestId={"preference-link"}
                    error={!!errors?.preferenceUrl}
                    errorMessage={
                      errors?.preferenceUrl?.type === "https"
                        ? t("errors.urlHttpsError")
                        : t("errors.urlError")
                    }
                    defaultValue={questionData?.links?.length > 0 ? questionData?.links[0].url : ""}
                  />
                </Grid.Cell>
                <Grid.Cell>
                  <Field
                    id="preferenceLinkTitle"
                    name="preferenceLinkTitle"
                    label={t("settings.preferenceLinkTitle")}
                    placeholder={t("settings.preferenceLinkTitle")}
                    register={register}
                    type="text"
                    dataTestId={"preference-link-title"}
                    defaultValue={
                      questionData?.links?.length > 0 ? questionData?.links[0].title : ""
                    }
                  />
                </Grid.Cell>
              </Grid.Row>
            </SectionWithGrid>
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

            <div className={"mb-5 flex flex-col"}>
              <Button
                type="button"
                size="sm"
                className="w-max"
                variant={errors["questions"] ? "alert" : "primary"}
                onClick={() => {
                  clearErrors("questions")
                  setOptionData(null)
                  setOptionDrawerOpen("add")
                }}
                id={"preference-add-option-button"}
              >
                {t("settings.preferenceAddOption")}
              </Button>
              {errors["questions"] && (
                <FormErrorMessage className={"pt-1"}>
                  {errors["questions"].message}
                </FormErrorMessage>
              )}
            </div>

            <Grid>
              <Grid.Row columns={3}>
                <Grid.Cell>
                  <FieldGroup
                    name="canYouOptOutQuestion"
                    type="radio"
                    register={register}
                    groupLabel={t("settings.preferenceOptOut")}
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
                </Grid.Cell>
                {optOutQuestion === YesNoAnswer.Yes && (
                  <Grid.Cell>
                    <Field
                      id="optOutText"
                      name="optOutText"
                      label={t("settings.preferenceOptOutLabel")}
                      placeholder={t("settings.preferenceOptOutLabel")}
                      register={register}
                      type="text"
                      dataTestId={"preference-opt-out-label"}
                      defaultValue={
                        questionData?.optOutText ?? t("application.preferences.dontWantSingular")
                      }
                    />
                  </Grid.Cell>
                )}
              </Grid.Row>
              <Grid.Row columns={3}>
                <Grid.Cell>
                  <FieldGroup
                    name="showOnListingQuestion"
                    type="radio"
                    register={register}
                    groupLabel={t("settings.preferenceShowOnListing")}
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
                </Grid.Cell>
              </Grid.Row>
              <Grid.Row columns={3}>
                <Grid.Cell>
                  <Select
                    id={"jurisdictionId"}
                    name={"jurisdictionId"}
                    label={t("t.jurisdiction")}
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
                </Grid.Cell>
              </Grid.Row>
            </Grid>
          </Card.Section>
        </Card>
        <div className="pb-8">
          <Button
            type="button"
            className={"mt-4"}
            variant="primary"
            loadingMessage={isLoading && t("t.formSubmitted")}
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
            id={"preference-save-button"}
          >
            {t("t.save")}
          </Button>
        </div>
      </Drawer>

      <Drawer
        open={!!optionDrawerOpen}
        title={selectDrawerTitle}
        ariaDescription={drawerTitle}
        onClose={() => {
          setOptionDrawerOpen(null)
        }}
      >
        <Card>
          <Card.Section>
            <SectionWithGrid heading={t("t.option")}>
              <Grid.Row columns={3}>
                <Grid.Cell className="seeds-grid-span-2">
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
                </Grid.Cell>
              </Grid.Row>
              <Grid.Row columns={3}>
                <Grid.Cell className="seeds-grid-span-2">
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
                </Grid.Cell>
              </Grid.Row>
              <Grid.Row columns={3}>
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
              </Grid.Row>
              <Grid.Row columns={3}>
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
              </Grid.Row>
            </SectionWithGrid>
          </Card.Section>

          <Card.Section>
            <div className="border-t pt-8" />
            <SectionWithGrid heading={t("settings.preferenceAdditionalFields")}>
              <Grid.Row columns={3}>
                <Grid.Cell className="pr-8">
                  <FieldValue label={t("settings.preferenceCollectAddress")}>
                    <FieldGroup
                      name="collectAddress"
                      type="radio"
                      register={register}
                      validation={{ required: true }}
                      error={errors.collectAddress}
                      fields={[
                        {
                          label: t("t.yes"),
                          value: YesNoAnswer.Yes,
                          defaultChecked: optionData?.collectAddress,
                          id: "collectAddressYes",
                          dataTestId: "collect-address-yes",
                          inputProps: {
                            onChange: () => {
                              clearErrors("collectAddress")
                            },
                          },
                        },
                        {
                          label: t("t.no"),
                          value: YesNoAnswer.No,
                          defaultChecked:
                            optionData?.collectAddress !== undefined &&
                            optionData?.collectAddress === false,
                          id: "collectAddressNo",
                          dataTestId: "collect-address-no",
                          inputProps: {
                            onChange: () => {
                              clearErrors("collectAddress")
                            },
                          },
                        },
                      ]}
                      fieldClassName="m-0"
                      fieldGroupClassName="flex column items-center"
                      dataTestId={"preference-option-collect-address"}
                    />
                  </FieldValue>
                </Grid.Cell>
                <Grid.Cell className="pr-12">
                  {collectAddressExpand && (
                    <FieldValue label={t("settings.preferenceValidatingAddress")}>
                      <FieldGroup
                        name="validationMethod"
                        type="radio"
                        register={register}
                        validation={{ required: true }}
                        error={errors.validationMethod}
                        fields={[
                          {
                            label: t("settings.preferenceValidatingAddress.checkWithinRadius"),
                            value: ValidationMethod.radius,
                            defaultChecked:
                              optionData?.validationMethod === ValidationMethod.radius,
                            id: "validationMethodRadius",
                            dataTestId: "validation-method-radius",
                            inputProps: {
                              onChange: () => {
                                clearErrors("validationMethod")
                              },
                            },
                          },
                          {
                            label: t("settings.preferenceValidatingAddress.checkManually"),
                            value: ValidationMethod.none,
                            defaultChecked: optionData?.validationMethod === ValidationMethod.none,
                            id: "validationMethodNone",
                            dataTestId: "validation-method-none",
                            inputProps: {
                              onChange: () => {
                                clearErrors("validationMethod")
                              },
                            },
                          },
                        ]}
                        fieldClassName="m-0"
                        fieldGroupClassName="flex flex-col"
                        dataTestId={"preference-option-validation-method"}
                      />
                    </FieldValue>
                  )}
                </Grid.Cell>
                <Grid.Cell className="pr-8">
                  {collectAddressExpand && readiusExpand && (
                    <FieldValue label={t("settings.preferenceValidatingAddress.howManyMiles")}>
                      <Field
                        id="radiusSize"
                        name="radiusSize"
                        label={t("settings.preferenceValidatingAddress.howManyMiles")}
                        register={register}
                        validation={{ required: true, min: 0 }}
                        error={errors.radiusSize}
                        errorMessage={t("errors.requiredFieldError")}
                        type="number"
                        readerOnly
                        defaultValue={optionData?.radiusSize ?? null}
                        dataTestId={"preference-option-radius-size"}
                        inputProps={{
                          onChange: () => clearErrors("radiusSize"),
                        }}
                      />
                    </FieldValue>
                  )}
                </Grid.Cell>
              </Grid.Row>
              {collectAddressExpand && (
                <Grid.Row columns={3}>
                  <Grid.Cell className="pr-8">
                    <FieldValue label={t("settings.preferenceCollectAddressHolderName")}>
                      <FieldGroup
                        name="collectName"
                        type="radio"
                        register={register}
                        validation={{ required: true }}
                        error={errors.collectName}
                        fields={[
                          {
                            label: t("t.yes"),
                            value: YesNoAnswer.Yes,
                            defaultChecked: optionData?.collectName,
                            id: "collectNameYes",
                            dataTestId: "collect-name-yes",
                            inputProps: {
                              onChange: () => {
                                clearErrors("collectName")
                              },
                            },
                          },
                          {
                            label: t("t.no"),
                            value: YesNoAnswer.No,
                            defaultChecked:
                              optionData?.collectName !== undefined && !optionData?.collectName,
                            id: "collectNameNo",
                            dataTestId: "collect-name-no",
                            inputProps: {
                              onChange: () => {
                                clearErrors("collectName")
                              },
                            },
                          },
                        ]}
                        fieldClassName="m-0"
                        fieldGroupClassName="flex column items-center"
                        dataTestId={"preference-option-collect-name"}
                      />
                    </FieldValue>
                  </Grid.Cell>
                  <Grid.Cell className="pr-8">
                    <FieldValue label={t("settings.preferenceCollectAddressHolderRelationship")}>
                      <FieldGroup
                        name="collectRelationship"
                        type="radio"
                        register={register}
                        validation={{ required: true }}
                        error={errors.collectRelationship}
                        fields={[
                          {
                            label: t("t.yes"),
                            value: YesNoAnswer.Yes,
                            defaultChecked: optionData?.collectRelationship,
                            id: "collectRelationshipYes",
                            dataTestId: "collect-relationship-yes",
                            inputProps: {
                              onChange: () => {
                                clearErrors("collectRelationship")
                              },
                            },
                          },
                          {
                            label: t("t.no"),
                            value: YesNoAnswer.No,
                            defaultChecked:
                              optionData?.collectRelationship !== undefined &&
                              !optionData?.collectRelationship,
                            id: "collectRelationshipNo",
                            dataTestId: "collect-relationship-no",
                            inputProps: {
                              onChange: () => {
                                clearErrors("collectRelationship")
                              },
                            },
                          },
                        ]}
                        fieldClassName="m-0"
                        fieldGroupClassName="flex"
                        dataTestId={"preference-option-collect-relationship"}
                      />
                    </FieldValue>
                  </Grid.Cell>
                </Grid.Row>
              )}
            </SectionWithGrid>
          </Card.Section>
        </Card>
        <div className="pb-8">
          <Button
            type="button"
            className={"mt-4"}
            variant="primary"
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
              if (
                Object.keys(formState.errors).some((field) =>
                  [
                    "collectAddress",
                    "collectName",
                    "collectRelationship",
                    "validationMethod",
                    "radiusSize",
                  ].includes(field)
                )
              ) {
                return
              }

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
                exclusive: formData.exclusiveQuestion === "exclusive",
                collectAddress: formData.collectAddress === YesNoAnswer.Yes,
              }
              if (formData.collectAddress === YesNoAnswer.Yes) {
                newOptionData.validationMethod = formData.validationMethod
                newOptionData.collectRelationship = formData.collectRelationship === YesNoAnswer.Yes
                newOptionData.collectName = formData.collectName === YesNoAnswer.Yes
              }
              if (formData.validationMethod === ValidationMethod.radius && formData?.radiusSize) {
                newOptionData.radiusSize = parseFloat(formData.radiusSize)
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
            id={"preference-option-save"}
          >
            {t("t.save")}
          </Button>
        </div>
      </Drawer>
    </>
  )
}

export default PreferenceDrawer
