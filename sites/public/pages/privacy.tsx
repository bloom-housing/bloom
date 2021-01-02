import { MarkdownSection, PageHeader, t } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import PageContent from "../page_content/privacy_policy.mdx"

export default () => {
  const pageTitle = <>{t("pageTitle.privacy")}</>

  return (
    <Layout>
      <PageHeader inverse={true}>{pageTitle}</PageHeader>
      <MarkdownSection>
        <PageContent />
      </MarkdownSection>
    </Layout>
  )
}
