import React, { useEffect, useContext, useMemo } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import Markdown from "markdown-to-jsx"
import { ReviewOrderTypeEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t, Form } from "@bloom-housing/ui-components"
import { OnClientSide, PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { Button } from "@bloom-housing/ui-seeds"
import { CardSection } from "@bloom-housing/ui-seeds/src/blocks/Card"
import FormsLayout from "../../../layouts/forms"
import { useFormConductor } from "../../../lib/hooks"
import { UserStatus } from "../../../lib/constants"
import ApplicationFormLayout from "../../../layouts/application-form"
import styles from "../../../layouts/application-form.module.scss"
import { isUnitGroupAppBase, isUnitGroupAppWaitlist } from "../../../lib/helpers"

const ApplicationWhatToExpect = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, listing } = useFormConductor("whatToExpect", true)
  const router = useRouter()

  const { handleSubmit } = useForm()
  const onSubmit = () => {
    conductor.routeToNextOrReturnUrl()
  }

  const content = useMemo(() => {
    switch (listing?.reviewOrderType) {
      case ReviewOrderTypeEnum.firstComeFirstServe:
        if (isUnitGroupAppWaitlist(listing, conductor.config)) {
          return {
            steps: t("application.start.whatToExpect.waitlist.steps"),
            finePrint: t("application.start.whatToExpect.waitlist.finePrint"),
          }
        }
        if (isUnitGroupAppBase(listing, conductor.config)) {
          return {
            steps: "",
            finePrint: t("application.start.whatToExpect.base.finePrint"),
          }
        }
        return {
          steps: t("application.start.whatToExpect.fcfs.steps"),
          finePrint: t("application.start.whatToExpect.fcfs.finePrint"),
        }
      case ReviewOrderTypeEnum.lottery:
        return {
          steps: t("application.start.whatToExpect.lottery.steps"),
          finePrint: t("application.start.whatToExpect.lottery.finePrint"),
        }
      case ReviewOrderTypeEnum.waitlist:
        return {
          steps: t("application.start.whatToExpect.waitlist.steps"),
          finePrint: t("application.start.whatToExpect.waitlist.finePrint"),
        }
      default:
        return { steps: "", finePrint: "" }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing, router.locale, conductor.config])

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - What to Expect",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout
      pageTitle={`${t("whatToExpect.label")} - ${t("listings.apply.applyOnline")} - ${
        listing?.name
      }`}
    >
      <ApplicationFormLayout
        listingName={listing?.name}
        heading={t("application.start.whatToExpect.title")}
        progressNavProps={{
          currentPageSection: 1,
          completedSections: 0,
          labels: conductor.config.sections.map((label) => t(`t.${label}`)),
          mounted: OnClientSide(),
        }}
        backLink={{
          url: listing?.includeCommunityDisclaimer
            ? conductor.determinePreviousUrl()
            : `/applications/start/choose-language?listingId=${listing?.id}`,
        }}
      >
        <CardSection>
          <div className="markdown">
            <Markdown
              options={{
                disableParsingRawHTML: true,
                overrides: {
                  ol: {
                    component: ({ children, ...props }) => (
                      <ol {...props} className="large-numbers">
                        {children}
                      </ol>
                    ),
                  },
                },
              }}
            >
              {content.steps}
            </Markdown>

            <Markdown
              options={{
                disableParsingRawHTML: true,
                overrides: {
                  li: {
                    component: ({ children, ...props }) => (
                      <li {...props} className="mb-5">
                        {children}
                      </li>
                    ),
                  },
                },
              }}
            >
              {content.finePrint}
            </Markdown>
          </div>
        </CardSection>
        <CardSection className={styles["application-form-action-footer"]}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Button
              type="submit"
              variant="primary"
              onClick={() => conductor.setNavigatedBack(false)}
              id={"app-next-step-button"}
            >
              {t("t.next")}
            </Button>
          </Form>
        </CardSection>
      </ApplicationFormLayout>
    </FormsLayout>
  )
}

export default ApplicationWhatToExpect
