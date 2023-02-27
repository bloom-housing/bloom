import { NextPage } from "next"
import Head from "next/head"

interface RedirectProps {
  to: string
}

const Redirect: NextPage<RedirectProps> = ({ to }) => (
  <Head>
    <meta httpEquiv="refresh" content={`0; url=${to}`} />
  </Head>
)

/* eslint-disable @typescript-eslint/unbound-method */
Redirect.getInitialProps = ({ query: { to } }) => Promise.resolve({ to: to as string })

export default Redirect
