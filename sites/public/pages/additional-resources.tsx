import Head from "next/head"
import Layout from "../layouts/application"
import { t, PageHeader, MarkdownSection } from "@bloom-housing/ui-components"
import PageContent from "../page_content/AdditionalResources.mdx"
import SidebarContent from "../page_content/AdditionalResourcesSidebar.mdx"
import { MDXProvider } from "@mdx-js/react"

const AdditionalResources = () => {
  const pageTitle = t("pageTitle.additionalResources")
  const subTitle = t("pageDescription.additionalResources")

  const components = {
    h4: (props) => <h4 className="text-caps-underline" {...props} />,
    wrapper: (props) => <>{props.children}</>,
  }

  return (
    <Layout>
      <Head>
        <title>
          {pageTitle} - {t("nav.siteTitle")}
        </title>
      </Head>

      <PageHeader title={<>{pageTitle}</>} subtitle={subTitle} inverse={true}></PageHeader>

      <section className="md:px-5">
        <article className="markdown max-w-5xl m-auto md:flex">
          <div className="pt-4 md:w-8/12 md:py-0 serif-paragraphs">
            <MarkdownSection>
              <PageContent />
            </MarkdownSection>
          </div>
          <aside className="pt-4 pb-10 md:w-4/12 md:pl-4 md:py-0 md:shadow-left">
            <MDXProvider components={components}>
              <MarkdownSection>
                <SidebarContent />
              </MarkdownSection>
            </MDXProvider>
          </aside>
        </article>
      </section>
    </Layout>
  )
}

export default AdditionalResources
