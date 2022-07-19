import React from "react"
import Markdown from "markdown-to-jsx"
import { MarkdownSection, t, PageHeader, Icon } from "@bloom-housing/ui-components"
import Layout from "../layouts/application"
import RenderIf from "../src/RenderIf"
import sidebarContent from "../page_content/resources/sidebar.md"

export default function HousingBasics() {
  return (
    <Layout>
      <PageHeader
        title={t("pageTitle.housingBasics")}
        subtitle={t("pageDescription.housingBasics")}
        inverse
      />
      <section className="md:px-5 mt-8">
        <article className="markdown max-w-5xl m-auto md:flex">
          <div className="pt-4 md:w-8/12 md:py-0 serif-paragraphs">
            <div className="md:me-8"></div>
          </div>
          <aside className="pt-4 pb-10 md:w-4/12 md:pl-4 md:py-0 md:border-s">
            <MarkdownSection>
              <Markdown
                options={{
                  overrides: {
                    h4: {
                      component: ({ children, ...props }) => (
                        <h4 {...props} className="text-caps-underline">
                          {children}
                        </h4>
                      ),
                    },
                    RenderIf,
                  },
                }}
              >
                {sidebarContent}
              </Markdown>
            </MarkdownSection>
          </aside>
        </article>
      </section>
    </Layout>
  )
}
