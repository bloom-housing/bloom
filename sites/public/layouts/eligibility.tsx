import React, { useContext } from "react"
import {
  AppearanceStyleType,
  Button,
  Form,
  FormCard,
  ProgressNav,
  t,
} from "@bloom-housing/ui-components"
import Layout from "./application"
import styles from "./Eligibility.module.scss"
import { ApplicationTimeout } from "../src/forms/applications/ApplicationTimeout"
import { EligibilityContext } from "../lib/EligibilityContext"
import { ELIGIBILITY_SECTIONS } from "../lib/constants"
import { eligibilityRoute } from "../lib/helpers"
import { UseFormMethods } from "react-hook-form"
import { useRouter } from "next/router"
import { getFilterUrlLink } from "../lib/filterUrlLink"

export interface EligibilityLayoutProps {
  title: string
  currentPage: number
  children: any
  onFinishStep?: (data: any) => void
  formMethods: UseFormMethods
}

const EligibilityLayout = (props: EligibilityLayoutProps) => {
  const router = useRouter()
  const { eligibilityRequirements } = useContext(EligibilityContext)

  const handleSubmit = props.formMethods.handleSubmit

  const onBack = async (data) => {
    props.onFinishStep?.(data)
    await router.push(eligibilityRoute(props.currentPage - 1))
  }
  const onNext = async (data) => {
    props.onFinishStep?.(data)
    await router.push(eligibilityRoute(props.currentPage + 1))
  }
  const onFinish = async (data) => {
    props.onFinishStep?.(data)
    await router.push(getFilterUrlLink(eligibilityRequirements))
  }

  if (eligibilityRequirements.completedSections <= props.currentPage) {
    eligibilityRequirements.setCompletedSections(props.currentPage + 1)
  }
  const isNotFirstPage = props.currentPage > 0
  const isNotLastPage = props.currentPage < ELIGIBILITY_SECTIONS.length - 1

  return (
    <>
      <ApplicationTimeout />
      <Layout>
        <section className="bg-white">
          <h2 className={styles.eligibility_header}>{t("eligibility.progress.header")}</h2>
          <div className="bg-gray-200">
            <div className={`mx-auto ${styles.eligibility_contents}`}>
              <ProgressNav
                currentPageSection={props.currentPage + 1}
                completedSections={eligibilityRequirements.completedSections}
                labels={ELIGIBILITY_SECTIONS.map((label) =>
                  t(`eligibility.progress.sections.${label}`)
                )}
                routes={ELIGIBILITY_SECTIONS.map((_label, i) => eligibilityRoute(i))}
              />
            </div>
          </div>
          <div className={`mx-auto ${styles.eligibility_contents}`}>
            <div className="form-card__lead pb-2 pt-11">
              <h2 className="form-card__title is-borderless font-bold">{props.title}</h2>
            </div>
            <FormCard className="border-0">
              <Form onSubmit={handleSubmit(onNext)}>
                {props.children}
                <div className="form-card__pager">
                  <div className="form-card__pager-row px-0 pb-8 flex gap-2">
                    {isNotFirstPage && (
                      <Button onClick={handleSubmit(onBack)} icon="arrowBack" iconPlacement="left">
                        {t("t.back")}
                      </Button>
                    )}
                    <div className="flex-grow" />
                    {isNotFirstPage && (
                      <Button
                        id="seeResultsNow"
                        onClick={handleSubmit(onFinish)}
                        styleType={isNotLastPage ? undefined : AppearanceStyleType.primary}
                        icon={isNotLastPage ? undefined : "check"}
                        iconPlacement={"left"}
                      >
                        {t("eligibility.seeResultsNow")}
                      </Button>
                    )}
                    {isNotLastPage && (
                      <Button styleType={AppearanceStyleType.primary}>{t("t.next")}</Button>
                    )}
                  </div>
                </div>
              </Form>
            </FormCard>
          </div>
        </section>
      </Layout>
    </>
  )
}

export default EligibilityLayout
