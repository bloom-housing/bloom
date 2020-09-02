import Layout from "../layouts/application"
import Head from "next/head"
import { Hero, LinkButton, MarkdownSection, t } from "@bloom-housing/ui-components"

const ErrorPage = () => {
  const pageTitle = t("error.notFound.title")

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Hero title={pageTitle} buttonTitle={t("welcome.seeRentalListings")} buttonLink="/listings">
        {t("error.notFound.message")}
      </Hero>
      <div className="homepage-extra">
        <MarkdownSection fullwidth={true}>
          <>
            <p>{t("welcome.seeMoreOpportunities")}</p>
            <LinkButton href="/additional-resources">
              {t("welcome.viewAdditionalHousing")}
            </LinkButton>
          </>
        </MarkdownSection>
      </div>
    </Layout>
  )
}

export { ErrorPage as default, ErrorPage }
