import React, { useContext, useState } from "react"
import { MinimalTable, t } from "@bloom-housing/ui-components"
import { Button, Card, Drawer, FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  MultiselectOption,
  MultiselectQuestion,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { DrawerType } from "./EditPreference"
import SectionWithGrid from "../../shared/SectionWithGrid"

type PreferenceViewDrawerProps = {
  drawerOpen: boolean
  questionData: MultiselectQuestion
  onDrawerClose: () => void
}

const PreferenceViewDrawer = ({
  questionData,
  drawerOpen,
  onDrawerClose,
}: PreferenceViewDrawerProps) => {
  const [optionDrawerOpen, setOptionDrawerOpen] = useState<DrawerType | null>(null)
  const [optionData, setOptionData] = useState<MultiselectOption>(null)

  const { profile } = useContext(AuthContext)
  // eslint-disable-next-line @typescript-eslint/unbound-method

  const drawerTitle = t("settings.preferenceView")

  return (
    <>
      <Drawer
        isOpen={!!drawerOpen}
        onClose={() => {
          onDrawerClose()
        }}
        ariaLabelledBy="preference-drawer-header"
      >
        <Drawer.Header id="preference-drawer-header">{drawerTitle}</Drawer.Header>
        <Drawer.Content>
          <Card>
            <Card.Section>
              <SectionWithGrid heading={t("settings.preference")} inset>
                <Grid.Row>
                  <FieldValue label={t("t.title")}>{questionData?.name}</FieldValue>
                </Grid.Row>
                {questionData?.description && questionData?.description !== "" && (
                  <Grid.Row>
                    <FieldValue label={t("t.descriptionTitle")}>
                      {questionData?.description}
                    </FieldValue>
                  </Grid.Row>
                )}
                {questionData?.links?.length > 0 && (
                  <Grid.Row columns={3}>
                    <FieldValue label={t("t.url")}>
                      {questionData?.links?.length > 0 ? questionData?.links[0].url : ""}
                    </FieldValue>
                    <FieldValue label={t("settings.preferenceLinkTitle")}>
                      {questionData?.links?.length > 0 ? questionData?.links[0].title : ""}
                    </FieldValue>
                  </Grid.Row>
                )}
              </SectionWithGrid>
              {questionData?.multiselectOptions?.length > 0 && (
                <SectionWithGrid heading="" inset>
                  <Grid.Row>
                    <Grid.Cell>
                      <MinimalTable
                        id="preferenceViewOptions"
                        headers={{
                          order: "t.order",
                          name: "t.name",
                          description: "t.descriptionTitle",
                          view: "",
                        }}
                        data={questionData.multiselectOptions.map((item) => ({
                          order: { content: item.ordinal },
                          name: { content: item.name },
                          description: { content: item.description },
                          view: { content: <strong>wee</strong>},
                        }))}
                      />
                    </Grid.Cell>
                  </Grid.Row>
                </SectionWithGrid>
              )}

              <SectionWithGrid heading="" inset>
                <Grid.Row columns={3}>
                  <FieldValue label={t("settings.preferenceExclusiveQuestion")}>
                    {questionData?.isExclusive
                      ? t("settings.preferenceExclusive")
                      : t("settings.preferenceMultiSelect")}
                  </FieldValue>
                  <FieldValue label={t("settings.preferenceShowOnListing")}>
                    {questionData?.hideFromListing ? t("t.no") : t("t.yes")}
                  </FieldValue>
                </Grid.Row>
                <Grid.Row columns={3}>
                  <FieldValue label={t("t.jurisdiction")}>
                    {questionData?.jurisdiction.name}
                  </FieldValue>
                </Grid.Row>
              </SectionWithGrid>
            </Card.Section>
          </Card>
        </Drawer.Content>
        <Drawer.Footer>[ DONE ] | [ COPY ] [ RETIRE ]</Drawer.Footer>
      </Drawer>
    </>
  )
}

export default PreferenceViewDrawer
