import Layout from "../layouts/application"
import { MarkdownSection, PageHeader } from "@bloom-housing/ui-components"
import PageContent from "../page_content/welcome-vi.mdx"

export default () => {
  const pageTitle = <>Chào Mừng Quý-Vị Vào Cổng Mạng Thông Tin Nhà Ở San José</>

  return (
    <Layout>
      <PageHeader inverse={true}>{pageTitle}</PageHeader>
      <MarkdownSection>
        <PageContent />
      </MarkdownSection>
    </Layout>
  )
}
