import Layout from "../layouts/application"
import { PageHeader, MarkdownSection } from "@bloom-housing/ui-components"
import PageContent from "../page_content/disclaimer.mdx"

export default () => {
  const pageTitle = <>Endorsement Disclaimers</>

  return (
    <Layout>
      <PageHeader inverse={true}>{pageTitle}</PageHeader>
      <MarkdownSection>
        <PageContent />
      </MarkdownSection>
    </Layout>
  )
}
