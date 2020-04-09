import Layout from "../layouts/application"
import { PageHeader, MarkdownSection } from "@bloom-housing/ui-components"
import PageContent from "../page_content/privacy_policy.mdx"

export default () => {
  const pageTitle = <>Privacy Policy</>

  return (
    <Layout>
      <PageHeader inverse={true}>{pageTitle}</PageHeader>
      <MarkdownSection>
        <PageContent />
      </MarkdownSection>
    </Layout>
  )
}
