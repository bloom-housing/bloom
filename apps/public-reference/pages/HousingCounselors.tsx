import { Component } from "react"
import axios from "axios"

import { HousingCounselor as Counselor } from "@bloom-housing/core/src/HousingCounselors"
import HousingCounselor from "@bloom-housing/ui-components/src/page_components/HousingCounselor"
import PageHeader from "@bloom-housing/ui-components/src/headers/page_header/page_header"
import t from "@bloom-housing/ui-components/src/helpers/translator"

import Layout from "../layouts/application"

interface HousingCounselorsProps {
  counselors: Counselor[]
}

export default class extends Component<HousingCounselorsProps> {
  public static async getInitialProps() {
    let counselors: Counselor[] = []

    if (process.env.housingCounselorServiceUrl) {
      try {
        const response = await axios.get(process.env.housingCounselorServiceUrl)
        counselors = response.data.locations
      } catch (error) {
        console.log("Error loading housing counselors: ", error)
      }
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
