import { t } from "@bloom-housing/ui-components"
import { PageHeader } from "../../../detroit-ui-components/src/headers/PageHeader"
import Layout from "../layouts/application"

const Feedback = () => {
  const pageTitle = <>{t("pageTitle.resources")}</>

  return (
    <Layout>
      <PageHeader title={pageTitle} inverse />
      <div className="px-5 max-w-5xl md:m-auto">
        <p className="mt-8">{t("resources.body1")}</p>
        <div className="mt-8">
          <h2>{t("resources.evictionAssistance")}</h2>
        </div>
        <div className="mt-8">
          <h2>{t("resources.detroitHousingNetwork")}</h2>
          <p>
            {t("resources.detroitHousingNetworkBody")}{" "}
            {/* It isn't ideal to make the url separate from the translated text but polyglot
                doesn't support inserting a tags into a translation */}
            <a href="https://detroithousingnetwork.org">https://detroithousingnetwork.org</a>
          </p>
        </div>
        <div className="mt-8">
          <h2>{t("resources.utilityAssistance")}</h2>
        </div>
        <div className="mt-8">
          <h2>{t("resources.homelessnessServices")}</h2>
        </div>
        <div className="mt-8">
          <h2>{t("resources.detroitLandBankAuthority")}</h2>
        </div>
        <div className="my-8">
          <h2>{t("resources.homeRepairResources")}</h2>
        </div>
      </div>
    </Layout>
  )
}

export default Feedback
