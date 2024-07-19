import React, { useMemo } from "react"
import {
  HouseholdMember,
  HouseholdMemberRelationship,
  HouseholdMemberUpdate,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import {
  t,
  DOBField,
  Field,
  Select,
  FieldGroup,
  Form,
  FormAddress,
} from "@bloom-housing/ui-components"
import { Button, Card, Drawer, Grid } from "@bloom-housing/ui-seeds"
import { relationshipKeys, stateKeys } from "@bloom-housing/shared-helpers"
import { useForm } from "react-hook-form"
import SectionWithGrid from "../../shared/SectionWithGrid"

export class Member implements HouseholdMemberUpdate {
  id: string
  orderId = undefined as number | undefined
  firstName = ""
  middleName = ""
  lastName = ""
  birthMonth = undefined
  birthDay = undefined
  birthYear = undefined
  emailAddress = ""
  noEmail = undefined
  phoneNumber = ""
  phoneNumberType = ""
  noPhone = undefined

  constructor(orderId: number) {
    this.orderId = orderId
  }
  householdMemberAddress = {
    placeName: undefined,
    city: "",
    county: "",
    state: "",
    street: "",
    street2: "",
    zipCode: "",
    latitude: undefined,
    longitude: undefined,
  }
  sameAddress?: YesNoEnum
  relationship?: HouseholdMemberRelationship
}

type ApplicationFormMemberProps = {
  onSubmit: (member: HouseholdMemberUpdate) => void
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
      dateOfBirth: {
        birthMonth: currentlyEdited?.birthMonth,
        birthDay: currentlyEdited?.birthDay,
        birthYear: currentlyEdited?.birthYear,
      },
      householdMemberAddress: currentlyEdited?.householdMemberAddress,
    },
  })

  const sameAddressField = watch("sameAddress")

  async function onFormSubmit() {
    const validation = await trigger()

    if (!validation) return

    const data = getValues()

    const { sameAddress } = data
    const { birthMonth, birthDay, birthYear } = data.dateOfBirth
    const formData = {
      createdAt: undefined,
      updatedAt: undefined,
      ...data,
      birthMonth,
      birthDay,
      birthYear,
      sameAddress: sameAddress ? sameAddress : null,
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
      value: YesNoEnum.yes,
    },
    {
      id: "sameAddressNo",
      label: t("t.no"),
      value: YesNoEnum.no,
    },
  ]

  return (
    <>
      <Drawer.Content>
        <Form onSubmit={() => false}>
          <Card>
            <Card.Section>
              <SectionWithGrid heading={t("application.review.householdDetails")}>
                <Grid.Row>
                  <Grid.Cell>
                    <Field
                      id="firstName"
                      name="firstName"
                      label={t("application.name.firstName")}
                      placeholder={t("application.name.firstName")}
                      register={register}
                    />
                  </Grid.Cell>

                  <Grid.Cell>
                    <Field
                      id="middleName"
                      name="middleName"
                      label={t("application.name.middleNameOptional")}
                      placeholder={t("application.name.middleNameOptional")}
                      register={register}
                    />
                  </Grid.Cell>

                  <Grid.Cell>
                    <Field
                      id="lastName"
                      name="lastName"
                      label={t("application.name.lastName")}
                      placeholder={t("application.name.lastName")}
                      register={register}
                    />
                  </Grid.Cell>

                  <Grid.Cell>
                    <DOBField
                      id="dateOfBirth"
                      name="dateOfBirth"
                      register={register}
                      error={errors?.dateOfBirth}
                      watch={watch}
                      label={t("application.household.member.dateOfBirth")}
                    />
                  </Grid.Cell>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Cell>
                    <Select
                      id="relationship"
                      name="relationship"
                      label={t("t.relationship")}
                      register={register}
                      controlClassName="control"
                      options={relationshipKeys}
                      keyPrefix="application.form.options.relationship"
                    />
                  </Grid.Cell>

                  <Grid.Cell>
                    <FieldGroup
                      name="sameAddress"
                      type="radio"
                      register={register}
                      groupLabel={t("application.add.sameAddressAsPrimary")}
                      fields={sameAddressOptions}
                      fieldClassName="m-0"
                      fieldGroupClassName="flex h-12 items-center"
                    />
                  </Grid.Cell>
                </Grid.Row>
              </SectionWithGrid>

              {sameAddressField === YesNoEnum.no && (
                <FormAddress
                  subtitle={t("application.details.residenceAddress")}
                  dataKey="householdMemberAddress"
                  register={register}
                  stateKeys={stateKeys}
                />
              )}
            </Card.Section>
          </Card>
        </Form>
      </Drawer.Content>
      <Drawer.Footer>
        <Button
          type="button"
          onClick={() => onFormSubmit()}
          variant="primary"
          id={"submitAddMemberForm"}
        >
          {t("t.submit")}
        </Button>

        <Button variant="primary-outlined" type="button" onClick={onClose}>
          {t("t.cancel")}
        </Button>
      </Drawer.Footer>
    </>
  )
}

export { FormMember as default, FormMember }
