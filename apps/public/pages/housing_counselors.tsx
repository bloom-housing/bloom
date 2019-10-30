import { Component } from "react"
import axios from "axios"

import { HousingCounselor as Counselor } from "@bloom/core/src/housing_counselors"
import HousingCounselor from "@bloom/ui-components/src/page_components/housing_counselor"
import PageHeader from "@bloom/ui-components/src/headers/page_header/page_header"
import t from "@bloom/ui-components/src/helpers/translator"

import Layout from "../layouts/application"

interface HousingCounselorsProps {
  counselors: Counselor[]
}

export default class extends Component<HousingCounselorsProps> {
  public static async getInitialProps() {
    let counselors: Counselor[] = []
    try {
      //TODO: Add endpoint to DAHLIA w/ housing counselors instead of referencing asset.
      const response = await axios.get(
        "https://housing.sfgov.org/assets/housing_counselors-7b0f260dac22dfa20871edd36135b62f1a25a9dad78faf2cf8e8e2514b80cf61.json"
      )
      counselors = response.data.locations
    } catch (error) {
      console.log("Error loading housing counselors: ", error)
    }

    return { counselors }
  }

  public render() {
    return (
      <Layout>
        <PageHeader inverse={true} subtitle={t("housingCounselors.subtitle")}>
          {t("pageTitle.housingCounselors")}
        </PageHeader>
        {this.props.counselors.map(c => {
          return (
            <article key={c.name} className="flex-row flex-wrap max-w-5xl m-auto py-8 border-b-2">
              <HousingCounselor counselor={c} />
            </article>
          )
        })}
      </Layout>
    )
  }
}
