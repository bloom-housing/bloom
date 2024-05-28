import Head from "next/head"
import axios from "axios"
import { runtimeConfig } from "../../lib/runtime-config"

export default function ListingRedirect(props: Record<string, string>) {
  return (
    <Head>
      <meta httpEquiv="refresh" content={`0; url=${props.to}`} />
    </Head>
  )
}

export async function getServerSideProps(context: {
  params: Record<string, string>
  locale: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  req: any
}) {
  let response

  const listingServiceUrl = runtimeConfig.getListingServiceUrl()

  try {
    const headers: Record<string, string> = {
      "x-forwarded-for": context.req.headers["x-forwarded-for"] ?? context.req.socket.remoteAddress,
    }

    if (process.env.API_PASS_KEY) {
      headers.passkey = process.env.API_PASS_KEY
    }
    response = await axios.get(`${listingServiceUrl}/${context.params.id}`, {
      headers,
    })
  } catch (e) {
    return { notFound: true }
  }

  const localeString = context.locale === "en" ? "" : `/${context.locale}`

  return {
    props: { to: `${localeString}/listing/${context.params.id}/${response.data.urlSlug}` },
  }
}
