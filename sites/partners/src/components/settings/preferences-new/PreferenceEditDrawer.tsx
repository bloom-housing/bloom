import React, { useContext, useEffect, useMemo, useState } from "react"
import {
  Field,
  FieldGroup,
  MinimalTable,
  Select,
  StandardTableData,
  t,
  Textarea,
} from "@bloom-housing/ui-components"
import {
  Button,
  Card,
  Drawer,
  FieldValue,
  FormErrorMessage,
  Grid,
  Tag,
} from "@bloom-housing/ui-seeds"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { useForm } from "react-hook-form"
import {
  MultiselectOption,
  MultiselectOptionCreate,
  MultiselectQuestion,
  MultiselectQuestionCreate,
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
  MultiselectQuestionUpdate,
  ValidationMethodEnum,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import ManageIconSection from "../ManageIconSection"
import { DrawerType } from "./EditPreference"
import SectionWithGrid from "../../shared/SectionWithGrid"
import s from "./PreferenceEditDrawer.module.scss"
import { useMapLayersList } from "../../../lib/hooks"

type PreferenceEditDrawerProps = {
  drawerOpen: boolean
  questionData: MultiselectQuestion
  setQuestionData: React.Dispatch<React.SetStateAction<MultiselectQuestion>>
  drawerType: DrawerType
  onDrawerClose: () => void
  saveQuestion: (
    formattedData: MultiselectQuestionCreate | MultiselectQuestionUpdate,
    requestType: DrawerType
  ) => void
  copyQuestion: (data: MultiselectQuestionCreate) => void
  setDeleteConfirmModalOpen: React.Dispatch<React.SetStateAction<MultiselectQuestion>>
  isLoading: boolean
}

type OptionForm = {
  shouldCollectAddress: YesNoEnum
  validationMethod?: ValidationMethodEnum
  radiusSize?: string
  shouldCollectRelationship?: YesNoEnum
  shouldCollectName?: YesNoEnum
  exclusiveQuestion: "exclusive" | "multiselect"
  optionDescription: string
  optionLinkTitle: string
  optionTitle: string
  optionUrl: string
  canYouOptOut: YesNoEnum
  mapLayerId?: string
}

const alphaNumericPattern = /^[A-Z][a-zA-Z0-9 ']+$/

const PreferenceEditDrawer = ({
  drawerType,
  questionData,
  setQuestionData,
  drawerOpen,
  onDrawerClose,
  saveQuestion,
  copyQuestion,
  setDeleteConfirmModalOpen,
  isLoading,
}: PreferenceEditDrawerProps) => {
  const [optionDrawerOpen, setOptionDrawerOpen] = useState<DrawerType | null>(null)
  const [optionData, setOptionData] = useState<MultiselectOption>(null)
  const [dragOrder, setDragOrder] = useState([])

  const { profile } = useContext(AuthContext)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register,
    getValues,
    setValue,
    trigger,
    errors,
    clearErrors,
    setError,
    watch,
    formState,
  } = useForm()

  const { mapLayers } = useMapLayersList(watch("jurisdictionId"))

  const isAdditionalDetailsEnabled = profile?.jurisdictions?.some(
    (jurisdiction) => jurisdiction.enableGeocodingPreferences
  )

  const shouldCollectAddressExpand =
    ((optionData?.shouldCollectAddress && watch("shouldCollectAddress") === undefined) ||
      watch("shouldCollectAddress") === YesNoEnum.yes) &&
    isAdditionalDetailsEnabled
  const isValidationRadiusVisible =
    profile?.jurisdictions.find((juris) => juris.id === watch("jurisdictionId"))
      ?.enableGeocodingRadiusMethod ||
    profile?.jurisdictions.every((juris) => juris.enableGeocodingRadiusMethod)
  const radiusExpand =
    (optionData?.validationMethod === ValidationMethodEnum.radius &&
      watch("validationMethod") === undefined) ||
    watch("validationMethod") === ValidationMethodEnum.radius

  const mapExpand =
    (optionData?.validationMethod === ValidationMethodEnum.map &&
      watch("validationMethod") === undefined) ||
    watch("validationMethod") === ValidationMethodEnum.map

  // Update local state with dragged state
  useEffect(() => {
    if (questionData?.multiselectOptions?.length > 0 && dragOrder?.length > 0) {
      const newDragOrder = []
      dragOrder.forEach((item, index) => {
        newDragOrder.push({
          ...questionData?.multiselectOptions?.filter(
            (draftItem) => draftItem.name === item.name.content
          )[0],
          ordinal: index + 1,
        })
      })
      setQuestionData({ ...questionData, multiselectOptions: newDragOrder })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragOrder])

  const draggableTableData: StandardTableData = useMemo(
    () =>
      questionData?.multiselectOptions
        ?.sort((a, b) => (a.ordinal < b.ordinal ? -1 : 1))
        .map((item) => ({
          name: { content: item.name },
          description: { content: item.description },
          action: {
            content: (
              <ManageIconSection
                onCopy={() => {
                  const draftOptions = [...questionData.multiselectOptions]
                  draftOptions.push({
                    ...item,
                    ordinal: questionData.multiselectOptions.length + 1,
                  })
                  setQuestionData({ ...questionData, multiselectOptions: draftOptions })
                }}
                copyTestId={`option-copy-icon: ${item.name}`}
                onEdit={() => {
                  setOptionData(item)
                  setOptionDrawerOpen("edit")
                }}
                editTestId={`option-edit-icon: ${item.name}`}
                onDelete={() => {
                  setQuestionData({
                    ...questionData,
                    multiselectOptions: questionData.multiselectOptions
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

  let variant = null
  switch (questionData?.status) {
    case MultiselectQuestionsStatusEnum.active:
      variant = "success"
      break
    case MultiselectQuestionsStatusEnum.toRetire:
    case MultiselectQuestionsStatusEnum.retired:
      variant = "highlight-warm"
      break
  }
  const statusText = `${questionData?.status.charAt(0).toUpperCase()}${questionData?.status.slice(
    1
  )}`
  const statusTag = questionData?.status ? <Tag variant={variant}>{statusText}</Tag> : undefined

  let validationMethodsFields = [
    {
      label: t("settings.preferenceValidatingAddress.checkWithinRadius"),
      value: ValidationMethodEnum.radius,
      defaultChecked: optionData?.validationMethod === ValidationMethodEnum.radius,
      id: "validationMethodRadius",
      dataTestId: "validation-method-radius",
      inputProps: {
        onChange: () => {
          clearErrors("validationMethod")
        },
      },
    },
    {
      label: t("settings.preferenceValidatingAddress.checkWithArcGisMap"),
      value: ValidationMethodEnum.map,
      defaultChecked: optionData?.validationMethod === ValidationMethodEnum.map,
      id: "validationMethodMap",
      dataTestId: "validation-method-map",
      inputProps: {
        onChange: () => {
          clearErrors("validationMethod")
        },
      },
    },
    {
      label: t("settings.preferenceValidatingAddress.checkManually"),
      value: ValidationMethodEnum.none,
      defaultChecked: optionData?.validationMethod === ValidationMethodEnum.none,
      id: "validationMethodNone",
      dataTestId: "validation-method-none",
      inputProps: {
        onChange: () => {
          clearErrors("validationMethod")
        },
      },
    },
  ]

  if (!isValidationRadiusVisible) {
    validationMethodsFields = validationMethodsFields.filter(
      (field) => field.id !== "validationMethodRadius"
    )
  }

  /**
   * Saves the preference and the associated options
   */
  const savePreference = async () => {
    const validation = await trigger()
    if (!questionData || !questionData?.multiselectOptions?.length) {
      setError("questions", { message: t("errors.requiredFieldError") })
      return
    }
    if (!validation) return
    const formValues = getValues()
    if (!isValidationRadiusVisible) {
      questionData.multiselectOptions = questionData?.multiselectOptions.map((option) =>
        option.validationMethod === ValidationMethodEnum.radius
          ? {
              ...option,
              validationMethod: ValidationMethodEnum.none,
              radiusSize: undefined,
            }
          : option
      )
    }

    let newStatus = questionData?.status ?? MultiselectQuestionsStatusEnum.draft
    if (
      newStatus === MultiselectQuestionsStatusEnum.draft &&
      formValues.showOnListingQuestion === YesNoEnum.yes
    ) {
      newStatus = MultiselectQuestionsStatusEnum.visible
    } else if (
      newStatus === MultiselectQuestionsStatusEnum.visible &&
      formValues.showOnListingQuestion === YesNoEnum.no
    ) {
      newStatus = MultiselectQuestionsStatusEnum.draft
    }

    const formattedQuestionData: MultiselectQuestionUpdate | MultiselectQuestionCreate = {
      applicationSection: MultiselectQuestionsApplicationSectionEnum.preferences,
      description: formValues.description.trim(),
      hideFromListing: formValues.showOnListingQuestion === YesNoEnum.no,
      jurisdictions: [], // TODO: shouldn't this not be necessary anymore?
      jurisdiction: profile.jurisdictions.find((juris) => juris.id === formValues.jurisdictionId),
      links: formValues.preferenceUrl
        ? [{ title: formValues.preferenceLinkTitle.trim(), url: formValues.preferenceUrl.trim() }]
        : [],
      isExclusive: formValues.exclusiveQuestion === "exclusive",
      multiselectOptions: questionData?.multiselectOptions?.map((option) => {
        option.text = "" // TODO: shouldn't this not be necessary anymore?
        return option
      }),
      status: newStatus,
      name: formValues.name.trim(),
      text: "", // TODO: shouldn't this not be necessary anymore?
    }
    clearErrors()
    clearErrors("questions")
    saveQuestion(formattedQuestionData, drawerType)
  }

  const toggleVisibility = () => {
    setValue(
      "showOnListingQuestion",
      questionData?.status === MultiselectQuestionsStatusEnum.draft ? YesNoEnum.yes : YesNoEnum.no
    )
    void savePreference()
  }

  return (
    <>
      <Drawer
        isOpen={!!drawerOpen}
        onClose={() => {
          clearErrors()
          clearErrors("questions")
          onDrawerClose()
        }}
        ariaLabelledBy="preference-drawer-header"
      >
        <Drawer.Header id="preference-drawer-header">
          {drawerTitle} {statusTag}
        </Drawer.Header>
        <Drawer.Content>
          <Card>
            <Card.Section>
              <SectionWithGrid heading={t("settings.preference")}>
                <Grid.Row columns={3}>
                  <Grid.Cell className="seeds-grid-span-2">
                    <Field
                      id="name"
                      name="name"
                      label={t("t.title")}
                      placeholder={t("t.title")}
                      register={register}
                      type="text"
                      dataTestId={"preference-title"}
                      defaultValue={questionData?.name}
                      errorMessage={`${t("errors.requiredFieldError")}. ${t(
                        "errors.alphaNumericError"
                      )}`}
                      validation={{ required: true, pattern: alphaNumericPattern, maxLength: 32 }}
                      error={errors.name}
                      inputProps={{
                        onChange: () => clearErrors("name"),
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
                      defaultValue={
                        questionData?.links?.length > 0 ? questionData?.links[0].url : ""
                      }
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
              {questionData?.multiselectOptions?.length > 0 && (
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
                  variant={errors["questions"] ? "alert-outlined" : "primary-outlined"}
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
                          defaultChecked: !questionData?.isExclusive,
                          dataTestId: "exclusive-question-multiselect",
                        },
                        {
                          id: "exclusive",
                          label: t("settings.preferenceExclusive"),
                          value: "exclusive",
                          defaultChecked: questionData?.isExclusive,
                          dataTestId: "exclusive-question-exclusive",
                        },
                      ]}
                      fieldClassName="m-0"
                      fieldGroupClassName="flex h-12 items-center"
                      dataTestId={"preference-exclusive-question"}
                    />
                  </FieldValue>
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
                          value: YesNoEnum.yes,
                          defaultChecked: questionData && !questionData?.hideFromListing,
                          dataTestId: "show-on-listing-question-yes",
                        },
                        {
                          id: "showOnListingNo",
                          label: t("t.no"),
                          value: YesNoEnum.no,
                          defaultChecked: questionData === null || questionData?.hideFromListing,
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
                              ...(profile?.jurisdictions || []).map((jurisdiction) => ({
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
        </Drawer.Content>
        <Drawer.Footer>
          <Button
            type="button"
            variant="primary"
            loadingMessage={isLoading && t("t.formSubmitted")}
            onClick={savePreference}
            id={"preference-save-button"}
          >
            {t("t.save")}
          </Button>
          <Button type="button" variant="primary-outlined" onClick={toggleVisibility}>
            {questionData?.status === MultiselectQuestionsStatusEnum.draft
              ? "Show to Partners"
              : "Hide from Partners"}
          </Button>
          {
            // TODO: how does a Copy button work when adding a new preference?
          }
          <Button
            type="button"
            variant="primary-outlined"
            className="ml-auto"
            onClick={() => {
              copyQuestion(questionData)
              onDrawerClose()
            }}
          >
            {t("actions.copy")}
          </Button>
          <Button
            type="button"
            variant="alert-outlined"
            onClick={() => {
              if (drawerType === "edit") {
                setDeleteConfirmModalOpen(questionData)
              }
              onDrawerClose()
            }}
          >
            {t("t.delete")}
          </Button>
        </Drawer.Footer>
      </Drawer>

      <Drawer
        isOpen={!!optionDrawerOpen}
        onClose={() => {
          setOptionDrawerOpen(null)
        }}
        ariaLabelledBy="preference-nested-drawer-header"
        nested
      >
        <Drawer.Header id="preference-nested-drawer-header">{selectDrawerTitle}</Drawer.Header>
        <Drawer.Content>
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
                        validation={{ required: true, pattern: alphaNumericPattern }}
                        type="text"
                        readerOnly
                        dataTestId={"preference-option-title"}
                        defaultValue={optionData?.name}
                        errorMessage={`${t("errors.requiredFieldError")}. ${t(
                          "errors.alphaNumericError"
                        )}`}
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
                  <Grid.Cell>
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
                  </Grid.Cell>
                  <Grid.Cell>
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
                        defaultValue={
                          optionData?.links?.length > 0 ? optionData?.links[0].title : ""
                        }
                      />
                    </FieldValue>
                  </Grid.Cell>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Cell>
                    <div className="pb-4">
                      <FieldGroup
                        name="canYouOptOut"
                        type="radio"
                        register={register}
                        groupLabel={t("settings.preferenceOptOut")}
                        fields={[
                          {
                            id: "optOutYes",
                            label: t("t.yes"),
                            value: YesNoEnum.yes,
                            defaultChecked: optionData?.isOptOut,
                            dataTestId: "opt-out-question-yes",
                          },
                          {
                            id: "optOutNo",
                            label: t("t.no"),
                            value: YesNoEnum.no,
                            defaultChecked:
                              optionData?.isOptOut !== undefined && optionData?.isOptOut === false,
                            dataTestId: "opt-out-question-no",
                          },
                        ]}
                        fieldClassName="m-0"
                        fieldGroupClassName="flex h-12 items-center"
                        dataTestId={"preference-can-you-opt-out"}
                      />
                    </div>
                  </Grid.Cell>
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
                        name="shouldCollectAddress"
                        type="radio"
                        register={register}
                        validation={{ required: true }}
                        error={errors.shouldCollectAddress}
                        fields={[
                          {
                            label: t("t.yes"),
                            value: YesNoEnum.yes,
                            defaultChecked: optionData?.shouldCollectAddress,
                            id: "shouldCollectAddressYes",
                            dataTestId: "collect-address-yes",
                            inputProps: {
                              onChange: () => {
                                clearErrors("shouldCollectAddress")
                              },
                            },
                          },
                          {
                            label: t("t.no"),
                            value: YesNoEnum.no,
                            defaultChecked:
                              optionData?.shouldCollectAddress !== undefined &&
                              optionData?.shouldCollectAddress === false,
                            id: "shouldCollectAddressNo",
                            dataTestId: "collect-address-no",
                            inputProps: {
                              onChange: () => {
                                clearErrors("shouldCollectAddress")
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
                    {shouldCollectAddressExpand && (
                      <FieldValue label={t("settings.preferenceValidatingAddress")}>
                        <FieldGroup
                          name="validationMethod"
                          type="radio"
                          register={register}
                          validation={{ required: true }}
                          error={errors.validationMethod}
                          fields={validationMethodsFields}
                          fieldClassName="m-0"
                          fieldGroupClassName="flex flex-col"
                          dataTestId={"preference-option-validation-method"}
                        />
                      </FieldValue>
                    )}
                  </Grid.Cell>
                  <Grid.Cell className="pr-8">
                    {shouldCollectAddressExpand && radiusExpand && isValidationRadiusVisible && (
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
                    {shouldCollectAddressExpand && mapExpand && (
                      <FieldValue label={t("settings.preferenceValidatingAddress.selectMapLayer")}>
                        <p className={s.helperText}>
                          {t("settings.preferenceValidatingAddress.selectMapLayerDescription")}
                        </p>
                        <Select
                          id={"mapLayerId"}
                          name={"mapLayerId"}
                          register={register}
                          label={t("settings.preferenceValidatingAddress.selectMapLayer")}
                          labelClassName="sr-only"
                          controlClassName={"control"}
                          options={
                            mapLayers
                              ? [
                                  { label: "", value: "" },
                                  ...mapLayers.map((layer) => ({
                                    label: layer.name,
                                    value: layer.id,
                                  })),
                                ]
                              : [{ label: "", value: "" }]
                          }
                          dataTestId={"preference-map-layer"}
                          defaultValue={optionData?.mapLayerId ?? null}
                          errorMessage={t("errors.requiredFieldError")}
                          error={errors.mapLayerId}
                          validation={{ required: true }}
                          inputProps={{
                            onChange: () => clearErrors("mapLayerId"),
                          }}
                        />
                      </FieldValue>
                    )}
                  </Grid.Cell>
                </Grid.Row>
                {shouldCollectAddressExpand && (
                  <Grid.Row columns={3}>
                    <Grid.Cell className="pr-8">
                      <FieldValue label={t("settings.preferenceCollectAddressHolderName")}>
                        <FieldGroup
                          name="shouldCollectName"
                          type="radio"
                          register={register}
                          validation={{ required: true }}
                          error={errors.shouldCollectName}
                          fields={[
                            {
                              label: t("t.yes"),
                              value: YesNoEnum.yes,
                              defaultChecked: optionData?.shouldCollectName,
                              id: "shouldCollectNameYes",
                              dataTestId: "collect-name-yes",
                              inputProps: {
                                onChange: () => {
                                  clearErrors("shouldCollectName")
                                },
                              },
                            },
                            {
                              label: t("t.no"),
                              value: YesNoEnum.no,
                              defaultChecked:
                                optionData?.shouldCollectName !== undefined &&
                                !optionData?.shouldCollectName,
                              id: "shouldCollectNameNo",
                              dataTestId: "collect-name-no",
                              inputProps: {
                                onChange: () => {
                                  clearErrors("shouldCollectName")
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
                          name="shouldCollectRelationship"
                          type="radio"
                          register={register}
                          validation={{ required: true }}
                          error={errors.shouldCollectRelationship}
                          fields={[
                            {
                              label: t("t.yes"),
                              value: YesNoEnum.yes,
                              defaultChecked: optionData?.shouldCollectRelationship,
                              id: "shouldCollectRelationshipYes",
                              dataTestId: "collect-relationship-yes",
                              inputProps: {
                                onChange: () => {
                                  clearErrors("shouldCollectRelationship")
                                },
                              },
                            },
                            {
                              label: t("t.no"),
                              value: YesNoEnum.no,
                              defaultChecked:
                                optionData?.shouldCollectRelationship !== undefined &&
                                !optionData?.shouldCollectRelationship,
                              id: "shouldCollectRelationshipNo",
                              dataTestId: "collect-relationship-no",
                              inputProps: {
                                onChange: () => {
                                  clearErrors("shouldCollectRelationship")
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
        </Drawer.Content>
        <Drawer.Footer>
          <Button
            type="button"
            variant="primary"
            onClick={async () => {
              const formData = getValues() as OptionForm
              await trigger()
              if (!formData.optionTitle || formData.optionTitle === "") {
                setError("optionTitle", { message: t("errors.requiredFieldError") })
                return
              }
              if (formState.errors.optionUrl) return
              const existingOptionData = questionData?.multiselectOptions?.find(
                (option) => optionData?.ordinal === option.ordinal
              )
              if (
                Object.keys(formState.errors).some((field) =>
                  [
                    "shouldCollectAddress",
                    "shouldCollectName",
                    "shouldCollectRelationship",
                    "validationMethod",
                    "radiusSize",
                    "mapLayerId",
                  ].includes(field)
                )
              ) {
                return
              }

              const getNewOrdinal = () => {
                if (existingOptionData) return existingOptionData.ordinal
                return questionData?.multiselectOptions?.length
                  ? questionData?.multiselectOptions.length + 1
                  : 1
              }

              const newOptionData: MultiselectOptionCreate = {
                name: formData.optionTitle.trim(),
                description: formData.optionDescription.trim(),
                links: formData.optionUrl
                  ? [{ title: formData.optionLinkTitle, url: formData.optionUrl }]
                  : [],
                ordinal: getNewOrdinal(),
                shouldCollectAddress: formData.shouldCollectAddress === YesNoEnum.yes,
                isOptOut: formData.canYouOptOut === YesNoEnum.yes,
                text: "",
              }
              if (formData.shouldCollectAddress === YesNoEnum.yes) {
                newOptionData.validationMethod = formData.validationMethod
                newOptionData.shouldCollectRelationship =
                  formData.shouldCollectRelationship === YesNoEnum.yes
                newOptionData.shouldCollectName = formData.shouldCollectName === YesNoEnum.yes
              }
              if (
                formData.validationMethod === ValidationMethodEnum.radius &&
                formData?.radiusSize
              ) {
                newOptionData.radiusSize = parseFloat(formData.radiusSize)
              }
              if (formData.validationMethod === ValidationMethodEnum.map && formData?.mapLayerId) {
                newOptionData.mapLayerId = formData.mapLayerId
              }

              let newOptions = []
              if (existingOptionData) {
                newOptions = questionData.multiselectOptions.map((option) =>
                  option.ordinal === existingOptionData.ordinal ? newOptionData : option
                )
              } else {
                newOptions = questionData?.multiselectOptions
                  ? [...questionData.multiselectOptions, newOptionData]
                  : [newOptionData]
              }
              setQuestionData({ ...questionData, multiselectOptions: newOptions })
              setOptionDrawerOpen(null)
            }}
            id={"preference-option-save"}
          >
            {t("t.save")}
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  )
}

export default PreferenceEditDrawer
