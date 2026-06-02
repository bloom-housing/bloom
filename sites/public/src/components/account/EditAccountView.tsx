import { AuthContext } from "@bloom-housing/shared-helpers"
import { useContext } from "react"
import { Agency } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { EditAdvocateAccount } from "./EditAdvocateAccount"
import { EditPublicAccount } from "./EditPublicAccount"
import styles from "./EditAccountView.module.scss"

type EditAccountViewProps = {
  agencies: Agency[]
  tabbedView?: boolean
}

export const EditAccountView = (props: EditAccountViewProps) => {
  const { profile } = useContext(AuthContext)

  return (
    <section>
      <div className={styles[`form-section-container${props.tabbedView ? "-tabbed" : ""}`]}>
        {profile?.isAdvocate ? (
          <EditAdvocateAccount agencies={props.agencies} />
        ) : (
          <EditPublicAccount />
        )}
      </div>
    </section>
  )
}
