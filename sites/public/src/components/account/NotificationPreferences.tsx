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
      title={t("account.settings.myNotification")}
      subtitle={t("account.settings.notifications.subtitle")}
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
                label: t("account.settings.notifications.selectAllLabel"),
                note: t("account.settings.notifications.selectAllNote"),
              },
              {
                id: "hearing-vision-checkbox",
                label: t("account.settings.notifications.hearingVisionLabel"),
                note: t("account.settings.notifications.hearingVisionNote"),
              },
              {
                id: "mobility-checkbox",
                label: t("account.settings.notifications.mobilityLabel"),
                note: t("account.settings.notifications.mobilityNote"),
              },
              {
                id: "mobility-hearing-vision-checkbox",
                label: t("account.settings.notifications.mobilityHearingVisionLabel"),
                note: t("account.settings.notifications.mobilityHearingVisionNote"),
              },
              {
                id: "new-lotteries-checkbox",
                label: t("account.settings.notifications.lotteriesLabel"),
                note: t("account.settings.notifications.lotteriesNote"),
              },
              {
                id: "new-waitlists-checkbox",
                label: t("account.settings.notifications.waitlistLabel"),
                note: t("account.settings.notifications.waitlistNote"),
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
                  <span className={styles["button-label"]}>
                    {t("account.settings.notifications.regionLabel")}
                  </span>
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
              <span className={styles["collapsible-field-group-note"]}>
                {t("account.settings.notifications.regionNote_selected", { smart_count: 0 })}
              </span>
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
