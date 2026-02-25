import React, { useContext } from "react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { EditPublicAccount } from "../../components/account/EditPublicAccount"
import { EditAdvocateAccount } from "../../components/account/EditAdvocateAccount"
import { fetchAgencies, fetchJurisdictionByName } from "../../lib/hooks"
import { Agency } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

interface EditProps {
  agencies: Agency[]
}

const Edit = (props: EditProps) => {
  const { profile } = useContext(AuthContext)
  return profile?.isAdvocate ? (
    <EditAdvocateAccount agencies={props.agencies} />
  ) : (
    <EditPublicAccount />
  )
}

export default Edit

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { req: any; query: any }) {
  const jurisdiction = await fetchJurisdictionByName(context.req)
  const agencies = await fetchAgencies(context.req, jurisdiction?.id)

  return {
    props: { jurisdiction, agencies: agencies.items || [] },
  }
}
