import React, { useContext, useMemo } from "react"
import { t, GridSection, MinimalTable } from "@bloom-housing/ui-components"
import { Button } from "../../../../../../detroit-ui-components/src/actions/Button"
import { ApplicationContext } from "../../ApplicationContext"
import { MembersDrawer } from "../DetailsMemberDrawer"
import { YesNoAnswer } from "../../PaperApplicationForm/FormTypes"

type DetailsHouseholdMembersProps = {
  setMembersDrawer: (member: MembersDrawer) => void
}

const DetailsHouseholdMembers = ({ setMembersDrawer }: DetailsHouseholdMembersProps) => {
  const application = useContext(ApplicationContext)

  const householdMembersHeaders = {
    name: t("t.name"),
    relationship: t("t.relationship"),
    birth: t("application.household.member.dateOfBirth"),
    sameResidence: t("application.add.sameResidence"),
    workInRegion: t("application.details.workInRegion"),
    action: "",
  }

  const householdMembersData = useMemo(() => {
    const checkAvailablility = (property) => {
      if (property === YesNoAnswer.Yes) {
        return t("t.yes")
      } else if (property === "no") {
        return t("t.no")
      }

      return t("t.n/a")
    }
    return application?.householdMembers?.map((item) => ({
      name: { content: `${item.firstName} ${item.middleName} ${item.lastName}` },
      relationship: {
        content: item.relationship
          ? t(`application.form.options.relationship.${item.relationship}`)
          : t("t.n/a"),
      },
      birth: {
        content:
          item.birthMonth && item.birthDay && item.birthYear
            ? `${item.birthMonth}/${item.birthDay}/${item.birthYear}`
            : t("t.n/a"),
      },
      sameResidence: { content: checkAvailablility(item.sameAddress) },
      workInRegion: { content: checkAvailablility(item.workInRegion) },
      action: {
        content: (
          <Button
            type="button"
            className="font-semibold uppercase"
            onClick={() => setMembersDrawer(item)}
            unstyled
          >
            {t("t.view")}
          </Button>
        ),
      },
    }))
  }, [application, setMembersDrawer])

  return (
    <GridSection
      className="bg-primary-lighter"
      title={t("application.household.householdMembers")}
      grid={false}
      tinted
      inset
    >
      {application.householdSize >= 1 ? (
        <MinimalTable headers={householdMembersHeaders} data={householdMembersData} />
      ) : (
        <span className="text-base font-semibold">{t("t.none")}</span>
      )}
    </GridSection>
  )
}

export { DetailsHouseholdMembers as default, DetailsHouseholdMembers }
