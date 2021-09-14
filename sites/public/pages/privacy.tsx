import { MarkdownSection, PageHeader, t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import Layout from "../layouts/application"
import pageContent from "../page_content/privacy_policy.md"

const Privacy = () => {
  const pageTitle = <>{t("pageTitle.privacy")}</>

  return (
    <Layout>
      <PageHeader title={pageTitle} inverse />
      <MarkdownSection>
        <Markdown>{pageContent}</Markdown>
      </MarkdownSection>
    </Layout>
  )
}

export default Privacy
