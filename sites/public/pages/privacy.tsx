import { MarkdownSection, PageHeader, t } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import PageContent from "../page_content/privacy_policy.mdx"

export default () => {
  const pageTitle = <>{t("pageTitle.privacy")}</>

  return (
    <Layout>
      <PageHeader title={pageTitle} inverse />
      <MarkdownSection>
        <PageContent />
      </MarkdownSection>
    </Layout>
  )
}
