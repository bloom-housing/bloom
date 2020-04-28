import React from "react"
import { NextPage } from "next"
import Head from "next/head"

interface RedirectProps {
  to: string
}

const Redirect: NextPage<RedirectProps> = ({ to }) => (
  <Head>
    <meta http-equiv="refresh" content={`0; url=${to}`} />
  </Head>
)

Redirect.getInitialProps = ({ query: { to } }) => Promise.resolve({ to: to as string })

export default Redirect
