import Head from "next/head"
import Layout from "../layouts/application"
import { t, PageHeader } from "@bloom-housing/ui-components"
import PageContent from "../page_content/AdditionalResources.mdx"
import SidebarContent from "../page_content/AdditionalResourcesSidebar.mdx"

export default () => {
  const pageTitle = t("pageTitle.additionalResources")
  const subTitle = t("pageDescription.additionalResources")

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
          <div className="md:w-8/12 md:pr-10 pt-10 md:py-10">
            <PageContent />
          </div>
          <div className="md:border-l-4 border-gray-400 md:w-4/12 md:pl-10 py-10">
            <SidebarContent />
          </div>
        </article>
      </section>
    </Layout>
  )
}
