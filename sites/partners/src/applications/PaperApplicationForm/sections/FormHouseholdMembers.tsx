import React, { useState, useMemo, useCallback } from "react"
import {
  t,
  GridSection,
  MinimalTable,
  AppearanceSizeType,
  AppearanceStyleType,
  AppearanceBorderType,
} from "@bloom-housing/ui-components"
import { Button } from "../../../../../../detroit-ui-components/src/actions/Button"
import { Drawer } from "../../../../../../detroit-ui-components/src/overlays/Drawer"
import { Modal } from "../../../../../../detroit-ui-components/src/overlays/Modal"
import { HouseholdMember } from "@bloom-housing/backend-core/types"
import { YesNoAnswer } from "../FormTypes"
import { FormMember } from "../FormMember"

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

  function saveMember(newMember: HouseholdMember) {
    const isExists = householdMembers.find((member) => member.orderId === newMember.orderId)

    if (isExists) {
      const withoutEdited = householdMembers.filter(
        (member) => member.orderId !== newMember.orderId
      )
      setHouseholdMembers([...withoutEdited, newMember])
    } else {
      setHouseholdMembers([...householdMembers, newMember])
    }
  }

  const memberTableData = useMemo(() => {
    const chooseAddressStatus = (value: YesNoAnswer | null) => {
      switch (value) {
        case YesNoAnswer.Yes:
          return t("t.yes")
        case YesNoAnswer.No:
          return t("t.no")
        default:
          return t("t.n/a")
      }
    }

    return householdMembers.map((member) => {
      const { birthMonth, birthDay, birthYear } = member
      const sameResidence = member.sameAddress as YesNoAnswer
      const workInRegion = member.workInRegion as YesNoAnswer

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
            <div className="flex">
              <Button
                type="button"
                className="font-semibold uppercase"
                onClick={() => editMember(member.orderId)}
                unstyled
              >
                {t("t.edit")}
              </Button>
              <Button
                type="button"
                className="font-semibold uppercase text-red-700"
                onClick={() => setMembersDeleteModal(member.orderId)}
                unstyled
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
      <GridSection title={t("application.household.householdMembers")} grid={false} separator>
        <div className="bg-gray-300 px-4 py-5">
          {!!householdMembers.length && (
            <div className="mb-5">
              <MinimalTable headers={memberTableHeaders} data={memberTableData} />
            </div>
          )}

          <Button
            type="button"
            size={AppearanceSizeType.normal}
            onClick={() => setMembersDrawer(householdMembers.length + 1)}
            dataTestId={"addHouseholdMemberButton"}
          >
            {t("application.add.addHouseholdMember")}
          </Button>
        </div>
      </GridSection>

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
          <Button
            styleType={AppearanceStyleType.alert}
            onClick={() => deleteMember(membersDeleteModal)}
          >
            {t("t.delete")}
          </Button>,
          <Button
            styleType={AppearanceStyleType.primary}
            border={AppearanceBorderType.borderless}
            onClick={() => {
              setMembersDeleteModal(null)
            }}
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
