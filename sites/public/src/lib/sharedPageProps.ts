import { GetServerSidePropsContext, GetStaticPropsContext } from "next"
import { fetchSharedPageProps } from "./hooks"

// Pages re-export these, so the props shape and the revalidate policy stay in one place.

export async function sharedGetStaticProps({ locale }: GetStaticPropsContext) {
  const shared = await fetchSharedPageProps(locale)

  return {
    props: { ...shared },
    revalidate: Number(process.env.cacheRevalidate),
  }
}

// A page rendered per request forwards the visitor's address, which the API rate-limits on.
export async function sharedGetServerSideProps({ req, locale }: GetServerSidePropsContext) {
  const shared = await fetchSharedPageProps(locale, req)

  return {
    props: { ...shared },
  }
}
