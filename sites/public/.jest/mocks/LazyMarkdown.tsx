import React from "react"

/**
 * Jest mock for LazyMarkdown so next/dynamic doesn't delay rendering.
 * Renders children as text so tests can find content with getByText.
 * Strips HTML tags so raw "<" does not appear in the DOM (matches test expectations).
 */
export default function LazyMarkdown(props: { children?: React.ReactNode; [key: string]: unknown }) {
  const content = props.children
  const text =
    typeof content === "string" ? content.replace(/<[^>]*>/g, "") : content
  return <span data-testid="lazy-markdown">{text}</span>
}
