import * as React from "react"
import "./ContentSection.scss"

export interface ContentSectionProps {
  title?: string
  subtitle?: string
  icon?: string
  children: JSX.Element
}

const ContentSection = (props: ContentSectionProps) => (
  <section className="content-section">
    {props.title && (
      <header className="content-section__header">
        <hgroup>
          <h3 className="content-section__title">{props.title}</h3>
          <span className="content-section__subtitle">{props.subtitle}</span>
        </hgroup>
      </header>
    )}

    {props.children}
  </section>
)

export { ContentSection as default, ContentSection }
