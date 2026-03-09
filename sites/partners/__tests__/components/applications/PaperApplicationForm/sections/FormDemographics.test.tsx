import React from "react"
import userEvent from "@testing-library/user-event"
import { RaceEthnicityConfiguration } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { defaultRaceEthnicityConfiguration } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import { t } from "@bloom-housing/ui-components"
import { FormDemographics } from "../../../../../src/components/applications/PaperApplicationForm/sections/FormDemographics"
import { mockNextRouter, render, screen, FormProviderWrapper, within } from "../../../../testUtils"

const customConfig: RaceEthnicityConfiguration = {
  options: [
    {
      id: "blackAfricanAmerican",
      subOptions: [],
      allowOtherText: false,
    },
    {
      id: "white",
      subOptions: [],
      allowOtherText: false,
    },

    {
      id: "otherMultiracial",
      subOptions: [],
      allowOtherText: true,
    },
  ],
}

beforeAll(() => {
  mockNextRouter()
})

describe("<FormDemographics>", () => {
  it("renders the form with full demographic information fields", () => {
    render(
      <FormProviderWrapper>
        <FormDemographics
          formValues={{
            id: "id",
            race: [],
            howDidYouHear: [],
          }}
          raceEthnicityConfiguration={defaultRaceEthnicityConfiguration}
          enableLimitedHowDidYouHear={false}
          disableEthnicityQuestion={false}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByText(/race/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/american indian \/ alaskan native/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/asian/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/black \/ african american/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/native hawaiian \/ other pacific islander/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/white/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/other \/ multiracial/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/decline to respond/i)).toBeInTheDocument()

    expect(screen.queryByLabelText(/Asian Indian/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Chinese/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Filipino/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Japanese/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Korean/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Vietnamese/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Other Asian/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/^Native Hawaiian$/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Guamanian or Chamorro/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Samoan/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/^Other Pacific Islander$/i)).not.toBeInTheDocument()

    expect(screen.getByLabelText(/ethnicity/i)).toBeInTheDocument()

    const howDidYouHearGroup = screen.getByRole("group", {
      name: "How did you hear about us?",
    })
    expect(within(howDidYouHearGroup).getAllByRole("checkbox")).toHaveLength(9)
    expect(
      within(howDidYouHearGroup).getByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.flyer"),
      })
    ).toBeInTheDocument()
    expect(
      within(howDidYouHearGroup).getByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.emailAlert"),
      })
    ).toBeInTheDocument()
    expect(
      within(howDidYouHearGroup).getByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.friend"),
      })
    ).toBeInTheDocument()
    expect(
      within(howDidYouHearGroup).getByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.housingCounselor"),
      })
    ).toBeInTheDocument()
    expect(
      within(howDidYouHearGroup).getByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.developerWebsite"),
      })
    ).toBeInTheDocument()
    expect(
      within(howDidYouHearGroup).getByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.jurisdictionWebsite"),
      })
    ).toBeInTheDocument()
    expect(
      within(howDidYouHearGroup).getByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.busAd"),
      })
    ).toBeInTheDocument()
    expect(
      within(howDidYouHearGroup).getByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.radioAd"),
      })
    ).toBeInTheDocument()
    expect(
      within(howDidYouHearGroup).getByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.other"),
      })
    ).toBeInTheDocument()
  })

  it("renders the form with limited how did you hear options when flag is enabled", () => {
    render(
      <FormProviderWrapper>
        <FormDemographics
          formValues={{
            id: "id",
            race: [],
            howDidYouHear: [],
          }}
          raceEthnicityConfiguration={customConfig}
          enableLimitedHowDidYouHear={true}
          disableEthnicityQuestion={false}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByText(/race/i)).toBeInTheDocument()

    expect(screen.getByLabelText(/ethnicity/i)).toBeInTheDocument()

    const howDidYouHearGroup = screen.getByRole("group", {
      name: "How did you hear about us?",
    })
    expect(within(howDidYouHearGroup).getAllByRole("checkbox")).toHaveLength(7)
    expect(
      within(howDidYouHearGroup).getByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.flyer"),
      })
    ).toBeInTheDocument()
    expect(
      within(howDidYouHearGroup).getByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.emailAlert"),
      })
    ).toBeInTheDocument()
    expect(
      within(howDidYouHearGroup).getByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.friend"),
      })
    ).toBeInTheDocument()
    expect(
      within(howDidYouHearGroup).getByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.housingCounselor"),
      })
    ).toBeInTheDocument()
    expect(
      within(howDidYouHearGroup).getByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.developerWebsite"),
      })
    ).toBeInTheDocument()
    expect(
      within(howDidYouHearGroup).getByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.jurisdictionWebsite"),
      })
    ).toBeInTheDocument()
    expect(
      within(howDidYouHearGroup).queryByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.busAd"),
      })
    ).not.toBeInTheDocument()
    expect(
      within(howDidYouHearGroup).queryByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.radioAd"),
      })
    ).not.toBeInTheDocument()
    expect(
      within(howDidYouHearGroup).getByRole("checkbox", {
        name: t("application.review.demographics.howDidYouHearOptions.other"),
      })
    ).toBeInTheDocument()
  })

  it("should expand suboptions when main key is checked", async () => {
    render(
      <FormProviderWrapper>
        <FormDemographics
          formValues={{
            id: "id",
            race: [],
            howDidYouHear: [],
          }}
          enableLimitedHowDidYouHear={false}
          disableEthnicityQuestion={false}
          raceEthnicityConfiguration={defaultRaceEthnicityConfiguration}
          enableSpokenLanguage={false}
        />
      </FormProviderWrapper>
    )

    const asianCheckbox = screen.getByLabelText(/asian/i)
    const hawaiianPacificCheckbox = screen.getByLabelText(
      /native hawaiian \/ other pacific islander/i
    )

    await userEvent.click(asianCheckbox)
    await userEvent.click(hawaiianPacificCheckbox)

    expect(screen.getByLabelText(/Asian Indian/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Chinese/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Filipino/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Japanese/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Korean/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Vietnamese/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Other Asian/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Native Hawaiian$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Guamanian or Chamorro/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Samoan/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Other Pacific Islander$/i)).toBeInTheDocument()
  })

  it("should hide ethnicity field when disableEthnicityQuestion flag is enabled", () => {
    render(
      <FormProviderWrapper>
        <FormDemographics
          formValues={{
            id: "id",
            race: [],
            howDidYouHear: [],
          }}
          enableLimitedHowDidYouHear={false}
          disableEthnicityQuestion={true}
          raceEthnicityConfiguration={defaultRaceEthnicityConfiguration}
        />
      </FormProviderWrapper>
    )

    expect(screen.queryByLabelText("Ethnicity")).not.toBeInTheDocument()
    expect(screen.getByText("Race", { selector: "legend" })).toBeInTheDocument()
  })

  it("should show ethnicity field when disableEthnicityQuestion flag is disabled", () => {
    render(
      <FormProviderWrapper>
        <FormDemographics
          formValues={{
            id: "id",
            race: [],
            howDidYouHear: [],
          }}
          enableLimitedHowDidYouHear={false}
          disableEthnicityQuestion={false}
          raceEthnicityConfiguration={defaultRaceEthnicityConfiguration}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByLabelText("Ethnicity")).toBeInTheDocument()
    expect(screen.getByText("Race", { selector: "legend" })).toBeInTheDocument()
  })
  it("should render race options with custom configuration", () => {
    render(
      <FormProviderWrapper>
        <FormDemographics
          formValues={{
            id: "id",
            race: [],
            howDidYouHear: [],
          }}
          enableLimitedHowDidYouHear={false}
          disableEthnicityQuestion={false}
          raceEthnicityConfiguration={customConfig}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByText("Race")).toBeInTheDocument()
    expect(screen.getByLabelText("White")).toBeInTheDocument()
    expect(screen.getByLabelText("Black / African American")).toBeInTheDocument()
    expect(screen.getByLabelText("Other / Multiracial")).toBeInTheDocument()

    // Should not show options not in the custom config
    expect(screen.queryByLabelText("American Indian / Alaskan Native")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Asian")).not.toBeInTheDocument()
    expect(
      screen.queryByLabelText("Native Hawaiian / Other Pacific Islander")
    ).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Decline to Respond")).not.toBeInTheDocument()
  })

  it("should render custom configuration with suboptions", async () => {
    const customConfig: RaceEthnicityConfiguration = {
      options: [
        {
          id: "asian",
          subOptions: [
            { id: "chinese", allowOtherText: false },
            { id: "vietnamese", allowOtherText: false },
          ],
          allowOtherText: false,
        },
        {
          id: "otherMultiracial",
          subOptions: [],
          allowOtherText: true,
        },
      ],
    }

    render(
      <FormProviderWrapper>
        <FormDemographics
          formValues={{
            id: "id",
            race: [],
            howDidYouHear: [],
          }}
          enableLimitedHowDidYouHear={false}
          disableEthnicityQuestion={false}
          raceEthnicityConfiguration={customConfig}
        />
      </FormProviderWrapper>
    )

    expect(screen.getByText("Race")).toBeInTheDocument()

    // Suboptions should not be visible until parent is clicked
    expect(screen.queryByLabelText("Chinese")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Vietnamese")).not.toBeInTheDocument()

    const asianCheckbox = screen.getByLabelText("Asian")
    await userEvent.click(asianCheckbox)

    expect(screen.getByLabelText("Chinese")).toBeInTheDocument()
    expect(screen.getByLabelText("Vietnamese")).toBeInTheDocument()

    // Should not show other Asian suboptions not in the custom config
    expect(screen.queryByLabelText("Japanese")).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Filipino")).not.toBeInTheDocument()
  })

  it("should handle empty race options configuration", () => {
    const emptyConfig: RaceEthnicityConfiguration = {
      options: [],
    }

    render(
      <FormProviderWrapper>
        <FormDemographics
          formValues={{
            id: "id",
            race: [],
            howDidYouHear: [],
          }}
          enableLimitedHowDidYouHear={false}
          disableEthnicityQuestion={false}
          raceEthnicityConfiguration={emptyConfig}
        />
      </FormProviderWrapper>
    )

    // Race section should not render if no options
    expect(screen.queryByText("Race")).not.toBeInTheDocument()

    // But ethnicity and how did you hear should still render
    expect(screen.getByLabelText("Ethnicity")).toBeInTheDocument()
    expect(screen.getByText("How did you hear about us?")).toBeInTheDocument()
  })

  it("shows spoken language select when feature flag enabled", () => {
    render(
      <FormProviderWrapper>
        <FormDemographics
          formValues={{
            id: "id",
            race: [],
            howDidYouHear: [],
          }}
          enableLimitedHowDidYouHear={false}
          enableSpokenLanguage={true}
          visibleSpokenLanguages={["spanish", "notListed"]}
          disableEthnicityQuestion={false}
        />
      </FormProviderWrapper>
    )

    const select = screen.getByRole("combobox", {
      name: "Which language is most commonly spoken in your home?",
    })
    expect(select).toBeInTheDocument()

    const optionValues = Array.from(select.querySelectorAll("option")).map((option) => option.value)
    expect(optionValues).toEqual(expect.arrayContaining(["spanish", "notListed"]))
  })

  it("hides spoken language select when feature flag disabled", () => {
    render(
      <FormProviderWrapper>
        <FormDemographics
          formValues={{
            id: "id",
            race: [],
            howDidYouHear: [],
          }}
          enableLimitedHowDidYouHear={false}
          enableSpokenLanguage={false}
          visibleSpokenLanguages={["spanish", "english"]}
          disableEthnicityQuestion={false}
        />
      </FormProviderWrapper>
    )

    expect(
      screen.queryByRole("combobox", {
        name: "Which language is most commonly spoken in your home?",
      })
    ).not.toBeInTheDocument()
  })

  it("shows not listed textbox when not listed is selected", async () => {
    render(
      <FormProviderWrapper>
        <FormDemographics
          formValues={{
            id: "id",
            race: [],
            howDidYouHear: [],
          }}
          enableLimitedHowDidYouHear={false}
          enableSpokenLanguage={true}
          visibleSpokenLanguages={["spanish", "english", "notListed"]}
          disableEthnicityQuestion={false}
        />
      </FormProviderWrapper>
    )

    const select = screen.getByRole("combobox", {
      name: "Which language is most commonly spoken in your home?",
    })
    await userEvent.selectOptions(select, "notListed")

    expect(screen.getByLabelText("Please specify:")).toBeInTheDocument()
  })
})
