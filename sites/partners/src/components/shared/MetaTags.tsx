import * as React from "react"
import Head from "next/head"

export interface MetaTagsProps {
  title: string
  image?: string
  description: string
}

const MetaTags = (props: MetaTagsProps) => {
  return (
    <Head>
      <meta name="description" content={props.description} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={props.title} />
      {props.image && <meta property="og:image" content={props.image} />}
      <meta property="og:description" content={props.description} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={props.title} />
      {props.image && <meta property="twitter:image" content={props.image} />}
      <meta property="twitter:description" content={props.description} />
    </Head>
  )
}

export { MetaTags as default, MetaTags }
