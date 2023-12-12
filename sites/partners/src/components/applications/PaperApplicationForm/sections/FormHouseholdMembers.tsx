import React, { useState, useMemo, useCallback } from "react"
import {
  HouseholdMember,
  HouseholdMemberUpdate,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t, MinimalTable, Drawer, Modal } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
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
  const [membersDrawer, setMembersDrawer] = useState<number | null>(null)
  const [membersDeleteModal, setMembersDeleteModal] = useState<number | null>(null)

  const memberTableHeaders = {
    name: t("t.name"),
    relationship: t("t.relationship"),
    dob: t("application.household.member.dateOfBirth"),
    sameResidence: t("application.add.sameResidence"),
    workInRegion: t("application.details.workInRegion"),
    action: "",
  }

  const editMember = useCallback(
    (orderId: number) => {
      setMembersDrawer(orderId)
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
      const workInRegion = member.workInRegion

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
        workInRegion: { content: chooseAddressStatus(workInRegion) },
        action: {
          content: (
            <div className="flex gap-3">
              <Button
                type="button"
                className="font-semibold"
                onClick={() => editMember(member.orderId)}
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
          onClick={() => setMembersDrawer(householdMembers.length + 1)}
          id={"addHouseholdMemberButton"}
        >
          {t("application.add.addHouseholdMember")}
        </Button>
      </SectionWithGrid>

      <Drawer
        open={!!membersDrawer}
        title={t("application.household.householdMember")}
        ariaDescription={t("application.household.householdMember")}
        onClose={() => setMembersDrawer(null)}
      >
        <FormMember
          onSubmit={(member) => saveMember(member)}
          onClose={() => setMembersDrawer(null)}
          members={householdMembers}
          editedMemberId={membersDrawer}
        />
      </Drawer>

      <Modal
        open={!!membersDeleteModal}
        title={t("application.deleteThisMember")}
        ariaDescription={t("application.deleteMemberDescription")}
        onClose={() => setMembersDeleteModal(null)}
        actions={[
          <Button variant="alert" onClick={() => deleteMember(membersDeleteModal)} size="sm">
            {t("t.delete")}
          </Button>,
          <Button
            variant="primary-outlined"
            onClick={() => {
              setMembersDeleteModal(null)
            }}
            size="sm"
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        {t("application.deleteMemberDescription")}
      </Modal>
    </>
  )
}

export { FormHouseholdMembers as default, FormHouseholdMembers }
