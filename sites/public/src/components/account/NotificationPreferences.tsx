import { BloomCard } from "@bloom-housing/shared-helpers"
import styles from "./NotificationPreferences.module.scss"
import { Button, Card, Icon } from "@bloom-housing/ui-seeds"
import { useForm } from "react-hook-form"
import { FieldGroup, t } from "@bloom-housing/ui-components"
import { useState } from "react"
import PlusIcon from "@heroicons/react/24/solid/PlusIcon"
import MinusIcon from "@heroicons/react/24/solid/MinusIcon"
import { RegionEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export const NotificationPreferences = () => {
  const [collapsed, setCollapsed] = useState(false)

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
            name="preferences-field-group"
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
          <div className={styles["collapsible-field-group"]}>
            <div className={styles["button-header"]}>
              <button
                onClick={() => setCollapsed(!collapsed)}
                aria-label={!collapsed ? t("t.collapseSection") : t("t.expandSection")}
                aria-expanded={!collapsed}
                className={styles["button"]}
              >
                <div className={styles["button-label-container"]}>
                  <span className={styles["button-label"]}>Regions</span>
                  <div>
                    <div className={styles["button-icon"]}>
                      {collapsed ? (
                        <Icon size={"md"}>
                          <PlusIcon />
                        </Icon>
                      ) : (
                        <Icon size={"md"}>
                          <MinusIcon />
                        </Icon>
                      )}
                    </div>
                  </div>
                </div>
              </button>
              <span className={styles["collapsible-field-group-note"]}>Two regions selected</span>
            </div>
            <div>
              {!collapsed && (
                <FieldGroup
                  register={register}
                  name="regions-field-group"
                  type={"checkbox"}
                  fields={Object.values(RegionEnum).map((region) => ({
                    id: region,
                    label: region.replace("_", " "),
                  }))}
                />
              )}
            </div>
          </div>
        </Card.Section>
        <Card.Footer className={styles["card-footer"]}>
          <Button type="submit" size="sm" variant="primary-outlined">
            {t("t.save")}
          </Button>
        </Card.Footer>
      </>
    </BloomCard>
  )
}
