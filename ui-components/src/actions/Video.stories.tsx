import * as React from "react"
import { Video } from "./Video"

export default {
  title: "Actions/Video 🚩",
  id: "actions/video",
  decorators: [(storyFn: any) => <div style={{ maxWidth: "700px" }}>{storyFn()}</div>],
}
export const videoWithoutCC = () => (
  <Video url="https://www.youtube.com/embed/dw5s6rF7kxU" label="Bloom Housing Presentation" />
)

export const videoWithEnglishCC = () => (
  <Video url="https://www.youtube.com/embed/1Jrk9irbNAE" label="Web Accessibility Information" />
)

export const videoWithTranslatedCC = () => (
  <Video
    url="https://www.youtube.com/embed/WvnBAQFsmu0"
    label="Spanish Words to Know"
    ccLang="pt"
  />
)
