import React, { useState } from "react"
import { MinimalTable, t } from "@bloom-housing/ui-components"
import { Button, Card, Drawer, FieldValue, Grid, Tag } from "@bloom-housing/ui-seeds"
import {
  MultiselectOption,
  MultiselectQuestion,
  MultiselectQuestionCreate,
  MultiselectQuestionsService,
  MultiselectQuestionsStatusEnum,
  ValidationMethodEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../shared/SectionWithGrid"
import { useSWRConfig } from "swr"
import { useMapLayersList } from "../../../lib/hooks"

type MultiselectQuestionViewDrawerProps = {
  drawerOpen: boolean
  questionData: MultiselectQuestion
  questionsService: MultiselectQuestionsService
  copyQuestion: (data: MultiselectQuestionCreate) => void
  cacheKey: string
  onDrawerClose: () => void
}

const MultiselectQuestionViewDrawer = ({
  drawerOpen,
  questionData,
  questionsService,
  copyQuestion,
  cacheKey,
  onDrawerClose,
}: MultiselectQuestionViewDrawerProps) => {
  const { mutate } = useSWRConfig()
  const [optionData, setOptionData] = useState<MultiselectOption>(null)

  const drawerTitle = t("settings.preferenceView")

  const { mapLayers } = useMapLayersList(questionData?.jurisdiction?.id)
  const mapLayerName = mapLayers?.find((item) => item.id === optionData?.mapLayerId)?.name

  let variant = null
  switch (questionData?.status) {
    case MultiselectQuestionsStatusEnum.active:
      variant = "success"
      break
    case MultiselectQuestionsStatusEnum.toRetire:
    case MultiselectQuestionsStatusEnum.retired:
      variant = "highlight-warm"
      break
  }
  const statusText = `${questionData?.status
    ?.charAt(0)
    ?.toUpperCase()}${questionData?.status?.slice(1)}`
  const statusTag = <Tag variant={variant}>{statusText}</Tag>

  return (
    <>
      <Drawer
        isOpen={!!drawerOpen}
        onClose={() => {
          onDrawerClose()
        }}
        ariaLabelledBy="preference-view-drawer-header"
      >
        <Drawer.Header id="preference-view-drawer-header">
          {drawerTitle} {statusTag}
        </Drawer.Header>
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
                          view: {
                            content: (
                              <Button variant="text" onClick={() => setOptionData(item)}>
                                {t("t.view")}
                              </Button>
                            ),
                          },
                        }))}
                      />
                    </Grid.Cell>
                  </Grid.Row>
                </SectionWithGrid>
              )}

              <SectionWithGrid heading="" inset>
                <Grid.Row>
                  <FieldValue label={t("settings.preferenceExclusiveQuestion")}>
                    {questionData?.isExclusive
                      ? t("settings.preferenceExclusive")
                      : t("settings.preferenceMultiSelect")}
                  </FieldValue>
                </Grid.Row>
                <Grid.Row>
                  <FieldValue label={t("settings.preferenceShowOnListing")}>
                    {questionData?.hideFromListing ? t("t.no") : t("t.yes")}
                  </FieldValue>
                </Grid.Row>
                <Grid.Row>
                  <FieldValue label={t("t.jurisdiction")}>
                    {questionData?.jurisdiction?.name}
                  </FieldValue>
                </Grid.Row>
              </SectionWithGrid>
            </Card.Section>
          </Card>
        </Drawer.Content>
        <Drawer.Footer>
          <Button type="button" variant="primary" onClick={onDrawerClose}>
            {t("t.done")}
          </Button>
          <Button
            type="button"
            variant="primary-outlined"
            className="ml-auto"
            onClick={() => {
              copyQuestion(questionData)
              onDrawerClose()
            }}
          >
            {t("actions.copy")}
          </Button>
          <Button
            type="button"
            variant={
              questionData?.status === MultiselectQuestionsStatusEnum.active
                ? "alert-outlined"
                : "primary-outlined"
            }
            onClick={async () => {
              questionData?.status === MultiselectQuestionsStatusEnum.retired ||
              questionData?.status === MultiselectQuestionsStatusEnum.toRetire
                ? await questionsService.reActivate({ body: { id: questionData.id } })
                : await questionsService.retire({ body: { id: questionData.id } })
              onDrawerClose()
              await mutate(cacheKey)
            }}
          >
            {questionData?.status === MultiselectQuestionsStatusEnum.retired ||
            questionData?.status === MultiselectQuestionsStatusEnum.toRetire
              ? "Return to Active"
              : "Retire"}
          </Button>
        </Drawer.Footer>
      </Drawer>

      <Drawer
        isOpen={!!optionData}
        onClose={() => {
          setOptionData(null)
        }}
        ariaLabelledBy="preference-nested-drawer-header"
        nested
      >
        <Drawer.Header id="preference-nested-drawer-header">
          {t("settings.preferenceOptionView")}
        </Drawer.Header>
        <Drawer.Content>
          <Card>
            <Card.Section>
              <SectionWithGrid heading={t("t.option")}>
                <Grid.Row columns={3}>
                  <FieldValue label={t("t.title")}>{optionData?.name}</FieldValue>
                  <FieldValue label={t("t.descriptionTitle")}>{optionData?.description}</FieldValue>
                </Grid.Row>
                {optionData?.links?.length > 0 && (
                  <Grid.Row>
                    <FieldValue label={t("t.url")}>{optionData?.links[0].url}</FieldValue>
                    <FieldValue label={t("settings.preferenceLinkTitle")}>
                      {optionData?.links[0].title}
                    </FieldValue>
                  </Grid.Row>
                )}
                <Grid.Row>
                  <FieldValue label={t("settings.preferenceOptOut")}>
                    {optionData?.isOptOut ? t("t.yes") : t("t.no")}
                  </FieldValue>
                  <FieldValue label={t("settings.preferenceCollectAddress")}>
                    {optionData?.shouldCollectAddress ? t("t.yes") : t("t.no")}
                  </FieldValue>
                </Grid.Row>
                {optionData?.shouldCollectAddress && optionData?.validationMethod && (
                  <Grid.Row>
                    {optionData?.validationMethod === ValidationMethodEnum.radius && (
                      <FieldValue label={"Radius"}>{optionData?.radiusSize}</FieldValue>
                    )}
                    {optionData?.validationMethod === ValidationMethodEnum.map && (
                      <FieldValue label={"Map Layer"}>{mapLayerName}</FieldValue>
                    )}
                  </Grid.Row>
                )}
                {optionData?.shouldCollectAddress && (
                  <Grid.Row>
                    <FieldValue label={t("settings.preferenceCollectAddressHolderName")}>
                      {optionData?.shouldCollectName ? t("t.yes") : t("t.no")}
                    </FieldValue>
                    <FieldValue label={t("settings.preferenceCollectAddressHolderRelationship")}>
                      {optionData?.shouldCollectRelationship ? t("t.yes") : t("t.no")}
                    </FieldValue>
                  </Grid.Row>
                )}
              </SectionWithGrid>
            </Card.Section>
          </Card>
        </Drawer.Content>
        <Drawer.Footer>
          <Button type="button" variant="primary" onClick={() => setOptionData(null)}>
            {t("t.done")}
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  )
}

export default MultiselectQuestionViewDrawer
