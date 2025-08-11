import React, { useEffect, useContext } from "react"
import { t } from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext } from "@bloom-housing/shared-helpers"
import { UserStatus } from "../../lib/constants"
import Layout from "../../layouts/application"
import { questionsLinkableCards } from "../../tsx_content/questions-cards"
import { MetaTags } from "../../components/shared/MetaTags"
import { DoorwayLinkableCardGroup } from "../../components/shared/DoorwayLinkableCardGroup"
import { PageHeaderLayout } from "../../patterns/PageHeaderLayout"

const FrequentlyAskedQuestionsSeeds = () => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "FrequentlyAskedQuestions",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  const metaDescription = t("pageDescription.questions")

  return (
    <Layout>
      <PageHeaderLayout heading={t("pageTitle.questions")}>
        <MetaTags title={t("pageTitle.questions")} description={metaDescription} />
        <DoorwayLinkableCardGroup
          cards={questionsLinkableCards()}
          className="m-auto"
        ></DoorwayLinkableCardGroup>
      </PageHeaderLayout>
    </Layout>
  )
}

export default FrequentlyAskedQuestionsSeeds
