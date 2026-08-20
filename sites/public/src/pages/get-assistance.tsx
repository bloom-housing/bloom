import { useContext, useEffect } from "react"
import { AuthContext, PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"
import { Jurisdiction } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { UserStatus } from "../lib/constants"
import Assistance from "../components/assistance/Assistance"
import {
  fetchJurisdictionByName,
  fetchJurisdictionContent,
  fetchPublicOverrides,
} from "../lib/hooks"

const GetAssistance = ({ jurisdiction }: { jurisdiction: Jurisdiction }) => {
  const { profile } = useContext(AuthContext)

  useEffect(() => {
    pushGtmEvent<PageView>({
      event: "pageView",
      pageTitle: "Get Assistance",
      status: profile ? UserStatus.LoggedIn : UserStatus.NotLoggedIn,
    })
  }, [profile])

  return <Assistance jurisdiction={jurisdiction} />
}

export default GetAssistance

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStaticProps({ locale }: { locale?: string }) {
  const [jurisdiction, publicOverrides, jurisdictionContent] = await Promise.all([
    fetchJurisdictionByName(),
    fetchPublicOverrides(locale),
    fetchJurisdictionContent(locale),
  ])

  return {
    props: { jurisdiction, publicOverrides, jurisdictionContent },
    revalidate: Number(process.env.cacheRevalidate),
  }
}
