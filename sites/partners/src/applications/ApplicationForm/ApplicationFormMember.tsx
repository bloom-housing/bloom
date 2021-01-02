import React, { useMemo } from "react"
import { HouseholdMember, Member } from "@bloom-housing/core"
import {
  t,
  GridSection,
  ViewItem,
  GridCell,
  DOBField,
  Field,
  Select,
  relationshipKeys,
  AppearanceStyleType,
  AppearanceBorderType,
  FieldGroup,
  Button,
  Form,
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import { ApplicationFormAddress } from "./ApplicationFormAddress"
import { nanoid } from "nanoid"

type ApplicationFormMemberProps = {
  onSubmit: (member: HouseholdMember) => void
  onClose: () => void
  members: HouseholdMember[]
  editedMemberId: string | boolean
}

const ApplicationFormMember = ({
  onSubmit,
  onClose,
  members,
  editedMemberId,
}: ApplicationFormMemberProps) => {
  const currentlyEdited = useMemo(() => {
    return members.filter((member) => member.id === editedMemberId)[0]
  }, [members, editedMemberId])

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, handleSubmit, errors } = useForm({
    defaultValues: {
      firstName: currentlyEdited?.firstName,
      middleName: currentlyEdited?.middleName,
      lastName: currentlyEdited?.lastName,
      relationship: currentlyEdited?.relationship,
      sameAddress: currentlyEdited?.sameAddress,
      workInRegion: currentlyEdited?.workInRegion,
      dateOfBirth: {
        birthMonth: currentlyEdited?.birthMonth,
        birthDay: currentlyEdited?.birthDay,
        birthYear: currentlyEdited?.birthYear,
      },
      address: currentlyEdited?.address,
      workAddress: currentlyEdited?.workAddress,
    },
  })

  const sameAddressField = watch("sameAddress")
  const workInRegionField = watch("workInRegion")

  function onFormSubmit(data) {
    const { birthMonth, birthDay, birthYear } = data.dateOfBirth
    const formData = {
      ...data,
      birthMonth,
      birthDay,
      birthYear,
    }

    if (editedMemberId && typeof editedMemberId === "string") {
      const editedMember = members.find((member) => member.id === editedMemberId)
      onSubmit({ ...editedMember, ...formData })
    } else {
      const newMember = new Member(members.length + 1)
      onSubmit({ ...newMember, id: nanoid(), ...formData })
    }

    onClose()
  }

  function onFormError() {
    console.log("on error")
  }

  const sameAddressOptions = [
    {
      id: "sameAddressYes",
      label: t("t.yes"),
      value: "yes",
    },
    {
      id: "sameAddressNo",
      label: t("t.no"),
      value: "no",
    },
  ]

  const workInRegionOptions = [
    {
      id: "workInRegionYes",
      label: t("t.yes"),
      value: "yes",
    },
    {
      id: "workInRegionNo",
      label: t("t.no"),
      value: "no",
    },
  ]

  return (
    <Form onSubmit={handleSubmit(onFormSubmit, onFormError)}>
      <div className="border rounded-md p-8 bg-white">
        <GridSection title={t("application.review.householdDetails")} columns={4}>
          <GridCell>
            <ViewItem label={t("application.name.firstName")}>
              <Field
                id="firstName"
                name="firstName"
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
                id="middleName"
                name="middleName"
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
                id="lastName"
                name="lastName"
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
            <ViewItem label={t("t.relationship")}>
              <Select
                id="relationship"
                name="relationship"
                label={t("t.relationship")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                options={relationshipKeys}
                keyPrefix="application.form.options.relationship"
              />
            </ViewItem>
          </GridCell>

          <GridCell>
            <ViewItem label={t("application.add.sameAddressAsPrimary")}>
              <FieldGroup
                name="sameAddress"
                type="radio"
                register={register}
                fields={sameAddressOptions}
                fieldClassName="m-0"
                fieldGroupClassName="flex h-12 items-center"
              />
            </ViewItem>
          </GridCell>

          <GridCell>
            <ViewItem label={t("application.details.workInRegion")}>
              <FieldGroup
                name="workInRegion"
                type="radio"
                register={register}
                fields={workInRegionOptions}
                fieldClassName="m-0"
                fieldGroupClassName="flex h-12 items-center"
              />
            </ViewItem>
          </GridCell>
        </GridSection>

        {sameAddressField === "no" &&
          ApplicationFormAddress(
            t("application.details.residenceAddress"),
            "address",
            "residence-member",
            register
          )}

        {workInRegionField === "yes" &&
          ApplicationFormAddress(
            t("application.contact.workAddress"),
            "workAddress",
            "work",
            register
          )}
      </div>

      <div className="mt-6">
        <Button onClick={() => false} styleType={AppearanceStyleType.primary}>
          {t("t.submit")}
        </Button>

        <Button
          type="button"
          onClick={onClose}
          styleType={AppearanceStyleType.secondary}
          border={AppearanceBorderType.borderless}
        >
          {t("t.cancel")}
        </Button>
      </div>
    </Form>
  )
}

export { ApplicationFormMember as default, ApplicationFormMember }
