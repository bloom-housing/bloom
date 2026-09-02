import { AuthContext, PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import { useContext, useEffect } from "react"
import pageStyles from "../components/content-pages/FaqPage.module.scss"
import Layout from "../layouts/application"
import { UserStatus } from "../lib/constants"
import FrequentlyAskedQuestions from "../patterns/FrequentlyAskedQuestions"
import { PageHeaderLayout } from "../patterns/PageHeaderLayout"
import styles from "../patterns/PageHeaderLayout.module.scss"
import { getGenericProfessionalPartnersContent } from "../static_content/generic_professional_partners_content"
import { getProfessionalPartnersContent } from "../static_content/jurisdiction_professional_partners_content"

const ProfessionalPartners = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Professional Partners",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const content = getProfessionalPartnersContent() || getGenericProfessionalPartnersContent()

  return (
    <Layout
      pageTitle={t("pageTitle.professionalPartners")}
      metaDescription={t("pageDescription.housingBasics")}
    >
      <PageHeaderLayout
        heading={t("pageTitle.professionalPartners")}
        subheading={t("pageDescription.housingBasics")}
        inverse
        className={pageStyles["faq-page"]}
      >
        <div className={styles["markdown"]}>
          {/* Using the faq component now as we currently only support content in that format */}
          <FrequentlyAskedQuestions content={content} />
        </div>
      </PageHeaderLayout>
    </Layout>
  )
}

export default ProfessionalPartners
