import Layout from "../layouts/application"
import PageHeader from "@bloom/ui-components/src/headers/page_header/page_header"
import HousingCounselor from "@bloom/ui-components/src/page_components/housing_counselor"
import { HousingCounselor as Counselor } from "@bloom/ui-components/src/types"

const testCounselor: Counselor = {
  name: "Test Counselor",
  languages: ["English", "Spanish"],
  website: "https://google.com",
  address: "123 Main St",
  phone: "123-456-7890",
  citystate: "San Francisco, CA 94703"
}

export default () => {
  return (
    <Layout>
      <PageHeader
        inverse={true}
        subtitle="Talk with a local housing counselor specific to your needs."
      >
        {"Housing Counselor Resources"}
      </PageHeader>
      <HousingCounselor counselor={testCounselor} />
    </Layout>
  )
}
