import Layout from "../layouts/application"
import { MarkdownSection, PageHeader } from "@bloom-housing/ui-components"
import PageContent from "../page_content/welcome.mdx"

export default () => {
  const pageTitle = <>Welcome to the San José Housing Portal</>

  return (
    <Layout>
      <PageHeader inverse={true}>{pageTitle}</PageHeader>
      <MarkdownSection>
        <PageContent />
      </MarkdownSection>
    </Layout>
  )
}
