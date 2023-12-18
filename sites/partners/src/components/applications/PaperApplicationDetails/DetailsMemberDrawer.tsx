import React from "react"
import { t, Drawer } from "@bloom-housing/ui-components"
import { Button, Card, FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { AddressColsType, DetailsAddressColumns } from "./DetailsAddressColumns"
import {
  Application,
  HouseholdMember,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../shared/SectionWithGrid"

export type MembersDrawer = HouseholdMember | null

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
                  membersDrawer?.sameAddress === YesNoEnum.yes
                    ? t("t.yes")
                    : membersDrawer?.sameAddress === YesNoEnum.no
                    ? t("t.no")
                    : t("t.n/a")
                }
              />

              <FieldValue
                label={t("application.add.workInRegion")}
                children={
                  membersDrawer?.workInRegion === YesNoEnum.yes
                    ? t("t.yes")
                    : membersDrawer?.workInRegion === YesNoEnum.no
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

            {!(membersDrawer?.sameAddress === YesNoEnum.yes) && (
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

            {membersDrawer?.workInRegion === YesNoEnum.yes && (
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

      <Button variant="primary" onClick={() => setMembersDrawer(null)}>
        {t("t.done")}
      </Button>
    </Drawer>
  )
}

export { DetailsMemberDrawer as default, DetailsMemberDrawer }
