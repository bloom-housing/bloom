import React, { useEffect, useContext, useState } from "react"
import Head from "next/head"
import Markdown from "markdown-to-jsx"
import Layout from "../layouts/application"
import { t, PageHeader, MarkdownSection } from "@bloom-housing/ui-components"
import { Icon } from "@bloom-housing/ui-seeds"
import { UserStatus } from "../lib/constants"
import { AuthContext, PageView, pushGtmEvent, CustomIconMap } from "@bloom-housing/shared-helpers"
import RenderIf from "../RenderIf"

const getGetAssistanceSection = async (jurisdiction: string) => {
  return import(
    `../page_content/jurisdiction_overrides/${jurisdiction
      .toLowerCase()
      .replace(" ", "_")}/get_assistance.md`
  )
}

const getSidebarSection = async (jurisdiction: string) => {
  return import(
    `../page_content/jurisdiction_overrides/${jurisdiction
      .toLowerCase()
      .replace(" ", "_")}/resources/sidebar.md`
  )
}

const ContentIcon = (props: { name: string; outlined?: boolean }) => (
  <Icon size="2xl" className="mb-2" outlined={props.outlined}>
    {CustomIconMap[props.name]}
  </Icon>
)

const GetAssistance = () => {
  const pageTitle = t("pageTitle.getAssistance")
  const subTitle = t("pageDescription.getAssistance")

  const { profile } = useContext(AuthContext)
  const [getAssistanceSection, setGetAssistanceSection] = useState("")
  const [sidebarSection, setSidebarSection] = useState("")

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Get Assistance",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  useEffect(() => {
    const loadPageContent = async () => {
      const getAssistance = await getGetAssistanceSection(process.env.jurisdictionName || "")
      setGetAssistanceSection(getAssistance.default)
      const sideBarSection = await getSidebarSection(process.env.jurisdictionName || "")
      setSidebarSection(sideBarSection.default)
    }
    loadPageContent().catch(() => {
      console.log("get assistance section doesn't exist")
    })
  }, [])

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
          <div className="pt-4 md:w-8/12 md:py-0 md:pb-12">
            <MarkdownSection>
              <Markdown
                options={{
                  overrides: {
                    h2: {
                      component: ({ children, ...props }) => (
                        <h2 {...props} className="font-alt-sans font-semibold text-black mb-3 mt-4">
                          {children}
                        </h2>
                      ),
                    },
                    a: {
                      component: ({ children, ...props }) => (
                        <a {...props} className="underline">
                          {children}
                        </a>
                      ),
                    },
                    hr: {
                      component: ({ ...props }) => <hr {...props} className="border-t-0" />,
                    },
                    ContentIcon,
                    RenderIf,
                  },
                }}
              >
                {getAssistanceSection}
              </Markdown>
            </MarkdownSection>
          </div>
          <aside className="pt-4 pb-10 md:w-4/12 md:pl-4 md:py-0 md:shadow-left">
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
                {sidebarSection}
              </Markdown>
            </MarkdownSection>
          </aside>
        </article>
      </section>
    </Layout>
  )
}

export default GetAssistance
