import Layout from "../layouts/application"
import PageHeader from "@bloom/ui-components/src/headers/page_header/page_header"
import HousingCounselor from "@bloom/ui-components/src/page_components/housing_counselor"
import { HousingCounselor as Counselor } from "@bloom/ui-components/src/types"
import { Component } from "react"
import axios from "axios"

interface HousingCounselorsProps {
  counselors: Counselor[]
}

export default class extends Component<HousingCounselorsProps> {
  public static async getInitialProps() {
    console.log("getting initial props")
    let counselors: Counselor[] = []
    try {
      //TODO: Add endpoint to DAHLIA w/ housing counselors instead of referencing asset.
      const response = await axios.get(
        "https://housing.sfgov.org/assets/housing_counselors-7b0f260dac22dfa20871edd36135b62f1a25a9dad78faf2cf8e8e2514b80cf61.json"
      )
      counselors = JSON.parse(response.data).locations
      console.log("test", counselors[0])
    } catch (error) {
      console.log(error)
    }

    return { counselors }
  }

  public render() {
    return (
      <Layout>
        <PageHeader
          inverse={true}
          subtitle="Talk with a local housing counselor specific to your needs."
        >
          {"Housing Counselor Resources"}
        </PageHeader>
        {this.props.counselors.map(c => {
          return (
            <article key={c.name} className="flex-row flex-wrap max-w-5xl m-auto mb-12">
              <HousingCounselor counselor={c} />
            </article>
          )
        })}
      </Layout>
    )
  }
}
