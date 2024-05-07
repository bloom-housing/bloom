import Head from "next/head"
import axios from "axios"

export default function ListingRedirect(props: Record<string, string>) {
  return (
    <Head>
      <meta httpEquiv="refresh" content={`0; url=${props.to}`} />
    </Head>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { params: Record<string, string>; req: any }) {
  let response

  try {
    response = await axios.get(`${process.env.backendApiBase}/listings/${context.params.id}`, {
      headers: {
        passkey: process.env.API_PASS_KEY,
        "x-forwarded-for":
          context.req.headers["x-forwarded-for"] ?? context.req.socket.remoteAddress,
      },
    })
  } catch (e) {
    return { notFound: true }
  }

  return { props: { to: `/listing/${context.params.id}/${response.data.urlSlug}` } }
}
