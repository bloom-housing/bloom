import { PageHeader, MarkdownSection, t } from "@bloom-housing/ui-components"
import Markdown from "markdown-to-jsx"
import Layout from "../layouts/application"
import pageContent from "../page_content/disclaimer.md"

const Disclaimer = () => {
  const pageTitle = <>{t("pageTitle.disclaimer")}</>

  return (
    <Layout>
      <PageHeader inverse={true} title={pageTitle} />
      <MarkdownSection>
        <Markdown>{pageContent}</Markdown>
      </MarkdownSection>
    </Layout>
  )
}

export default Disclaimer
