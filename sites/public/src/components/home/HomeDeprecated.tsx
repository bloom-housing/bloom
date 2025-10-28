import React, { useContext, useEffect } from "react"
import { t, ActionBlock } from "@bloom-housing/ui-components"
import { Button, Heading, Icon } from "@bloom-housing/ui-seeds"
import { PageView, pushGtmEvent, AuthContext, CustomIconMap } from "@bloom-housing/shared-helpers"
import { Jurisdiction } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { ConfirmationModal } from "../../components/account/ConfirmationModal"

import PageHero from "../page/HeroDeprecated"

interface HomeDeprecatedProps {
  jurisdiction: Jurisdiction
}

export const HomeDeprecated = (props: HomeDeprecatedProps) => {
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
    <Layout metaImage={metaImage} metaDescription={metaDescription}>
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
      <ConfirmationModal />
    </Layout>
  )
}
