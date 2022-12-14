/*
0.2 - What To Expect
A notice regarding application process and rules
*/
import React, { useEffect, useContext, useMemo } from "react"
import {
  AppearanceStyleType,
  Button,
  FormCard,
  t,
  ProgressNav,
  Form,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../../layouts/forms"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { useFormConductor } from "../../../lib/hooks"
import { OnClientSide, PageView, pushGtmEvent, AuthContext } from "../shared"
import { UserStatus } from "../../../lib/constants"
import Markdown from "markdown-to-jsx"
import { ListingReviewOrder } from "@bloom-housing/backend-core/types"

const ApplicationWhatToExpect = () => {
  const { profile } = useContext(AuthContext)
  const { conductor, application, listing } = useFormConductor("whatToExpect")
  const router = useRouter()
  const currentPageSection = 1

  /* Form Handler */
  const { handleSubmit } = useForm()
  const onSubmit = () => {
    conductor.routeToNextOrReturnUrl()
  }

  const content = useMemo(() => {
    switch (listing?.reviewOrderType) {
      case ListingReviewOrder.firstComeFirstServe:
        return {
          steps: t("application.start.whatToExpect.fcfs.steps"),
          finePrint: t("application.start.whatToExpect.fcfs.finePrint"),
        }
      case ListingReviewOrder.lottery:
        return {
          steps: t("application.start.whatToExpect.lottery.steps"),
          finePrint: t("application.start.whatToExpect.lottery.finePrint"),
        }
      case ListingReviewOrder.waitlist:
        return {
          steps: t("application.start.whatToExpect.waitlist.steps"),
          finePrint: t("application.start.whatToExpect.waitlist.finePrint"),
        }
      default:
        return { steps: "", finePrint: "" }
    }
  }, [listing, router.locale])

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Application - What to Expect",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <FormsLayout>
      <FormCard
        header={{
          isVisible: true,
          title: listing?.name,
        }}
      >
        <ProgressNav
          currentPageSection={currentPageSection}
          completedSections={application.completedSections}
          labels={conductor.config.sections.map((label) => t(`t.${label}`))}
          mounted={OnClientSide()}
        />
      </FormCard>
      <FormCard>
        <div className="form-card__lead border-b">
          <h2 className="form-card__title is-borderless mt-4">
            {t("application.start.whatToExpect.title")}
          </h2>
        </div>
        <div className="form-card__pager-row px-16">
          <div className="markdown mt-4">
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
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button
                styleType={AppearanceStyleType.primary}
                onClick={() => conductor.setNavigatedBack(false)}
                data-test-id={"app-next-step-button"}
              >
                {t("t.next")}
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </FormsLayout>
  )
}

export default ApplicationWhatToExpect
