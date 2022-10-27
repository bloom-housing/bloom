import * as React from "react"

import { ExpandableText } from "./ExpandableText"

export default {
  title: "Actions/Expandable Text",
}

const longText =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been \
  the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley \
  of type and scrambled it to make a type specimen book. It has survived not only five centuries, \
  but also the leap into electronic typesetting, remaining essentially unchanged. It was \
  popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, \
  and more recently with desktop publishing software like Aldus PageMaker including versions of \
  Lorem Ipsum."

export const standard = () => (
  <ExpandableText buttonClassName="ml-4" strings={{ readMore: "More", readLess: "Less" }}>
    {longText}
  </ExpandableText>
)
export const expanded = () => (
  <ExpandableText
    buttonClassName="ml-4"
    strings={{ readMore: "More", readLess: "Less" }}
    expand={true}
  >
    {longText}
  </ExpandableText>
)
export const noExpansion = () => (
  <ExpandableText buttonClassName="ml-4" strings={{ readMore: "More", readLess: "Less" }}>
    Short text
  </ExpandableText>
)
export const html = () => (
  <ExpandableText
    buttonClassName="ml-4"
    strings={{ readMore: "More", readLess: "Less" }}
  >{`Go to <a href="http://www.google.com" target="_blank">Google</a>. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been \
  the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley \
  of type and scrambled it to make a type specimen book. It has survived not only five centuries`}</ExpandableText>
)
export const disableRawHtml = () => (
  <ExpandableText
    buttonClassName="ml-4"
    strings={{ readMore: "More", readLess: "Less" }}
    markdownProps={{ disableParsingRawHTML: true }}
  >{`Go to <a href="http://www.google.com" target="_blank">Google</a>. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been \
  the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley \
  of type and scrambled it to make a type specimen book. It has survived not only five centuries`}</ExpandableText>
)

export const buttonClassName = () => (
  <ExpandableText
    strings={{ readMore: "More", readLess: "Less" }}
    markdownProps={{ disableParsingRawHTML: true }}
    buttonClassName="ml-1 font-bold"
  >
    {
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been \
  the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley \
  of type and scrambled it to make a type specimen book. It has survived not only five centuries, \
  but also the leap into electronic typesetting, remaining essentially unchanged. It was \
  popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, \
  and more recently with desktop publishing software like Aldus PageMaker including versions of \
  Lorem Ipsum."
    }
  </ExpandableText>
)
