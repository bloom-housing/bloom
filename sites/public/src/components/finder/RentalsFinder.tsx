import { BloomCard, CustomIconMap } from "@bloom-housing/shared-helpers";
import styles from './RentalsFinder.module.scss'
import { Button, CheckboxGroup, Heading, HeadingGroup, Icon } from "@bloom-housing/ui-seeds";
import { CardSection, Field, t } from "@bloom-housing/ui-components";
import FinderMultiselectQuestion from "./FinderMultiselectQuestion";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { RegionEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger";

type FinderStep = {
  fieldGroupName: string
  content: React.ReactNode
  question: string
  subtitle: string
}

type FinderSection = {
  sectionTitle: string;
  sectionSteps: FinderStep[]
}

export default function RentalsFinder() {
  const [stepIndex, setStepIndex] = useState<number>(0)
  const [sectionIndex, setSectionIndex] = useState<number>(0)
  const formMethods = useForm()

  const rentalFinderSections: FinderSection[] = [{
    sectionTitle: '',
    sectionSteps: [
      {
        fieldGroupName: 'bedRoomSize',
        question: t("finder.bedrooms.question"),
        subtitle: t("finder.bedrooms.subtitle"),
        content: (
          <FinderMultiselectQuestion
            legend={t("finder.multiselectLegend")}
            fieldGroupName="bedrooms_count"
            options={[{
              label: t("application.household.preferredUnit.options.studio"),
              value: 'studio',
            }, {
              label: t("application.household.preferredUnit.options.oneBdrm"),
              value: 'oneBdrm'
            }, {
              label: t("application.household.preferredUnit.options.twoBdrm"),
              value: 'twoBdrm'
            }, {
              label: t("application.household.preferredUnit.options.threeBdrm"),
              value: "threBdrm"
            }, {
              label: t("finder.bedrooms.fourMoreBdrm"),
              value: "fourMoreBdrm",
            }]}
          />
        )
      }, {
        fieldGroupName: 'region',
        question: t("finder.region.question"),
        subtitle: t("finder.region.subtitle"),
        content: (
          <FinderMultiselectQuestion
            legend={t("finder.multiselectLegend")}
            fieldGroupName="region"
            options={Object.keys(RegionEnum).map((region) => ({
              label: region.replace('_', " "),
              value: region,
            }))}
          />
        )
      }
    ]
  }]

  const activeQuestion = rentalFinderSections[sectionIndex]?.sectionSteps[stepIndex]
  const isLastSection = sectionIndex === rentalFinderSections.length - 1
  const isLastStep = stepIndex === rentalFinderSections[sectionIndex]?.sectionSteps.length - 1

  const onNextClick = () => {
    if (isLastStep) {
      setSectionIndex((prev) => prev + 1)
      setStepIndex(0)
    } else {
      setStepIndex((prev) => prev + 1)
    }
  }

  const onPreviousClick = () => {
    if (stepIndex == 0) {
      const prevSectionIndex = sectionIndex - 1
      const numberOfSteps = rentalFinderSections[prevSectionIndex]?.sectionSteps.length
      setStepIndex(numberOfSteps - 1)
      setSectionIndex(prevSectionIndex)
    } else {
      setStepIndex((prev) => prev - 1)
    }
  }

  return (
    <div className={styles['finder-container']}>
      <div className={styles['questionnaire-container']}>
        <div className={styles['questionnaire-header']}>
          <Heading priority={3} size="2xl" className={styles['title']}>Find listings for you</Heading>
          {/* TODO: Implement header progress bar */}
        </div>
        <BloomCard className={styles['questionnaire-card']}>
          <CardSection>
            <div className={styles['header-wrapper']}>
              <div>
                {!(sectionIndex === 0 && stepIndex === 0) && <Button
                  onClick={onPreviousClick}
                  leadIcon={<Icon>{CustomIconMap.chevronLeft}</Icon>}
                  variant={"text"}
                  className={styles['back-button']}
                >
                  {t("t.back")}
                </Button>
                }
                <HeadingGroup
                  className={styles['heading-group']}
                  heading={activeQuestion.question}
                  subheading={activeQuestion.subtitle}
                  headingPriority={3}
                  size="2xl"
                />
              </div>
            </div>
            <div className={styles['questions-wrapper']}>
              <FormProvider {...formMethods}>
                {activeQuestion.content}
              </FormProvider>
            </div>
            <div className={styles['button-wrapper']}>
              {(isLastSection && isLastStep) ?
                <Button >{t("t.finish")}</Button> :
                <Button onClick={onNextClick}>{t("t.next")}</Button>}

            </div>
            <div className={styles['footer']}>
              <Button variant="text">Skip this and show me listings</Button>
            </div>
          </CardSection>
        </BloomCard>
      </div>
    </div>
  )
}