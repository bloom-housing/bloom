import Layout from "../layouts/application"
import PageHeader from "@dahlia/ui-components/src/headers/page_header/page_header"
import MarkdownSection from "@dahlia/ui-components/src/sections/markdown_section"
import PageContent from "../page_content/privacy_policy.mdx"

export default props => {
  const pageTitle = (
    <>
      Privacy Policy
    </>
  )

  return (
    <Layout>
      <PageHeader inverse={true}>{pageTitle}</PageHeader>
      <MarkdownSection>
        <PageContent />
      </MarkdownSection>
    </Layout>
  )
}
