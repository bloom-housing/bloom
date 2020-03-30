import Layout from "../layouts/application"
import { MarkdownSection, PageHeader } from "@bloom-housing/ui-components"
import PageContent from "../page_content/welcome-es.mdx"

export default () => {
  const pageTitle = <>Bienvenido al sitio web Portal de la Vivienda de San José</>

  return (
    <Layout>
      <PageHeader inverse={true}>{pageTitle}</PageHeader>
      <MarkdownSection>
        <PageContent />
      </MarkdownSection>
    </Layout>
  )
}
