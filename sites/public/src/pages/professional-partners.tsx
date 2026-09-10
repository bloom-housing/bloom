import { AuthContext, PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import { useContext, useEffect } from "react"
import pageStyles from "../components/assistance/Assistance.module.scss"
import ContactCard from "../components/shared/ContactCard"
import Layout from "../layouts/application"
import { UserStatus } from "../lib/constants"
import { fetchSharedPageProps } from "../lib/hooks"
import FrequentlyAskedQuestions from "../patterns/FrequentlyAskedQuestions"
import { PageHeaderLayout } from "../patterns/PageHeaderLayout"
import styles from "../patterns/PageHeaderLayout.module.scss"
import {
  getGenericProfessionalPartnersContactContent,
  getGenericProfessionalPartnersContent,
} from "../static_content/generic_professional_partners_content"
import {
  getProfessionalPartnersContactContent,
  getProfessionalPartnersContent,
} from "../static_content/jurisdiction_professional_partners_content"

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
  const contactContent =
    getGenericProfessionalPartnersContactContent() || getProfessionalPartnersContactContent()

  return (
    <Layout
      pageTitle={t("pageTitle.professionalPartners")}
      metaDescription={t("pageDescription.housingBasics")}
    >
      <PageHeaderLayout
        heading={t("pageTitle.professionalPartners")}
        subheading={t("pageDescription.housingBasics")}
        inverse
        className={pageStyles["site-layout"]}
      >
        <article className={pageStyles["site-content"]}>
          <div className={pageStyles["item-wrapper"]}>
            <div className={styles["markdown"]}>
              {/* Using the faq component now as we currently only support content in that format */}
              <FrequentlyAskedQuestions content={content} />
            </div>
          </div>
          {contactContent && (
            <aside className={pageStyles["aside-section"]}>
              <ContactCard
                address={contactContent.address}
                contactDescription={contactContent.contactDescription}
                contactInfo={contactContent.contactInfo}
                email={contactContent.email}
                heading={contactContent.heading}
                hours={contactContent.hours}
                phone={contactContent.phone}
              />
            </aside>
          )}
        </article>
      </PageHeaderLayout>
    </Layout>
  )
}

export default ProfessionalPartners

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStaticProps({ locale }: { locale?: string }) {
  const shared = await fetchSharedPageProps(locale)

  return {
    props: { ...shared },
    revalidate: Number(process.env.cacheRevalidate),
  }
}
