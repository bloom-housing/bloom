import Head from "next/head"
import axios from "axios"

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
}) {
  let response

  try {
    response = await axios.get(`${process.env.backendApiBase}/listings/${context.params.id}`, {
      headers: { language: context.locale },
    })
  } catch (e) {
    return { notFound: true }
  }

  return { props: { to: `/listing/${context.params.id}/${response.data.urlSlug}` } }
}
