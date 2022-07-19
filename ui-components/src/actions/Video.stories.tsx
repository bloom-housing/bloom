import * as React from "react"
import { Video } from "./Video"

export default {
  title: "Actions/Video 🚩",
  id: "actions/video",
  decorators: [(storyFn: any) => <div style={{ maxWidth: "700px" }}>{storyFn()}</div>],
}
export const videoWithoutCC = () => (
  <Video videoId="dw5s6rF7kxU" label="Bloom Housing Presentation" />
)

export const videoWithEnglishCC = () => (
  <Video videoId="1Jrk9irbNAE" label="Web Accessibility Information" />
)

export const videoWithTranslatedCC = () => (
  <Video videoId="WvnBAQFsmu0" label="Spanish Words to Know" ccLang="pt" />
)

const disableTestParameters = {
  a11y: {
    config: {
      rules: [
        {
          id: "landmark-one-main",
          enabled: false,
        },
        {
          id: "page-has-heading-one",
          enabled: false,
        },
        {
          id: "region",
          enabled: false,
        },
      ],
    },
  },
}

videoWithoutCC.parameters = disableTestParameters
videoWithEnglishCC.parameters = disableTestParameters
videoWithTranslatedCC.parameters = disableTestParameters
