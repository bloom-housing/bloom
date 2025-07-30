import React, { useContext, useMemo } from "react"
import { t, MinimalTable } from "@bloom-housing/ui-components"
import { Button, FieldValue } from "@bloom-housing/ui-seeds"
import { YesNoEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { ApplicationContext } from "../../ApplicationContext"
import { MembersDrawer } from "../DetailsMemberDrawer"
import SectionWithGrid from "../../../shared/SectionWithGrid"

type DetailsHouseholdMembersProps = {
  setMembersDrawer: (member: MembersDrawer) => void
  enableFullTimeStudentQuestion?: boolean
}

const DetailsHouseholdMembers = ({
  setMembersDrawer,
  enableFullTimeStudentQuestion,
}: DetailsHouseholdMembersProps) => {
  const application = useContext(ApplicationContext)

  const householdMembersHeaders = {
    name: "t.name",
    birth: "application.household.member.dateOfBirth",
    relationship: "t.relationship",
    sameResidence: "application.add.sameResidence",
    ...(enableFullTimeStudentQuestion && {
      fullTimeStudent: "application.details.fullTimeStudent",
    }),
    action: "",
  }

  const householdMembersData = useMemo(() => {
    const checkAvailablility = (property) => {
      if (property === YesNoEnum.yes) {
        return t("t.yes")
      } else if (property === "no") {
        return t("t.no")
      }

      return t("t.n/a")
    }
    const orderedHouseholdMembers = application?.householdMember?.sort(
      (a, b) => a.orderId - b.orderId
    )
    return orderedHouseholdMembers?.map((item) => ({
      name: { content: `${item.firstName} ${item.middleName || ""} ${item.lastName}` },
      birth: {
        content:
          item.birthMonth && item.birthDay && item.birthYear
            ? `${item.birthMonth}/${item.birthDay}/${item.birthYear}`
            : t("t.n/a"),
      },
      relationship: {
        content: item.relationship
          ? t(`application.form.options.relationship.${item.relationship}`)
          : t("t.n/a"),
      },
      sameResidence: { content: checkAvailablility(item.sameAddress) },
      ...(enableFullTimeStudentQuestion && {
        fullTimeStudent: { content: checkAvailablility(item.fullTimeStudent) },
      }),
      action: {
        content: (
          <Button
            type="button"
            className="font-semibold"
            onClick={() => setMembersDrawer(item)}
            variant="text"
          >
            {t("t.view")}
          </Button>
        ),
      },
    }))
  }, [application, setMembersDrawer, enableFullTimeStudentQuestion])

  return (
    <SectionWithGrid heading={t("application.household.householdMembers")} bypassGrid inset>
      {application?.householdMember?.length ? (
        <MinimalTable headers={householdMembersHeaders} data={householdMembersData} />
      ) : (
        <FieldValue>{t("t.none")}</FieldValue>
      )}
    </SectionWithGrid>
  )
}

export { DetailsHouseholdMembers as default, DetailsHouseholdMembers }
