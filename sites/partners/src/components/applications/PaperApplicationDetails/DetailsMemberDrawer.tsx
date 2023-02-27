import React from "react"
import { AppearanceStyleType, t, GridSection } from "@bloom-housing/ui-components"
import { Button } from "../../../../../../detroit-ui-components/src/actions/Button"
import { ViewItem } from "../../../../../../detroit-ui-components/src/blocks/ViewItem"
import { Drawer } from "../../../../../../detroit-ui-components/src/overlays/Drawer"
import { AddressColsType, DetailsAddressColumns } from "./DetailsAddressColumns"
import { Application, HouseholdMemberUpdate } from "@bloom-housing/backend-core/types"
import { YesNoAnswer } from "../../../lib/helpers"

export type MembersDrawer = HouseholdMemberUpdate | null

type DetailsMemberDrawerProps = {
  application: Application
  membersDrawer: MembersDrawer
  setMembersDrawer: (member: MembersDrawer) => void
}

const DetailsMemberDrawer = ({
  application,
  membersDrawer,
  setMembersDrawer,
}: DetailsMemberDrawerProps) => {
  return (
    <Drawer
      open={!!membersDrawer}
      title={t("application.household.householdMember")}
      ariaDescription={t("application.household.householdMember")}
      onClose={() => setMembersDrawer(null)}
    >
      <section className="border rounded-md p-8 bg-white mb-8">
        <GridSection
          title={t("application.details.householdMemberDetails")}
          tinted={true}
          inset={true}
          grid={false}
        >
          <GridSection grid columns={4}>
            <ViewItem
              label={t("application.name.firstName")}
              children={membersDrawer?.firstName || t("t.n/a")}
            />

            <ViewItem
              label={t("application.name.middleName")}
              children={membersDrawer?.middleName || t("t.n/a")}
            />

            <ViewItem
              label={t("application.name.lastName")}
              children={membersDrawer?.lastName || t("t.n/a")}
            />

            <ViewItem
              label={t("application.household.member.dateOfBirth")}
              children={
                membersDrawer?.birthMonth && membersDrawer?.birthDay && membersDrawer?.birthYear
                  ? `${membersDrawer?.birthMonth}/${membersDrawer?.birthDay}/${membersDrawer?.birthYear}`
                  : t("t.n/a")
              }
            />

            <ViewItem
              label={t("application.add.sameAddressAsPrimary")}
              children={
                membersDrawer?.sameAddress === YesNoAnswer.Yes
                  ? t("t.yes")
                  : membersDrawer?.sameAddress === YesNoAnswer.No
                  ? t("t.no")
                  : t("t.n/a")
              }
            />

            <ViewItem
              label={t("application.add.workInRegion")}
              children={
                membersDrawer?.workInRegion === YesNoAnswer.Yes
                  ? t("t.yes")
                  : membersDrawer?.workInRegion === YesNoAnswer.No
                  ? t("t.no")
                  : t("t.n/a")
              }
            />

            <ViewItem
              label={t("t.relationship")}
              children={
                membersDrawer?.relationship
                  ? t(`application.form.options.relationship.${membersDrawer?.relationship}`)
                  : t("t.n/a")
              }
            />
          </GridSection>
          <GridSection grid={false} columns={2}>
            {!(membersDrawer?.sameAddress === YesNoAnswer.Yes) && (
              <GridSection subtitle={t("application.details.residenceAddress")} columns={3}>
                <DetailsAddressColumns
                  type={AddressColsType.memberResidence}
                  application={application}
                  householdMember={membersDrawer}
                />
              </GridSection>
            )}

            {membersDrawer?.workInRegion === YesNoAnswer.Yes && (
              <GridSection subtitle={t("application.contact.workAddress")} columns={3}>
                <DetailsAddressColumns
                  type={AddressColsType.memberWork}
                  application={application}
                  householdMember={membersDrawer}
                />
              </GridSection>
            )}
          </GridSection>
        </GridSection>
      </section>

      <Button styleType={AppearanceStyleType.primary} onClick={() => setMembersDrawer(null)}>
        {t("t.done")}
      </Button>
    </Drawer>
  )
}

export { DetailsMemberDrawer as default, DetailsMemberDrawer }
