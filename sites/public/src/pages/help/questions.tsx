import React from "react"
import FrequentlyAskedQuestionsSeeds from "../../components/content-pages/QuestionsSeeds"
import FrequentlyAskedQuestionsDeprecated from "../../components/content-pages/QuestionsDeprecated"

const FrequentlyAskedQuestions = () =>
  process.env.showNewSeedsDesigns ? (
    <FrequentlyAskedQuestionsSeeds />
  ) : (
    <FrequentlyAskedQuestionsDeprecated />
  )

export default FrequentlyAskedQuestions
