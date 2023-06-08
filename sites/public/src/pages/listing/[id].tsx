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

export async function getServerSideProps(context: { params: Record<string, string> }) {
  let response

  const listingServiceUrl = runtimeConfig.getListingServiceUrl()

  try {
    response = await axios.get(`${listingServiceUrl}/${context.params.id}`)
  } catch (e) {
    return { notFound: true }
  }

  return { props: { to: `/listing/${context.params.id}/${response.data.urlSlug}` } }
}
