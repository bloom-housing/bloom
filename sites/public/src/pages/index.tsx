import React, { useContext, useEffect, useState } from "react"
import Head from "next/head"
import { t, ActionBlock, Icon } from "@bloom-housing/ui-components"
import { Button, Heading } from "@bloom-housing/ui-seeds"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../lib/constants"
import Layout from "../layouts/application"
import { ConfirmationModal } from "../components/account/ConfirmationModal"
import { MetaTags } from "../components/shared/MetaTags"
import { fetchJurisdictionByName } from "../lib/hooks"
import { Jurisdiction } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import PageHero from "../components/page/Hero"

interface IndexProps {
  jurisdiction: Jurisdiction
}

export default function Home(props: IndexProps) {
  const blankAlertInfo = {
    alertMessage: null,
    alertType: null,
  }
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Housing Portal",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

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
              icon={<Icon size="3xl" symbol="mailThin" />}
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
            icon={<Icon size="3xl" symbol="building" />}
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
      <ConfirmationModal />
    </Layout>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStaticProps(context: { req: any }) {
  const jurisdiction = await fetchJurisdictionByName(context.req)

  return {
    props: { jurisdiction },
  }
}
