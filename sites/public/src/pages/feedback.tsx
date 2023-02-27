import { t } from "@bloom-housing/ui-components"
import { PageHeader } from "../../../../detroit-ui-components/src/headers/PageHeader"
import Layout from "../layouts/application"

const Feedback = () => {
  const pageTitle = <>{t("pageTitle.feedback")}</>

  return (
    <Layout>
      <PageHeader title={pageTitle} inverse />
      <div className="w-full">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSe8Npioi4fChtWbTZUsfE23lEoeFXVn9vlCAHA9lMGWsQUAGA/viewform?embedded=true"
          width="100%"
          height="1400"
        >
          Loading…
        </iframe>
      </div>
    </Layout>
  )
}

export default Feedback
