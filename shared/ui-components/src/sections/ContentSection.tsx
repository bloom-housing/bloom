import * as React from "react"

export interface ContentSectionProps {
  title?: string
  subtitle?: string
  icon?: string
  children: JSX.Element
}

const ContentSection = (props: ContentSectionProps) => (
  <section className="py-10">
    {props.title && (
      <header className="mb-5">
        <hgroup>
          <h3 className="text-2xl">{props.title}</h3>
          <span className="text-gray-700">{props.subtitle}</span>
        </hgroup>
      </header>
    )}

    {props.children}
  </section>
)

export { ContentSection as default, ContentSection }
