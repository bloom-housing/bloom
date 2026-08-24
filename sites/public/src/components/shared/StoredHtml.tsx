import React from "react"

export const StoredHtml = ({ html }: { html: string }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
)
