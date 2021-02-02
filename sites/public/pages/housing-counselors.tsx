import { Component } from "react"
import axios from "axios"

import { HousingCounselor } from "@bloom-housing/backend-core/types"
import {
  HousingCounselor as HousingCounselorComponent,
  PageHeader,
  t,
} from "@bloom-housing/ui-components"

import Layout from "../layouts/application"

interface HousingCounselorsProps {
  counselors: HousingCounselor[]
}

export default class extends Component<HousingCounselorsProps> {
  public static async getInitialProps() {
    let counselors: HousingCounselor[] = []

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
        {this.props.counselors.map((c) => {
          return (
            <article key={c.name} className="flex-row flex-wrap max-w-5xl m-auto py-8 border-b-2">
              <HousingCounselorComponent counselor={c} />
            </article>
          )
        })}
      </Layout>
    )
  }
}
