import React, { useEffect, useContext, useState } from "react"
import Head from "next/head"
import Markdown from "markdown-to-jsx"
import Layout from "../layouts/application"
import { t, PageHeader, MarkdownSection } from "@bloom-housing/ui-components"
import { UserStatus } from "../lib/constants"
import { AuthContext, PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"
import RenderIf from "../RenderIf"

interface SubSectionProps {
  closedLabel: string
  openLabel: string
  children: React.ReactNode
}

const getPageContent = async (jurisdiction: string) => {
  return import(
    `../page_content/jurisdiction_overrides/${jurisdiction
      .toLowerCase()
      .replace(" ", "_")}/how_it_works.md`
  )
}

const SubSection = (props: SubSectionProps) => {
  const [isExpanded, setExpanded] = useState(false)

  return (
    <div>
      <button
        type="button"
        className="button is-unstyled text-left text-base m-0 has-toggle"
        aria-expanded={isExpanded}
        onClick={() => {
          setExpanded(!isExpanded)
        }}
      >
        {isExpanded ? props.openLabel : props.closedLabel}
      </button>

      {isExpanded && <div className="mt-4 p-6 bg-gray-200">{props.children}</div>}
    </div>
  )
}

const GetAssistance = () => {
  const pageTitle = t("pageTitle.howItWorks")
  const subTitle = t("pageDescription.howItWorks")

  const { profile } = useContext(AuthContext)
  const [pageContent, setPageContent] = useState("")

  useEffect(() => {
    const loadPageContent = async () => {
      const loadedPageContent = await getPageContent(process.env.jurisdictionName || "")
      setPageContent(loadedPageContent.default)
    }
    loadPageContent().catch(() => {
      console.log("how it work section doesn't exist")
    })
  }, [])

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "How it Works",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return (
    <Layout>
      <Head>
        <title>
          {pageTitle} - {t("nav.siteTitle")}
        </title>
      </Head>

      <PageHeader title={<>{pageTitle}</>} subtitle={subTitle} inverse={true}></PageHeader>

      <section className="md:px-5">
        <article className="markdown max-w-5xl m-auto">
          <div className="pt-4 md:py-0 max-w-3xl">
            <MarkdownSection fullwidth>
              <Markdown
                options={{
                  slugify: (str) => str.replace(/ /gi, "-").toLowerCase(),
                  overrides: {
                    h2: {
                      component: ({ children, ...props }) => (
                        <h2 {...props} className="font-alt-sans font-semibold text-black mb-1 mt-0">
                          {children}
                        </h2>
                      ),
                    },
                    h3: {
                      component: ({ children, ...props }) => (
                        <h3 {...props} className="font-alt-sans font-semibold text-black mb-4">
                          {children}
                        </h3>
                      ),
                    },
                    h4: {
                      component: ({ children, ...props }) => (
                        <h4
                          {...props}
                          className="font-alt-sans font-semibold text-lg text-black mb-4 mt-5"
                        >
                          {children}
                        </h4>
                      ),
                    },
                    h5: {
                      component: ({ children, ...props }) => (
                        <h5
                          {...props}
                          className="font-alt-sans font-semibold text-lg text-black mb-1 mt-4"
                        >
                          {children}
                        </h5>
                      ),
                    },
                    a: {
                      component: ({ children, ...props }) => (
                        <a {...props} className="underline">
                          {children}
                        </a>
                      ),
                    },
                    ol: {
                      component: ({ ...props }) => <ol {...props} className="process-list" />,
                    },
                    SubSection,
                    RenderIf,
                  },
                }}
              >
                {pageContent}
              </Markdown>
            </MarkdownSection>
          </div>
        </article>
      </section>
    </Layout>
  )
}

export default GetAssistance
