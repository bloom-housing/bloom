import React, { useState, useCallback, useEffect, useMemo } from "react"
import {
  t,
  GridSection,
  StatusAside,
  StatusMessages,
  ViewItem,
  GridCell,
  DOBField,
  Field,
  emailRegex,
  PhoneField,
  Select,
  contactPreferencesKeys,
  altContactRelationshipKeys,
  AppearanceSizeType,
  ethnicityKeys,
  raceKeys,
  genderKeys,
  sexualOrientation,
  howDidYouHear,
  FieldGroup,
  Button,
  LinkButton,
  Form,
  AlertBox,
  Drawer,
  MinimalTable,
  Modal,
  AppearanceStyleType,
  AppearanceBorderType,
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import { phoneNumberKeys } from "@bloom-housing/ui-components/src/helpers/formOptions"
import { ApplicationFormMember } from "./ApplicationFormMember"
import { ApplicationFormAddress } from "./ApplicationFormAddress"
import { HouseholdMember } from "@bloom-housing/core"

type Props = {
  isEditable?: boolean
}

const ApplicationForm = ({ isEditable }: Props) => {
  const [errorAlert, setErrorAlert] = useState(false)
  const [membersDrawer, setMembersDrawer] = useState<string | boolean>(false)
  const [membersDeleteModal, setMembersDeleteModal] = useState<string | boolean>(false)

  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>([])

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, control, handleSubmit, errors, setValue, clearErrors } = useForm()

  const mailingAddressValue: boolean = watch("application.sendMailToMailingAddress")
  const workInRegionValue: "yes" | "no" = watch("application.applicant.workInRegion")
  const phoneValue: string = watch("application.applicant.phoneNumber")
  const alternatePhoneValue: string = watch("application.alternateContact.phoneNumber")
  const additionalPhoneValue: string = watch("application.additionalPhoneNumber")
  const incomePeriodValue: string = watch("application.incomePeriod")

  // reset phone type field when phone is empty
  useEffect(() => {
    const fieldKey = "application.applicant.phoneNumberType"
    if (!phoneValue?.length) {
      setValue(fieldKey, "")
      clearErrors(fieldKey)
    }
  }, [setValue, clearErrors, phoneValue])

  // reset additional phone type field when additional phone is empty
  useEffect(() => {
    const fieldKey = "application.additionalPhoneNumberType"
    if (!additionalPhoneValue?.length) {
      setValue(fieldKey, "")
      clearErrors(fieldKey)
    }
  }, [setValue, clearErrors, additionalPhoneValue])

  // reset alternate phone type field when phone is empty
  useEffect(() => {
    const fieldKey = "application.alternateContact.phoneNumberType"
    if (!alternatePhoneValue?.length) {
      setValue(fieldKey, "")
      clearErrors(fieldKey)
    }
  }, [setValue, clearErrors, alternatePhoneValue])

  function saveMember(newMember: HouseholdMember) {
    const isExists = householdMembers.find((member) => member.id === newMember.id)

    if (isExists) {
      const withoutEdited = householdMembers.filter((member) => member.id !== newMember.id)
      setHouseholdMembers([...withoutEdited, newMember])
    } else {
      setHouseholdMembers([...householdMembers, newMember])
    }
  }

  const onSubmit = (data) => {
    setErrorAlert(false)

    console.log(data)
  }

  const onError = (error) => {
    setErrorAlert(true)
    console.log("Submit ERROR", error)
  }

  const contactPreferencesOptions = contactPreferencesKeys?.map((item) => item.id)
  const altContactRelationshipOptions = ["", ...altContactRelationshipKeys]
  const howDidYouHearOptions = useMemo(() => {
    return howDidYouHear?.map((item) => ({
      id: item.id,
      label: t(`application.review.demographics.howDidYouHearOptions.${item.id}`),
      register,
    }))
  }, [register])

  const editMember = useCallback(
    (id: string) => {
      setMembersDrawer(id)
    },
    [setMembersDrawer]
  )

  const deleteMember = useCallback(
    (id: string) => {
      const updatedMembers = householdMembers.filter((member) => member.id !== id)
      setHouseholdMembers(updatedMembers)
      setMembersDeleteModal(false)
    },
    [setMembersDeleteModal, setHouseholdMembers, householdMembers]
  )

  const memberTableHeaders = {
    name: t("t.name"),
    relationship: t("t.relationship"),
    dob: t("application.household.member.dateOfBirth"),
    sameResidence: t("application.add.sameResidence"),
    workInRegion: t("application.details.workInRegion"),
    action: "",
  }

  const memberTableData = useMemo(() => {
    const chooseAddressStatus = (value: string | null) => {
      switch (value) {
        case "yes":
          return t("t.yes")
        case "no":
          return t("t.no")
        default:
          return t("t.n/a")
      }
    }

    return householdMembers.map((member) => {
      const { birthMonth, birthDay, birthYear } = member

      return {
        name:
          (member.firstName + member.lastName).length > 0
            ? `${member.firstName} ${member.lastName}`
            : t("n/a"),
        relationship: member.relationship
          ? t(`application.form.options.relationship.${member.relationship}`)
          : t("t.n/a"),
        dob:
          birthMonth && birthDay && birthYear
            ? `${member.birthMonth}/${member.birthDay}/${member.birthYear}`
            : t("t.n/a"),
        sameResidence: chooseAddressStatus(member.sameAddress),
        workInRegion: chooseAddressStatus(member.workInRegion),
        action: (
          <div className="flex">
            <Button
              type="button"
              className="font-semibold uppercase"
              onClick={() => editMember(member.id)}
              unstyled
            >
              {t("t.edit")}
            </Button>
            <Button
              type="button"
              className="font-semibold uppercase text-red-700"
              onClick={() => setMembersDeleteModal(member.id)}
              unstyled
            >
              {t("t.delete")}
            </Button>
          </div>
        ),
      }
    })
  }, [editMember, householdMembers])

  return (
    <>
      <section className="bg-primary-lighter">
        {errorAlert && (
          <AlertBox onClose={() => setErrorAlert(false)} closeable>
            {t("application.add.applicationAddError")}
          </AlertBox>
        )}
        <Form id="application-form" onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="flex flex-row flex-wrap mx-auto px-5 mt-5 max-w-screen-xl">
            <div className="info-card md:w-9/12">
              <GridSection title={t("application.household.primaryApplicant")} grid={false}>
                <GridSection columns={3}>
                  <GridCell>
                    <ViewItem label={t("application.name.firstName")}>
                      <Field
                        id="application.applicant.firstName"
                        name="application.applicant.firstName"
                        label={t("application.name.firstName")}
                        placeholder={t("application.name.firstName")}
                        register={register}
                        readerOnly
                      />
                    </ViewItem>
                  </GridCell>
                  <GridCell>
                    <ViewItem label={t("application.name.middleName")}>
                      <Field
                        id="application.applicant.middleName"
                        name="application.applicant.middleName"
                        label={t("application.name.middleNameOptional")}
                        placeholder={t("application.name.middleNameOptional")}
                        register={register}
                        readerOnly
                      />
                    </ViewItem>
                  </GridCell>
                  <GridCell>
                    <ViewItem label={t("application.name.lastName")}>
                      <Field
                        id="application.applicant.lastName"
                        name="application.applicant.lastName"
                        label={t("application.name.lastName")}
                        placeholder={t("application.name.lastName")}
                        register={register}
                        readerOnly
                      />
                    </ViewItem>
                  </GridCell>
                  <GridCell>
                    <ViewItem label={t("application.household.member.dateOfBirth")}>
                      <DOBField
                        id="dateOfBirth"
                        name="dateOfBirth"
                        register={register}
                        error={errors?.dateOfBirth}
                        watch={watch}
                        atAge={true}
                        label={t("application.name.yourDateOfBirth")}
                        readerOnly
                      />
                    </ViewItem>
                  </GridCell>
                  <GridCell>
                    <ViewItem label={t("t.email")}>
                      <Field
                        id="application.applicant.emailAddress"
                        name="application.applicant.emailAddress"
                        type="email"
                        placeholder="example@web.com"
                        label={t("application.name.yourEmailAddress")}
                        readerOnly={true}
                        validation={{ pattern: emailRegex }}
                        error={errors.application?.applicant?.emailAddress}
                        errorMessage={t("errors.emailAddressError")}
                        register={register}
                      />
                    </ViewItem>
                  </GridCell>
                  <GridCell>
                    <ViewItem label={t("t.phone")}>
                      <PhoneField
                        id="application.applicant.phoneNumber"
                        name="application.applicant.phoneNumber"
                        label={t("application.contact.yourPhoneNumber")}
                        required={false}
                        error={errors.application?.applicant?.phoneNumber}
                        errorMessage={t("errors.phoneNumberError")}
                        control={control}
                        controlClassName="control"
                        readerOnly
                      />
                    </ViewItem>
                  </GridCell>
                  <GridCell>
                    <ViewItem label={t("applications.table.phoneType")}>
                      <Select
                        id="application.applicant.phoneNumberType"
                        name="application.applicant.phoneNumberType"
                        placeholder={t("application.contact.phoneNumberTypes.prompt")}
                        label={t("application.contact.phoneNumberTypes.prompt")}
                        labelClassName="sr-only"
                        error={errors.application?.applicant?.phoneNumberType}
                        errorMessage={t("errors.phoneNumberTypeError")}
                        register={register}
                        controlClassName="control"
                        options={phoneNumberKeys}
                        keyPrefix="application.contact.phoneNumberTypes"
                        validation={{ required: phoneValue?.length > 0 }}
                        disabled={!phoneValue?.length}
                      />
                    </ViewItem>
                  </GridCell>
                  <GridCell>
                    <ViewItem label={t("t.additionalPhone")}>
                      <PhoneField
                        id="application.additionalPhoneNumber"
                        name="application.additionalPhoneNumber"
                        label={t("application.contact.yourAdditionalPhoneNumber")}
                        required={false}
                        error={errors.application?.additionalPhoneNumber}
                        errorMessage={t("errors.phoneNumberError")}
                        control={control}
                        controlClassName="control"
                        readerOnly
                      />
                    </ViewItem>
                  </GridCell>
                  <GridCell>
                    <ViewItem label={t("applications.table.additionalPhoneType")}>
                      <Select
                        id="application.additionalPhoneNumberType"
                        name="application.additionalPhoneNumberType"
                        error={errors.application?.additionalPhoneNumberType}
                        errorMessage={t("errors.phoneNumberTypeError")}
                        register={register}
                        controlClassName="control"
                        placeholder={t("application.contact.phoneNumberTypes.prompt")}
                        label={t("application.contact.phoneNumberTypes.prompt")}
                        labelClassName={"sr-only"}
                        options={phoneNumberKeys}
                        keyPrefix="application.contact.phoneNumberTypes"
                        validation={{ required: additionalPhoneValue?.length > 0 }}
                        disabled={!additionalPhoneValue?.length}
                      />
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.contact.preferredContactType")}>
                      <Select
                        id="contactPreferences"
                        name="contactPreferences"
                        label={t("application.contact.preferredContactType")}
                        labelClassName="sr-only"
                        register={register}
                        controlClassName="control"
                        options={contactPreferencesOptions}
                        keyPrefix="t"
                      />
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.add.workInRegion")}>
                      <div className="flex h-12 items-center">
                        <Field
                          id="application.applicant.workInRegionYes"
                          name="application.applicant.workInRegion"
                          className="m-0"
                          type="radio"
                          label={t("t.yes")}
                          register={register}
                          inputProps={{
                            value: "yes",
                          }}
                        />

                        <Field
                          id="application.applicant.workInRegionNo"
                          name="application.applicant.workInRegion"
                          className="m-0"
                          type="radio"
                          label={t("t.no")}
                          register={register}
                          inputProps={{
                            value: "no",
                          }}
                        />
                      </div>
                    </ViewItem>
                  </GridCell>
                </GridSection>

                {ApplicationFormAddress(
                  t("application.details.residenceAddress"),
                  "application.applicant.address",
                  "residence",
                  register
                )}

                {mailingAddressValue &&
                  ApplicationFormAddress(
                    t("application.contact.mailingAddress"),
                    "application.mailingAddress",
                    "mailing",
                    register
                  )}

                {workInRegionValue === "yes" &&
                  ApplicationFormAddress(
                    t("application.contact.workAddress"),
                    "application.applicant.workAddress",
                    "work",
                    register
                  )}
              </GridSection>

              <GridSection
                title={t("application.alternateContact.type.label")}
                columns={3}
                separator
              >
                <GridCell>
                  <ViewItem label={t("application.name.firstName")}>
                    <Field
                      id="application.alternateContact.firstName"
                      name="application.alternateContact.firstName"
                      label={t("application.name.firstName")}
                      placeholder={t("application.name.firstName")}
                      register={register}
                      readerOnly
                    />
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.name.lastName")}>
                    <Field
                      id="application.alternateContact.lastName"
                      name="application.alternateContact.lastName"
                      placeholder={t("application.name.lastName")}
                      register={register}
                      label={t("application.name.lastName")}
                      readerOnly
                    />
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("t.relationship")}>
                    <Select
                      id="application.alternateContact.relationship"
                      name="application.alternateContact.relationship"
                      label={t("t.relationship")}
                      labelClassName="sr-only"
                      register={register}
                      controlClassName="control"
                      options={altContactRelationshipOptions}
                      keyPrefix="application.alternateContact.type.options"
                    />
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.details.agency")}>
                    <Field
                      id="application.alternateContact.agency"
                      name="application.alternateContact.agency"
                      label={t("application.details.agency")}
                      placeholder={t(
                        "application.alternateContact.name.caseManagerAgencyFormPlaceHolder"
                      )}
                      register={register}
                      readerOnly
                    />
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("t.email")}>
                    <Field
                      id="application.alternateContact.emailAddress"
                      name="application.alternateContact.emailAddress"
                      type="email"
                      placeholder="example@web.com"
                      label={t("t.email")}
                      validation={{ pattern: emailRegex }}
                      error={errors.application?.alternateContact?.emailAddress}
                      errorMessage={t("errors.emailAddressError")}
                      register={register}
                      readerOnly
                    />
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("t.phone")}>
                    <PhoneField
                      id="application.alternateContact.phoneNumber"
                      name="application.alternateContact.phoneNumber"
                      required={false}
                      error={errors.application?.alternateContact?.phoneNumber}
                      errorMessage={t("errors.phoneNumberError")}
                      control={control}
                      controlClassName="control"
                      label={t("t.phone")}
                      readerOnly
                    />
                  </ViewItem>
                </GridCell>
              </GridSection>

              <GridSection
                title={t("application.household.householdMembers")}
                grid={false}
                separator
              >
                <div className="bg-gray-300 px-4 py-5">
                  {!!householdMembers.length && (
                    <div className="mb-5">
                      <MinimalTable headers={memberTableHeaders} data={memberTableData} />
                    </div>
                  )}

                  <Button
                    type="button"
                    size={AppearanceSizeType.normal}
                    onClick={() => setMembersDrawer(true)}
                  >
                    {t("application.add.addHouseholdMember")}
                  </Button>
                </div>
              </GridSection>

              <GridSection title={t("application.review.householdDetails")} columns={1} separator>
                <GridCell>
                  <ViewItem label={t("application.details.adaPriorities")}>
                    <fieldset className="mt-4">
                      <Field
                        id="application.accessibility.mobility"
                        name="application.accessibility.mobility"
                        type="checkbox"
                        label={t("application.add.mobility")}
                        register={register}
                      />

                      <Field
                        id="application.accessibility.vision"
                        name="application.accessibility.vision"
                        type="checkbox"
                        label={t("application.add.vision")}
                        register={register}
                      />

                      <Field
                        id="application.accessibility.hearing"
                        name="application.accessibility.hearing"
                        type="checkbox"
                        label={t("application.add.hearing")}
                        register={register}
                      />
                    </fieldset>
                  </ViewItem>
                </GridCell>
              </GridSection>

              <GridSection title={t("application.details.preferences")} columns={1} separator>
                <GridCell>
                  <ViewItem
                    label={`${t("application.details.liveOrWorkIn")} ${t(
                      "application.details.countyName"
                    )}`}
                  >
                    <fieldset className="mt-4">
                      <Field
                        id="application.preferences.liveIn"
                        name="application.preferences.liveIn"
                        type="checkbox"
                        label={`${t("application.add.preferences.liveIn")} ${t(
                          "application.details.countyName"
                        )}`}
                        register={register}
                        inputProps={{
                          onChange: () => {
                            setValue("application.preferences.none", false)
                          },
                        }}
                      />

                      <Field
                        id="application.preferences.workIn"
                        name="application.preferences.workIn"
                        type="checkbox"
                        label={`${t("application.add.preferences.workIn")} ${t(
                          "application.details.countyName"
                        )}`}
                        register={register}
                        inputProps={{
                          onChange: () => {
                            setValue("application.preferences.none", false)
                          },
                        }}
                      />

                      <Field
                        id="application.preferences.none"
                        name="application.preferences.none"
                        type="checkbox"
                        label={t("application.add.preferences.optedOut")}
                        register={register}
                        inputProps={{
                          onChange: () => {
                            setValue("application.preferences.liveIn", false)
                            setValue("application.preferences.workIn", false)
                          },
                        }}
                      />
                    </fieldset>
                  </ViewItem>
                </GridCell>
              </GridSection>

              <GridSection title={t("application.details.householdIncome")} grid={false} separator>
                <GridSection columns={3}>
                  <GridCell>
                    <ViewItem label={t("application.add.incomePeriod")}>
                      <div className="flex h-12 items-center">
                        <Field
                          id="application.incomePeriodYear"
                          name="application.incomePeriod"
                          className="m-0"
                          type="radio"
                          label={t("t.perYear")}
                          register={register}
                          inputProps={{
                            value: "perYear",
                            onChange: () => {
                              setValue("incomeMonth", "")
                              setValue("incomeYear", "")
                            },
                          }}
                        />

                        <Field
                          id="application.incomePeriodMonth"
                          name="application.incomePeriod"
                          className="m-0"
                          type="radio"
                          label={t("t.perMonth")}
                          register={register}
                          inputProps={{
                            value: "perMonth",
                            onChange: () => {
                              setValue("incomeMonth", "")
                              setValue("incomeYear", "")
                            },
                          }}
                        />
                      </div>
                    </ViewItem>
                  </GridCell>
                </GridSection>

                <GridSection columns={3}>
                  <GridCell>
                    <ViewItem label={t("application.details.annualIncome")}>
                      <Field
                        id="incomeMonth"
                        type="number"
                        name="incomeMonth"
                        label={t("application.details.annualIncome")}
                        placeholder={t("t.enterAmount")}
                        register={register}
                        disabled={incomePeriodValue !== "perYear"}
                        readerOnly
                      />
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.details.monthlyIncome")}>
                      <Field
                        id="incomeYear"
                        type="number"
                        name="incomeYear"
                        label={t("application.details.annualIncome")}
                        placeholder={t("t.enterAmount")}
                        register={register}
                        disabled={incomePeriodValue !== "perMonth"}
                        readerOnly
                      />
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.details.vouchers")}>
                      <Select
                        id="application.incomeVouchers"
                        name="application.incomeVouchers"
                        placeholder={t("t.selectOne")}
                        label={t("application.details.vouchers")}
                        labelClassName="sr-only"
                        register={register}
                        controlClassName="control"
                        options={["yes", "no"]}
                        keyPrefix="t"
                      />
                    </ViewItem>
                  </GridCell>
                </GridSection>
              </GridSection>

              <GridSection
                title={t("application.add.demographicsInformation")}
                columns={3}
                separator
              >
                <GridCell>
                  <ViewItem label={t("application.add.ethnicity")}>
                    <Select
                      id="application.demographics.ethnicity"
                      name="application.demographics.ethnicity"
                      placeholder={t("t.selectOne")}
                      label={t("application.add.ethnicity")}
                      labelClassName="sr-only"
                      register={register}
                      controlClassName="control"
                      options={ethnicityKeys}
                      keyPrefix="application.review.demographics.ethnicityOptions"
                    />
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.add.race")}>
                    <Select
                      id="application.demographics.race"
                      name="application.demographics.race"
                      placeholder={t("t.selectOne")}
                      label={t("application.add.race")}
                      labelClassName="sr-only"
                      register={register}
                      controlClassName="control"
                      options={raceKeys}
                      keyPrefix="application.review.demographics.raceOptions"
                    />
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.add.gender")}>
                    <Select
                      id="application.demographics.gender"
                      name="application.demographics.gender"
                      placeholder={t("t.selectOne")}
                      label={t("application.add.gender")}
                      labelClassName="sr-only"
                      register={register}
                      controlClassName="control"
                      options={genderKeys}
                      keyPrefix="application.review.demographics.genderOptions"
                    />
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.add.sexualOrientation")}>
                    <Select
                      id="application.demographics.sexualOrientation"
                      name="application.demographics.sexualOrientation"
                      placeholder={t("t.selectOne")}
                      label={t("application.add.sexualOrientation")}
                      labelClassName="sr-only"
                      register={register}
                      controlClassName="control"
                      options={sexualOrientation}
                      keyPrefix="application.review.demographics.sexualOrientationOptions"
                    />
                  </ViewItem>
                </GridCell>

                <GridCell span={2}>
                  <ViewItem label={t("application.add.howDidYouHearAboutUs")}>
                    <FieldGroup
                      type="checkbox"
                      name="application.demographics.howDidYouHear"
                      fields={howDidYouHearOptions}
                      register={register}
                      fieldGroupClassName="grid grid-cols-2 mt-4"
                    />
                  </ViewItem>
                </GridCell>
              </GridSection>

              <GridSection title={t("application.review.terms.title")} separator>
                <GridCell>
                  <ViewItem label={t("application.details.signatureOnTerms")}>
                    <div className="flex h-12 items-center">
                      <Field
                        id="application.acceptedTermsYes"
                        name="application.acceptedTerms"
                        className="m-0"
                        type="radio"
                        label={t("t.yes")}
                        register={register}
                        inputProps={{
                          value: "yes",
                        }}
                      />

                      <Field
                        id="application.acceptedTermsNo"
                        name="application.acceptedTerms"
                        className="m-0"
                        type="radio"
                        label={t("t.no")}
                        register={register}
                        inputProps={{
                          value: "no",
                        }}
                      />
                    </div>
                  </ViewItem>
                </GridCell>
              </GridSection>
            </div>

            <aside className="md:w-3/12 md:pl-6">
              <StatusAside
                columns={1}
                actions={[
                  <GridCell>
                    <Button
                      styleType={AppearanceStyleType.primary}
                      fullWidth
                      onClick={() => {
                        //
                      }}
                    >
                      Submit
                    </Button>
                  </GridCell>,
                  <GridCell>
                    <Button
                      styleType={AppearanceStyleType.secondary}
                      fullWidth
                      onClick={() => {
                        //
                      }}
                    >
                      Submit &amp; New
                    </Button>
                  </GridCell>,
                  <GridCell className="flex">
                    <LinkButton unstyled fullWidth className="bg-opacity-0" href="/applications">
                      Cancel
                    </LinkButton>
                  </GridCell>,
                ]}
              >
                <StatusMessages lastTimestamp="Whatever" />
              </StatusAside>
            </aside>
          </div>
        </Form>

        <Drawer
          open={!!membersDrawer}
          title={t("application.household.householdMember")}
          ariaDescription={t("application.household.householdMember")}
          onClose={() => setMembersDrawer(!membersDrawer)}
        >
          <ApplicationFormMember
            onSubmit={(member) => saveMember(member)}
            onClose={() => setMembersDrawer(false)}
            members={householdMembers}
            editedMemberId={membersDrawer}
          />
        </Drawer>

        <Modal
          open={!!membersDeleteModal}
          title={t("application.deleteThisMember")}
          ariaDescription={t("application.deleteMemberDescription")}
          onClose={() => setMembersDeleteModal(false)}
          actions={[
            <Button
              styleType={AppearanceStyleType.alert}
              onClick={() => {
                if (typeof membersDeleteModal === "string") {
                  deleteMember(membersDeleteModal)
                }
              }}
            >
              {t("t.delete")}
            </Button>,
            <Button
              styleType={AppearanceStyleType.primary}
              border={AppearanceBorderType.borderless}
              onClick={() => {
                setMembersDeleteModal(false)
              }}
            >
              {t("t.cancel")}
            </Button>,
          ]}
        >
          {t("application.deleteMemberDescription")}
        </Modal>
      </section>
    </>
  )
}

export default ApplicationForm
