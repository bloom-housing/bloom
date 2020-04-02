import Head from "next/head"
import Layout from "../layouts/application"
import { t, PageHeader, MarkdownSection } from "@bloom-housing/ui-components"
import PageContent from "../page_content/AdditionalResources.mdx"

export default () => {
  const pageTitle = "Additional Housing Opportunities"

  return (
    <Layout>
      <Head>
        <title>
          {pageTitle} - {t("nav.siteTitle")}
        </title>
      </Head>
      <PageHeader inverse={true}>
        <>{pageTitle}</>
      </PageHeader>
      <MarkdownSection>
        <PageContent />
      </MarkdownSection>
    </Layout>
  )
}
