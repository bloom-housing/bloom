import React from "react"
import styles from "./StoredHtml.module.scss"

export const StoredHtml = ({ html }: { html: string }) => (
  <div className={styles["stored-html"]} dangerouslySetInnerHTML={{ __html: html }} />
)
