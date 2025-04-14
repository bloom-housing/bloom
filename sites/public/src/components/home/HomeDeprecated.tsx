import React, { useContext, useEffect, useState } from "react"
import Head from "next/head"
import { t, ActionBlock } from "@bloom-housing/ui-components"
import { Button, Heading, Icon } from "@bloom-housing/ui-seeds"
import { PageView, pushGtmEvent, AuthContext, CustomIconMap } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { ConfirmationModal } from "../../components/account/ConfirmationModal"
import { MetaTags } from "../../components/shared/MetaTags"
import { Jurisdiction } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import PageHero from "../../components/page/Hero"
import Markdown from "markdown-to-jsx"
import RenderIf from "../../RenderIf"
import { fetchJurisdictionByName } from "../../lib/hooks"

interface HomeDeprecatedProps {
  jurisdiction: Jurisdiction
}

const getHowItWorks = async (jurisdiction: string) => {
  return import(
    `../../page_content/jurisdiction_overrides/${jurisdiction
      .toLowerCase()
      .replace(" ", "_")}/homepage_how_it_works.md`
  )
}

export const HomeDeprecated = (props: HomeDeprecatedProps) => {
  const { profile } = useContext(AuthContext)
  const [howItWorksContent, setHowItWorksContent] = useState("")

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  useEffect(() => {
    const loadPageContent = async () => {
      const privacy = await getHowItWorks(process.env.jurisdictionName || "")
      setHowItWorksContent(privacy.default)
    }
    loadPageContent().catch(() => {
      console.log("homepage how it work section doesn't exist")
    })
  }, [])

  const heroTitle = (
    <>
      {t("welcome.title")} <em>{t("region.name")}</em>
    </>
  )

  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHero>
        <PageHero.Header>
          <Heading>{heroTitle}</Heading>
        </PageHero.Header>
        <PageHero.Actions>
          <Button href="/listings" variant="primary-outlined">
            {t("welcome.seeRentalListings")}
          </Button>
        </PageHero.Actions>
      </PageHero>
      <div className="homepage-extra">
        <div className="action-blocks mt-4 mb-4 w-full">
          {props.jurisdiction && props.jurisdiction.notificationsSignUpUrl && (
            <ActionBlock
              className="flex-1"
              header={
                <Heading priority={2} size="2xl">
                  {t("welcome.signUp")}
                </Heading>
              }
              icon={
                <Icon size="2xl" outlined>
                  {CustomIconMap.envelope}
                </Icon>
              }
              actions={[
                <Button
                  key={"sign-up"}
                  href={props.jurisdiction.notificationsSignUpUrl}
                  variant="primary-outlined"
                  size="sm"
                  className="m-2"
                >
                  {t("welcome.signUpToday")}
                </Button>,
              ]}
            />
          )}
          <ActionBlock
            className="flex-1"
            header={
              <Heading priority={2} size="2xl">
                {t("welcome.seeMoreOpportunitiesTruncated")}
              </Heading>
            }
            icon={
              <Icon size="2xl" outlined>
                {CustomIconMap.home}
              </Icon>
            }
            actions={[
              <Button
                key={"additional-resources"}
                href="/additional-resources"
                variant="primary-outlined"
                size="sm"
                className="m-2"
              >
                {t("welcome.viewAdditionalHousingTruncated")}
              </Button>,
            ]}
          />
        </div>
      </div>
      <div className="homepage-extra bg-gray-100 px-4 pb-16">
        <ActionBlock
          className="pb-0 -mb-1"
          header={t("welcome.howDoesItWork")}
          icon={<Icon size="2xl">{CustomIconMap.frontDoor}</Icon>}
          actions={[]}
        />

        <p className="text-center">{t("welcome.learnHowToApply")}</p>

        <div className="markdown max-w-7xl">
          <Markdown
            options={{
              overrides: {
                RenderIf,
                ol: {
                  component: ({ ...props }) => (
                    <ol {...props} className="process-list has-horizontal-layout" />
                  ),
                },
                h4: {
                  component: ({ children, ...props }) => (
                    <h4
                      {...props}
                      className="font-alt-sans font-semibold text-base text-black mb-1 mt-0"
                    >
                      {children}
                    </h4>
                  ),
                },
                p: {
                  component: ({ children, ...props }) => (
                    <p {...props} className="text-gray-700 text-sm mt-3 mb-2">
                      {children}
                    </p>
                  ),
                },
              },
            }}
          >
            {howItWorksContent}
          </Markdown>
        </div>

        <Button href="/how-it-works" variant="primary-outlined">
          {t("welcome.readAboutHowItWorks")}
        </Button>
      </div>
      <ConfirmationModal />
    </Layout>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStaticProps() {
  const jurisdiction = await fetchJurisdictionByName()

  return {
    props: { jurisdiction },
  }
}
