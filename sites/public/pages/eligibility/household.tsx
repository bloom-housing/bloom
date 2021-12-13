/*
Household Size Count
Prompts the user for the number of members in their household.
*/
import {
  AppearanceStyleType,
  Button,
  Form,
  FormCard,
  ProgressNav,
  Select,
  t,
} from "@bloom-housing/ui-components"
import FormsLayout from "../../layouts/forms"
import { useForm } from "react-hook-form"
import React, { useContext } from "react"
import { useRouter } from "next/router"
import { ELIGIBILITY_DISCLAIMER_ROUTE, ELIGIBILITY_SECTIONS } from "../../lib/constants"
import { EligibilityContext } from "../../lib/EligibilityContext"
import FormBackLink from "../../src/forms/applications/FormBackLink"
import { eligibilityRoute } from "../../lib/helpers"
import EligibilityLayout from "../../layouts/eligibility"

const EligibilityHouseholdSize = () => {
  const router = useRouter()
  const { eligibilityRequirements } = useContext(EligibilityContext)
  const CURRENT_PAGE = 1

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register } = useForm({
    defaultValues: {
      householdSize: eligibilityRequirements?.householdSizeCount,
    },
  })

  const onSubmit = async (data) => {
    eligibilityRequirements.setHouseholdSizeCount(data.householdSize)

    await router.push(eligibilityRoute(CURRENT_PAGE + 1))
  }

  const onClick = async (data) => {
    eligibilityRequirements.setHouseholdSizeCount(data.householdSize)
    await router.push(ELIGIBILITY_DISCLAIMER_ROUTE)
  }

  if (eligibilityRequirements.completedSections <= CURRENT_PAGE) {
    eligibilityRequirements.setCompletedSections(CURRENT_PAGE + 1)
  }

  const householdSizeRanges = ["one", "two", "three", "four", "five", "six", "seven", "eight"]

  return (
    <EligibilityLayout currentPageSection={2}>
      <FormCard>
        <FormBackLink
          url={eligibilityRoute(CURRENT_PAGE - 1)}
          onClick={() => {
            // Not extra actions needed.
          }}
        />
        <div className="form-card__lead pb-0 pt-8">
          <h2 className="form-card__title is-borderless">{t("eligibility.household.prompt")}</h2>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group">
            <legend className="sr-only">{t("eligibility.household.prompt")}</legend>
            <Select
              id="householdSize"
              name="householdSize"
              label={t("eligibility.household.srCountLabel")}
              describedBy="householdSize-description"
              validation={{ required: true }}
              register={register}
              controlClassName="control"
              placeholder={t("t.selectOne")}
              options={householdSizeRanges}
              keyPrefix="eligibility.household.ranges"
            />
          </div>
          <div className="form-card__pager">
            <div className="form-card__pager-row primary">
              <Button className="mx-2 mt-6" styleType={AppearanceStyleType.primary}>
                {t("t.next")}
              </Button>
              <Button
                onClick={handleSubmit(onClick)}
                className="mx-2 mt-6"
                styleType={AppearanceStyleType.primary}
              >
                {t("t.finish")}
              </Button>
            </div>
          </div>
        </Form>
      </FormCard>
    </EligibilityLayout>
  )
}

export default EligibilityHouseholdSize
