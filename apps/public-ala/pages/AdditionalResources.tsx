import Head from "next/head"
import Layout from "../layouts/application"
import { t, PageHeader, MarkdownSection } from "@bloom-housing/ui-components"
import PageContent from "../page_content/AdditionalResources.mdx"
import SidebarContent from "../page_content/AdditionalResourcesSidebar.mdx"

const AdditionalResources = () => {
  const pageTitle = t("pageTitle.additionalResources")
  const subTitle = t("pageDescription.additionalResources")

  const LinedH4 = (props) => <h4 className="text-caps-underline" {...props} />
  const serifEm = (props) => <span className="font-serif" {...props} />

  const components = {
    h4: LinedH4,
    em: serifEm,
  }

  return (
    <Layout>
      <Head>
        <title>
          {pageTitle} - {t("nav.siteTitle")}
        </title>
      </Head>

      <PageHeader subtitle={subTitle} inverse={true}>
        <>{pageTitle}</>
      </PageHeader>

      <section className="px-5">
        <article className="markdown max-w-5xl m-auto md:flex">
          <div className="md:w-8/12 md:pr-10 pt-10 md:py-10 serif-paragraphs">
            <MarkdownSection>
              <PageContent />
            </MarkdownSection>
          </div>
          <div className="md:border-l-4 border-gray-400 md:w-4/12 md:pl-10 py-10">
            <MarkdownSection>
              <SidebarContent />
            </MarkdownSection>
          </div>
        </article>
      </section>
    </Layout>
  )
}

export default AdditionalResources
