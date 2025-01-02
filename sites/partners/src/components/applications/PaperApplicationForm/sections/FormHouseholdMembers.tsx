import React, { useState, useMemo, useCallback } from "react"
import {
  HouseholdMember,
  HouseholdMemberUpdate,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t, MinimalTable } from "@bloom-housing/ui-components"
import { Button, Dialog, Drawer } from "@bloom-housing/ui-seeds"
import { FormMember } from "../FormMember"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type FormHouseholdMembersProps = {
  householdMembers: HouseholdMember[]
  setHouseholdMembers: (members: HouseholdMember[]) => void
}

const FormHouseholdMembers = ({
  householdMembers,
  setHouseholdMembers,
}: FormHouseholdMembersProps) => {
  type MembersDrawer = HouseholdMember | null

  const [membersDrawer, setMembersDrawer] = useState<MembersDrawer>(null)
  const [membersDeleteModal, setMembersDeleteModal] = useState<number | null>(null)

  const memberTableHeaders = {
    name: "t.name",
    relationship: "t.relationship",
    dob: "application.household.member.dateOfBirth",
    sameResidence: "application.add.sameResidence",
    action: "",
  }

  const editMember = useCallback(
    (member: HouseholdMember) => {
      setMembersDrawer(member)
    },
    [setMembersDrawer]
  )

  // remove member from array and define new order numbers
  const deleteMember = useCallback(
    (orderId: number) => {
      const updatedMembers = householdMembers
        .filter((member) => member.orderId !== orderId)
        .map((updatedMember, index) => ({
          ...updatedMember,
          orderId: index + 1,
        }))

      setHouseholdMembers(updatedMembers)
      setMembersDeleteModal(null)
    },
    [setMembersDeleteModal, setHouseholdMembers, householdMembers]
  )

  function saveMember(newMember: HouseholdMemberUpdate) {
    const isExists = householdMembers.find((member) => member.orderId === newMember.orderId)

    if (isExists) {
      const withoutEdited = householdMembers.filter(
        (member) => member.orderId !== newMember.orderId
      )
      setHouseholdMembers([...withoutEdited, newMember as HouseholdMember])
    } else {
      setHouseholdMembers([...householdMembers, newMember as HouseholdMember])
    }
  }

  const memberTableData = useMemo(() => {
    const chooseAddressStatus = (value: YesNoEnum | null) => {
      switch (value) {
        case YesNoEnum.yes:
          return t("t.yes")
        case YesNoEnum.no:
          return t("t.no")
        default:
          return t("t.n/a")
      }
    }

    return householdMembers.map((member) => {
      const { birthMonth, birthDay, birthYear } = member
      const sameResidence = member.sameAddress

      return {
        name: {
          content: (member.firstName + member.lastName).length
            ? `${member.firstName} ${member.lastName}`
            : t("t.n/a"),
        },
        relationship: {
          content: member.relationship
            ? t(`application.form.options.relationship.${member.relationship}`)
            : t("t.n/a"),
        },
        dob: {
          content:
            birthMonth && birthDay && birthYear
              ? `${member.birthMonth}/${member.birthDay}/${member.birthYear}`
              : t("t.n/a"),
        },
        sameResidence: { content: chooseAddressStatus(sameResidence) },
        action: {
          content: (
            <div className="flex gap-3">
              <Button
                type="button"
                className="font-semibold"
                onClick={() => editMember(member)}
                variant="text"
              >
                {t("t.edit")}
              </Button>
              <Button
                type="button"
                className="font-semibold text-alert"
                onClick={() => setMembersDeleteModal(member.orderId)}
                variant="text"
              >
                {t("t.delete")}
              </Button>
            </div>
          ),
        },
      }
    })
  }, [editMember, householdMembers])

  return (
    <>
      <hr className="spacer-section-above spacer-section" />
      <SectionWithGrid heading={t("application.household.householdMembers")} bypassGrid inset>
        {!!householdMembers.length && (
          <div className="mb-5">
            <MinimalTable headers={memberTableHeaders} data={memberTableData} />
          </div>
        )}

        <Button
          type="button"
          variant="primary-outlined"
          size="sm"
          onClick={() =>
            setMembersDrawer({ orderId: householdMembers.length + 1 } as HouseholdMember)
          }
          id={"addHouseholdMemberButton"}
        >
          {t("application.add.addHouseholdMember")}
        </Button>
      </SectionWithGrid>

      <Drawer
        isOpen={!!membersDrawer}
        onClose={() => setMembersDrawer(null)}
        ariaLabelledBy="form-household-members-drawer-header"
      >
        <Drawer.Header id="form-household-members-drawer-header">
          {t("application.household.householdMember")}
        </Drawer.Header>
        <FormMember
          onSubmit={(member) => saveMember(member)}
          onClose={() => setMembersDrawer(null)}
          members={householdMembers}
          editedMemberId={membersDrawer?.orderId}
        />
      </Drawer>

      <Dialog
        isOpen={membersDeleteModal !== null}
        ariaLabelledBy="form-household-members-dialog-header"
        ariaDescribedBy="form-household-members-dialog-content"
        onClose={() => setMembersDeleteModal(null)}
      >
        <Dialog.Header id="form-household-members-dialog-header">
          {t("application.deleteThisMember")}
        </Dialog.Header>
        <Dialog.Content id="form-household-members-dialog-content">
          {t("application.deleteMemberDescription")}
        </Dialog.Content>
        <Dialog.Footer>
          <Button variant="alert" onClick={() => deleteMember(membersDeleteModal)} size="sm">
            {t("t.delete")}
          </Button>
          <Button
            variant="primary-outlined"
            onClick={() => {
              setMembersDeleteModal(null)
            }}
            size="sm"
          >
            {t("t.cancel")}
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  )
}

export { FormHouseholdMembers as default, FormHouseholdMembers }
