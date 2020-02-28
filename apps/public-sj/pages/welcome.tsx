import Layout from "../layouts/application"
import PageHeader from "@bloom-housing/ui-components/src/headers/page_header/page_header"
import MarkdownSection from "@bloom-housing/ui-components/src/sections/markdown_section"
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
