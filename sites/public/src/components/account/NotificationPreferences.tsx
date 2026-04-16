import { BloomCard } from "@bloom-housing/shared-helpers"
import styles from "./NotificationPreferences.module.scss"
import { Button, Card } from "@bloom-housing/ui-seeds"
import { useForm } from "react-hook-form"
import { FieldGroup, t } from "@bloom-housing/ui-components"

export const NotificationPreferences = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = useForm()

  return (
    <BloomCard
      iconSymbol="envelope"
      iconClass={"card-icon"}
      headingClass={"seeds-large-heading"}
      title="My notifications"
      subtitle="Choose which notifications you’d like to receive"
      headingPriority={3}
      variant="block"
    >
      <>
        <Card.Section>
          <FieldGroup
            register={register}
            name="Test Input"
            type={"checkbox"}
            fieldGroupClassName={styles["notification-preferences-field-group"]}
            fields={[
              {
                id: "select-all-checkbox",
                label: "Select all",
                note: "Subscribe to all notification types",
              },
              {
                id: "hearing-vision-checkbox",
                label: "Hearing/Vision units",
                note: "Receive notifications for units with hearing/vision accessibility",
              },
              {
                id: "mobility-checkbox",
                label: "Mobility units",
                note: "Receive notifications for new mobility accessible units",
              },
              {
                id: "mobility-hearing-vision-checkbox",
                label: "Mobility and Hearing/Vision units",
                note: "Receive notifications for units with both mobility and hearing/vision accessibility",
              },
              {
                id: "new-lotteries-checkbox",
                label: "New lotteries",
                note: "Receive notifications when new housing lotteries open",
              },
              {
                id: "new-waitlists-checkbox",
                label: "New waitlists",
                note: "Receive notifications when new waitlists become available",
              },
            ]}
          />
        </Card.Section>
        <Card.Footer className={styles["card-footer"]}>
          <Button variant="primary-outlined">{t("t.save")}</Button>
        </Card.Footer>
      </>
    </BloomCard>
  )
}
