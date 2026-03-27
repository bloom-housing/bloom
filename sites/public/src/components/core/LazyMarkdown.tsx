import React from "react"
import dynamic from "next/dynamic"

const Markdown = dynamic(() => import("markdown-to-jsx"), {
  // Keep SSR so content is still rendered on the server for SEO
  ssr: true,
})

type LazyMarkdownProps = {
  children: string
  [key: string]: unknown
}

const LazyMarkdown = ({ children, ...props }: LazyMarkdownProps) => {
  return <Markdown {...props}>{children}</Markdown>
}

export default LazyMarkdown
