import { Component } from "react"
import axios from "axios"

import { HousingCounselor as Counselor } from "@bloom-housing/backend-core/types"
import { HousingCounselor, PageHeader, t } from "@bloom-housing/ui-components"

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
        <PageHeader
          inverse={true}
          title={t("pageTitle.housingCounselors")}
          subtitle={t("housingCounselors.subtitle")}
        />
        <section>
          {this.props.counselors &&
            this.props.counselors.map((c) => {
              return (
                <article
                  key={c.name}
                  data-counselor={c.name}
                  className="flex-row flex-wrap max-w-5xl m-auto py-8 border-b-2"
                >
                  <HousingCounselor counselor={c} />
                </article>
              )
            })}
          {this.props.counselors != undefined && this.props.counselors.length === 0 && (
            <article className="flex-row flex-wrap max-w-5xl m-auto py-8 border-b-2">
              <p>{t("t.noneFound")}</p>
            </article>
          )}
        </section>
      </Layout>
    )
  }
}
