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
import { FormAddress } from "./FormAddress"
import { nanoid } from "nanoid"

type ApplicationFormMemberProps = {
  onSubmit: (member: HouseholdMember) => void
  onClose: () => void
  members: HouseholdMember[]
  editedMemberId: string | boolean
}

export enum FormMemberFields {
  FirstName = "firstName",
  MiddleName = "middleName",
  LastName = "lastName",
  DateOfBirth = "dateOfBirth",
  Relationship = "relationship",
  SameAddress = "sameAddress",
  WorkInRegion = "workInRegion",
  Address = "address",
  AddressStreet = "address.street",
  AddressStreet2 = "address.street2",
  AddressCity = "address.city",
  AddressState = "address.state",
  AddressZip = "address.zip",
  WorkAddress = "workAddress",
  WorkAddressStreet = "workAddress.street",
  WorkAddressStreet2 = "workAddress.street2",
  WorkAddressCity = "workAddress.city",
  WorkAddressState = "workAddress.state",
  WorkAddressZip = "workAddress.zip",
}

const FormMember = ({ onSubmit, onClose, members, editedMemberId }: ApplicationFormMemberProps) => {
  const currentlyEdited = useMemo(() => {
    return members.filter((member) => member.id === editedMemberId)[0]
  }, [members, editedMemberId])

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, trigger, getValues } = useForm({
    defaultValues: {
      [FormMemberFields.FirstName]: currentlyEdited?.firstName,
      [FormMemberFields.MiddleName]: currentlyEdited?.middleName,
      [FormMemberFields.LastName]: currentlyEdited?.lastName,
      [FormMemberFields.Relationship]: currentlyEdited?.relationship,
      [FormMemberFields.SameAddress]: currentlyEdited?.sameAddress,
      [FormMemberFields.WorkInRegion]: currentlyEdited?.workInRegion,
      [FormMemberFields.DateOfBirth]: {
        birthMonth: currentlyEdited?.birthMonth,
        birthDay: currentlyEdited?.birthDay,
        birthYear: currentlyEdited?.birthYear,
      },
      [FormMemberFields.Address]: currentlyEdited?.address,
      [FormMemberFields.WorkAddress]: currentlyEdited?.workAddress,
    },
  })

  const sameAddressField = watch(FormMemberFields.SameAddress)
  const workInRegionField = watch(FormMemberFields.WorkInRegion)

  async function onFormSubmit() {
    const validation = await trigger()

    if (!validation) return

    const data = getValues()

    const { sameAddress, workInRegion } = data
    const { birthMonth, birthDay, birthYear } = data.dateOfBirth
    const formData = {
      createdAt: undefined,
      updatedAt: undefined,
      ...data,
      birthMonth,
      birthDay,
      birthYear,
      sameAddress: sameAddress ? sameAddress : null,
      workInRegion: workInRegion ? workInRegion : null,
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
    <Form onSubmit={() => false}>
      <div className="border rounded-md p-8 bg-white">
        <GridSection title={t("application.review.householdDetails")} columns={4}>
          <GridCell>
            <ViewItem label={t("application.name.firstName")}>
              <Field
                id={FormMemberFields.FirstName}
                name={FormMemberFields.FirstName}
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
                id={FormMemberFields.MiddleName}
                name={FormMemberFields.MiddleName}
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
                id={FormMemberFields.LastName}
                name={FormMemberFields.LastName}
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
                id={FormMemberFields.DateOfBirth}
                name={FormMemberFields.DateOfBirth}
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
                id={FormMemberFields.Relationship}
                name={FormMemberFields.Relationship}
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
                name={FormMemberFields.SameAddress}
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
                name={FormMemberFields.WorkInRegion}
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
          FormAddress(
            t("application.details.residenceAddress"),
            FormMemberFields.Address,
            "residence-member",
            register
          )}

        {workInRegionField === "yes" &&
          FormAddress(
            t("application.contact.workAddress"),
            FormMemberFields.WorkAddress,
            "work",
            register
          )}
      </div>

      <div className="mt-6">
        <Button
          type="button"
          onClick={() => onFormSubmit()}
          styleType={AppearanceStyleType.primary}
        >
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

export { FormMember as default, FormMember }
