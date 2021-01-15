import React, { useState, useMemo, useCallback } from "react"
import {
  t,
  GridSection,
  MinimalTable,
  Button,
  AppearanceSizeType,
  Drawer,
  Modal,
  AppearanceStyleType,
  AppearanceBorderType,
} from "@bloom-housing/ui-components"
import { HouseholdMember } from "@bloom-housing/backend-core/types"
import type { YesNoAnswer } from "../FormTypes"

import { FormMember } from "../FormMember"

type FormHouseholdMembersProps = {
  householdMembers: HouseholdMember[]
  setHouseholdMembers: (members: HouseholdMember[]) => void
}

const FormHouseholdMembers = ({
  householdMembers,
  setHouseholdMembers,
}: FormHouseholdMembersProps) => {
  const [membersDrawer, setMembersDrawer] = useState<string | boolean>(false)
  const [membersDeleteModal, setMembersDeleteModal] = useState<string | boolean>(false)

  const memberTableHeaders = {
    name: t("t.name"),
    relationship: t("t.relationship"),
    dob: t("application.household.member.dateOfBirth"),
    sameResidence: t("application.add.sameResidence"),
    workInRegion: t("application.details.workInRegion"),
    action: "",
  }

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

  function saveMember(newMember: HouseholdMember) {
    const isExists = householdMembers.find((member) => member.id === newMember.id)

    if (isExists) {
      const withoutEdited = householdMembers.filter((member) => member.id !== newMember.id)
      setHouseholdMembers([...withoutEdited, newMember])
    } else {
      setHouseholdMembers([...householdMembers, newMember])
    }
  }

  const memberTableData = useMemo(() => {
    const chooseAddressStatus = (value: YesNoAnswer | null) => {
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
      const sameResidence = member.sameAddress as YesNoAnswer
      const workInRegion = member.workInRegion as YesNoAnswer

      return {
        name: (member.firstName + member.lastName).length
          ? `${member.firstName} ${member.lastName}`
          : t("t.n/a"),
        relationship: member.relationship
          ? t(`application.form.options.relationship.${member.relationship}`)
          : t("t.n/a"),
        dob:
          birthMonth && birthDay && birthYear
            ? `${member.birthMonth}/${member.birthDay}/${member.birthYear}`
            : t("t.n/a"),
        sameResidence: chooseAddressStatus(sameResidence),
        workInRegion: chooseAddressStatus(workInRegion),
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
            onClick={() => setMembersDrawer(true)}
          >
            {t("application.add.addHouseholdMember")}
          </Button>
        </div>
      </GridSection>

      <Drawer
        open={!!membersDrawer}
        title={t("application.household.householdMember")}
        ariaDescription={t("application.household.householdMember")}
        onClose={() => setMembersDrawer(!membersDrawer)}
      >
        <FormMember
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
    </>
  )
}

export { FormHouseholdMembers as default, FormHouseholdMembers }
