import { AuthContext, BloomCard, MessageContext } from "@bloom-housing/shared-helpers"
import styles from "./NotificationPreferences.module.scss"
import { Button, Card, Icon, LoadingState } from "@bloom-housing/ui-seeds"
import { useForm } from "react-hook-form"
import { Field, FieldGroup, Form, t } from "@bloom-housing/ui-components"
import { useContext, useEffect, useMemo, useState } from "react"
import PlusIcon from "@heroicons/react/24/solid/PlusIcon"
import MinusIcon from "@heroicons/react/24/solid/MinusIcon"
import {
  RegionEnum,
  UserNotificationPreferences,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export const NotificationPreferences = () => {
  const { userService, profile } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)
  const [collapsed, setCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<{
    preferences: string[]
    regions: string[]
  }>({ preferences: [], regions: [] })

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, watch, setValue } = useForm()

  const selectedRegions: string[] = watch("regionsFieldGroup", [])
  const selectedPreferences: string[] = watch("preferencesFieldGroup", [])

  const preferenceOptions = useMemo(
    () => ["hearingAndVision", "mobility", "mobilityHearingAndVision", "lottery", "waitlist"],
    []
  )

  useEffect(() => {
    void userService
      .getNotificationPreferences()
      .then((preferences) => {
        const { regions, ...other } = preferences

        const enabledPreferences = preferenceOptions
          .map((option) => (other[option] ? option : null))
          .filter(Boolean)

        setUserData({
          regions: regions,
          preferences: enabledPreferences,
        })
      })
      .finally(() => setIsLoading(false))
  }, [userService, profile, preferenceOptions])

  useEffect(() => {
    setValue("preferencesFieldGroup", userData.preferences)
    setValue("regionsFieldGroup", userData.regions)
  }, [userData, setValue])

  const onSubmit = (data) => {
    const dto: UserNotificationPreferences = {
      ...Object.fromEntries(
        preferenceOptions.map((key) => [key, !!data.preferencesFieldGroup.includes(key)])
      ),
      regions: data.regionsFieldGroup,
    }
    void userService
      .updateNotificationPreferences({ body: dto })
      .then(() =>
        addToast(t("account.settings.notifications.updateSuccess"), { variant: "success" })
      )
      .catch(() => addToast("account.settings.notifications.updateFail", { variant: "alert" }))
  }

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
      <LoadingState loading={isLoading}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Card.Section>
            <div>
              <Field
                id="select-all-checkbox"
                name="selectAllCheckbox"
                type="checkbox"
                subNote={t("account.settings.notifications.selectAllNote")}
                label={t("account.settings.notifications.selectAllLabel")}
                labelClassName={styles["select-all-label"]}
                className={styles["select-all"]}
                inputProps={{
                  checked: selectedPreferences.length === preferenceOptions.length,
                }}
                onChange={(e) =>
                  setValue("preferencesFieldGroup", e.target.checked ? preferenceOptions : [])
                }
              />
            </div>
            <FieldGroup
              register={register}
              name="preferencesFieldGroup"
              type={"checkbox"}
              fieldGroupClassName={styles["notification-preferences-field-group"]}
              fields={preferenceOptions.map((option) => ({
                id: option,
                label: t(`account.settings.notifications.${option}Label`),
                note: t(`account.settings.notifications.${option}Note`),
              }))}
            />
            <div className={styles["collapsible-field-group"]}>
              <div className={styles["button-header"]}>
                <button
                  type="button"
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
                  {selectedRegions.length
                    ? t("account.settings.notifications.regionNote_selected", {
                        smart_count: selectedRegions.length,
                      })
                    : t("account.settings.notifications.regionNote_none")}
                </span>
              </div>
              <div>
                <FieldGroup
                  register={register}
                  fieldClassName={styles[`regions-field-group${collapsed ? "-hidden" : ""}`]}
                  name="regionsFieldGroup"
                  type={"checkbox"}
                  fields={Object.values(RegionEnum).map((region) => ({
                    id: region,
                    label: region.replace("_", " "),
                  }))}
                />
              </div>
            </div>
          </Card.Section>
          <Card.Footer className={styles["card-footer"]}>
            <Button type="submit" size="sm" variant="primary-outlined">
              {t("t.save")}
            </Button>
          </Card.Footer>
        </Form>
      </LoadingState>
    </BloomCard>
  )
}
