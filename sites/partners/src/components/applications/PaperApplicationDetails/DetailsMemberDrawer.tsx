import React from "react"
import { AppearanceStyleType, t, Button, Drawer } from "@bloom-housing/ui-components"
import { Card, FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { AddressColsType, DetailsAddressColumns } from "./DetailsAddressColumns"
import { Application, HouseholdMemberUpdate } from "@bloom-housing/backend-core/types"
import { YesNoAnswer } from "../../../lib/helpers"
import SectionWithGrid from "../../shared/SectionWithGrid"

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
      <Card spacing="lg" className="spacer-section">
        <Card.Section>
          <SectionWithGrid heading={t("application.details.householdMemberDetails")} inset>
            <Grid.Row columns={4}>
              <FieldValue
                label={t("application.name.firstName")}
                children={membersDrawer?.firstName || t("t.n/a")}
              />

              <FieldValue
                label={t("application.name.middleName")}
                children={membersDrawer?.middleName || t("t.n/a")}
              />

              <FieldValue
                label={t("application.name.lastName")}
                children={membersDrawer?.lastName || t("t.n/a")}
              />

              <FieldValue
                label={t("application.household.member.dateOfBirth")}
                children={
                  membersDrawer?.birthMonth && membersDrawer?.birthDay && membersDrawer?.birthYear
                    ? `${membersDrawer?.birthMonth}/${membersDrawer?.birthDay}/${membersDrawer?.birthYear}`
                    : t("t.n/a")
                }
              />

              <FieldValue
                label={t("application.add.sameAddressAsPrimary")}
                children={
                  membersDrawer?.sameAddress === YesNoAnswer.Yes
                    ? t("t.yes")
                    : membersDrawer?.sameAddress === YesNoAnswer.No
                    ? t("t.no")
                    : t("t.n/a")
                }
              />

              <FieldValue
                label={t("application.add.workInRegion")}
                children={
                  membersDrawer?.workInRegion === YesNoAnswer.Yes
                    ? t("t.yes")
                    : membersDrawer?.workInRegion === YesNoAnswer.No
                    ? t("t.no")
                    : t("t.n/a")
                }
              />

              <FieldValue
                label={t("t.relationship")}
                children={
                  membersDrawer?.relationship
                    ? t(`application.form.options.relationship.${membersDrawer?.relationship}`)
                    : t("t.n/a")
                }
              />
            </Grid.Row>

            {!(membersDrawer?.sameAddress === YesNoAnswer.Yes) && (
              <>
                <SectionWithGrid.HeadingRow>
                  {t("application.details.residenceAddress")}
                </SectionWithGrid.HeadingRow>
                <Grid.Row columns={3}>
                  <DetailsAddressColumns
                    type={AddressColsType.memberResidence}
                    application={application}
                    householdMember={membersDrawer}
                  />
                </Grid.Row>
              </>
            )}

            {membersDrawer?.workInRegion === YesNoAnswer.Yes && (
              <>
                <SectionWithGrid.HeadingRow>
                  {t("application.contact.workAddress")}
                </SectionWithGrid.HeadingRow>
                <Grid.Row columns={3}>
                  <DetailsAddressColumns
                    type={AddressColsType.memberWork}
                    application={application}
                    householdMember={membersDrawer}
                  />
                </Grid.Row>
              </>
            )}
          </SectionWithGrid>
        </Card.Section>
      </Card>

      <Button styleType={AppearanceStyleType.primary} onClick={() => setMembersDrawer(null)}>
        {t("t.done")}
      </Button>
    </Drawer>
  )
}

export { DetailsMemberDrawer as default, DetailsMemberDrawer }
