import React from "react"
import Markdown from "markdown-to-jsx"
import { MarkdownSection, t } from "@bloom-housing/ui-components"
import { PageHeader } from "../../../../detroit-ui-components/src/headers/PageHeader"
import Layout from "../layouts/application"
import RenderIf from "../RenderIf"
import sidebarContent from "../page_content/resources/sidebar.md"
import ResourceLinkCard from "../ResourceLinkCard"

export default function GetAssistance() {
  return (
    <Layout>
      <PageHeader
        title={t("pageTitle.getAssistance")}
        subtitle={t("pageDescription.getAssistance")}
        inverse
      />
      <section className="my-8">
        <article className="markdown max-w-5xl m-auto md:flex">
          <div className="pt-4 md:w-8/12 md:py-0 serif-paragraphs">
            <div className="md:me-8">
              <ResourceLinkCard
                iconSymbol="questionThin"
                title={t("resources.affordableHousingTitle")}
                subtitle={t("resources.affordableHousingSubtitle")}
                linkLabel={t("resources.affordableHousingLinkLabel")}
                linkUrl="/housing-basics"
              />

              <ResourceLinkCard
                iconSymbol="house"
                title={t("resources.housingResourcesTitle")}
                subtitle={t("resources.housingResourcesSubtitle")}
                linkLabel={t("resources.housingResourcesLinkLabel")}
                linkUrl="/additional-resources"
              />
            </div>
          </div>
          <aside className="pt-4 pb-10 md:w-4/12 md:pl-4 md:py-0 md:border-s">
            <MarkdownSection>
              <Markdown
                options={{
                  overrides: {
                    h3: {
                      component: ({ children, ...props }) => (
                        <h3 {...props} className="text-tiny text-caps-underline">
                          {children}
                        </h3>
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
