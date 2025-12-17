import React from "react"
import { FormMultiselectQuestions } from "../../../../../src/components/applications/PaperApplicationForm/sections/FormMultiselectQuestions"
import { MultiselectQuestionsApplicationSectionEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { mockNextRouter, render, screen, FormProviderWrapper } from "../../../../testUtils"
import { multiselectQuestionPreference } from "@bloom-housing/shared-helpers/__tests__/testHelpers"
import userEvent from "@testing-library/user-event"

beforeAll(() => {
  mockNextRouter()
})

describe("<FormMultiselectQuestions>", () => {
  it("should render nothing when no questions are provided", () => {
    const { container } = render(
      <FormProviderWrapper>
        <FormMultiselectQuestions
          sectionTitle="Test Section Title"
          questions={[]}
          applicationSection={MultiselectQuestionsApplicationSectionEnum.preferences}
        />
      </FormProviderWrapper>
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("should render checkbox type options without subsection fields", () => {
    render(
      <FormProviderWrapper>
        <FormMultiselectQuestions
          sectionTitle="Test Section Title"
          questions={[
            {
              multiselectQuestions: {
                ...multiselectQuestionPreference,
                options: [
                  {
                    text: "Live in County",
                    ordinal: 1,
                  },
                  {
                    text: "Work in County",
                    ordinal: 2,
                  },
                ],
                optOutText: "No preference",
              },
            },
          ]}
          applicationSection={MultiselectQuestionsApplicationSectionEnum.preferences}
        />
      </FormProviderWrapper>
    )

    expect(
      screen.getByRole("heading", { level: 2, name: /test section title/i })
    ).toBeInTheDocument()

    expect(screen.getByRole("checkbox", { name: /live in county/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /work in county/i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /no preference/i })).toBeInTheDocument()

    expect(screen.queryByLabelText(/full name of address holder/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/relationship to address holder/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/street address/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/apt or unit #/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/city/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/state/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/zip code/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/map preview/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/map pin position/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/automatic/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/Map pin position is based on the address provided/i)
    ).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/custom/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/Drag the pin to update the marker location/i)
    ).not.toBeInTheDocument()
  })

  it("should render radio type options without subsection fields", () => {
    render(
      <FormProviderWrapper>
        <FormMultiselectQuestions
          sectionTitle="Test Section Title"
          questions={[
            {
              multiselectQuestions: {
                ...multiselectQuestionPreference,
                options: [
                  {
                    text: "Live in County",
                    ordinal: 1,
                    exclusive: true,
                  },
                  {
                    text: "Work in County",
                    ordinal: 2,
                    exclusive: true,
                  },
                ],
                optOutText: "No preference",
              },
            },
          ]}
          applicationSection={MultiselectQuestionsApplicationSectionEnum.preferences}
        />
      </FormProviderWrapper>
    )

    expect(
      screen.getByRole("heading", { level: 2, name: /test section title/i })
    ).toBeInTheDocument()

    expect(screen.getByText(/Live\/Work in County/i)).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: /live in county/i })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: /work in county/i })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: /no preference/i })).toBeInTheDocument()

    expect(screen.queryByLabelText(/full name of address holder/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/relationship to address holder/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/street address/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/apt or unit #/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/city/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/state/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/zip code/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/map preview/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/map pin position/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/automatic/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/Map pin position is based on the address provided/i)
    ).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/custom/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/Drag the pin to update the marker location/i)
    ).not.toBeInTheDocument()
  })

  it("should render the additional address holder name field when option is checked", async () => {
    render(
      <FormProviderWrapper>
        <FormMultiselectQuestions
          sectionTitle="Test Section Title"
          questions={[
            {
              multiselectQuestions: {
                ...multiselectQuestionPreference,
                options: [
                  {
                    text: "Live in County",
                    ordinal: 1,
                    collectName: true,
                  },
                ],
                optOutText: "",
              },
            },
          ]}
          applicationSection={MultiselectQuestionsApplicationSectionEnum.preferences}
        />
      </FormProviderWrapper>
    )
    expect(
      screen.getByRole("heading", { level: 2, name: /test section title/i })
    ).toBeInTheDocument()

    const checkbox = screen.getByRole("checkbox", { name: /live in county/i })
    expect(checkbox).toBeInTheDocument()

    expect(screen.queryByLabelText(/full name of address holder/i)).not.toBeInTheDocument()
    await userEvent.click(checkbox)
    expect(await screen.findByText(/full name of address holder/i)).toBeInTheDocument()
  })

  it("should render the additional address holder relationship field when option is checked", async () => {
    render(
      <FormProviderWrapper>
        <FormMultiselectQuestions
          sectionTitle="Test Section Title"
          questions={[
            {
              multiselectQuestions: {
                ...multiselectQuestionPreference,
                options: [
                  {
                    text: "Live in County",
                    ordinal: 1,
                    collectRelationship: true,
                  },
                ],
                optOutText: "",
              },
            },
          ]}
          applicationSection={MultiselectQuestionsApplicationSectionEnum.preferences}
        />
      </FormProviderWrapper>
    )
    expect(
      screen.getByRole("heading", { level: 2, name: /test section title/i })
    ).toBeInTheDocument()

    const checkbox = screen.getByRole("checkbox", { name: /live in county/i })
    expect(checkbox).toBeInTheDocument()

    expect(screen.queryByLabelText(/relationship to address holder/i)).not.toBeInTheDocument()
    await userEvent.click(checkbox)
    expect(await screen.findByText(/relationship to address holder/i)).toBeInTheDocument()
  })

  it("should render the qualifying address field when option is checked", async () => {
    render(
      <FormProviderWrapper>
        <FormMultiselectQuestions
          sectionTitle="Test Section Title"
          questions={[
            {
              multiselectQuestions: {
                ...multiselectQuestionPreference,
                options: [
                  {
                    text: "Live in County",
                    ordinal: 1,
                    collectAddress: true,
                  },
                ],
                optOutText: "",
              },
            },
          ]}
          applicationSection={MultiselectQuestionsApplicationSectionEnum.preferences}
        />
      </FormProviderWrapper>
    )
    expect(
      screen.getByRole("heading", { level: 2, name: /test section title/i })
    ).toBeInTheDocument()

    const checkbox = screen.getByRole("checkbox", { name: /live in county/i })
    expect(checkbox).toBeInTheDocument()

    expect(screen.queryByText(/qualifying address/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/street address/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/apt or unit #/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/city/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/state/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/zip code/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/map preview/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/map pin position/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/automatic/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/Map pin position is based on the address provided/i)
    ).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/custom/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/Drag the pin to update the marker location/i)
    ).not.toBeInTheDocument()

    await userEvent.click(checkbox)

    expect(screen.getByText(/qualifying address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/apt or unit #/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument()
    expect(screen.getByText(/map preview/i)).toBeInTheDocument()
    expect(screen.getByText(/^map pin position$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/automatic/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Map pin position is based on the address provided/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/custom/i)).toBeInTheDocument()
    expect(screen.getByText(/Drag the pin to update the marker location/i)).toBeInTheDocument()
  })
})
