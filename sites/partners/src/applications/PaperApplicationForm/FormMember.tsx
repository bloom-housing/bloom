import React, { useMemo } from "react"
import { HouseholdMember, Member } from "@bloom-housing/backend-core/types"
import {
  t,
  GridSection,
  GridCell,
  DOBField,
  Field,
  Select,
  AppearanceStyleType,
  AppearanceBorderType,
  Form,
  FormAddress,
} from "@bloom-housing/ui-components"
import { Button } from "../../../../../detroit-ui-components/src/actions/Button"
import { ViewItem } from "../../../../../detroit-ui-components/src/blocks/ViewItem"
import { FieldGroup } from "../../../../../detroit-ui-components/src/forms/FieldGroup"
import { relationshipKeys, stateKeys } from "@bloom-housing/shared-helpers"
import { useForm } from "react-hook-form"
import { YesNoAnswer } from "./FormTypes"

type ApplicationFormMemberProps = {
  onSubmit: (member: HouseholdMember) => void
  onClose: () => void
  members: HouseholdMember[]
  editedMemberId?: number
}

const FormMember = ({ onSubmit, onClose, members, editedMemberId }: ApplicationFormMemberProps) => {
  const currentlyEdited = useMemo(() => {
    return members.filter((member) => member.orderId === editedMemberId)[0]
  }, [members, editedMemberId])

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch, errors, trigger, getValues } = useForm({
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

    const editedMember = members.find((member) => member.orderId === editedMemberId)

    if (editedMember) {
      onSubmit({ ...editedMember, ...formData })
    } else {
      const newMember = new Member(members.length + 1)
      onSubmit({ ...newMember, ...formData })
    }

    onClose()
  }

  const sameAddressOptions = [
    {
      id: "sameAddressYes",
      label: t("t.yes"),
      value: YesNoAnswer.Yes,
    },
    {
      id: "sameAddressNo",
      label: t("t.no"),
      value: YesNoAnswer.No,
    },
  ]

  const workInRegionOptions = [
    {
      id: "workInRegionYes",
      label: t("t.yes"),
      value: YesNoAnswer.Yes,
    },
    {
      id: "workInRegionNo",
      label: t("t.no"),
      value: YesNoAnswer.No,
    },
  ]

  return (
    <Form onSubmit={() => false}>
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

        {sameAddressField === YesNoAnswer.No && (
          <FormAddress
            subtitle={t("application.details.residenceAddress")}
            dataKey="address"
            register={register}
            stateKeys={stateKeys}
          />
        )}

        {workInRegionField === YesNoAnswer.Yes && (
          <FormAddress
            subtitle={t("application.contact.workAddress")}
            dataKey="workAddress"
            register={register}
            stateKeys={stateKeys}
          />
        )}
      </div>

      <div className="mt-6">
        <Button
          type="button"
          onClick={() => onFormSubmit()}
          styleType={AppearanceStyleType.primary}
          dataTestId={"submitAddMemberForm"}
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
