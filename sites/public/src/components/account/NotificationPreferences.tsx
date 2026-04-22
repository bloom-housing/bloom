import { useContext, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import PlusIcon from "@heroicons/react/24/solid/PlusIcon"
import MinusIcon from "@heroicons/react/24/solid/MinusIcon"
import { AuthContext, BloomCard, MessageContext } from "@bloom-housing/shared-helpers"
import { Button, Card, Icon, LoadingState } from "@bloom-housing/ui-seeds"
import { Field, FieldGroup, Form, t } from "@bloom-housing/ui-components"
import {
  Jurisdiction,
  UserNotificationPreferences,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import styles from "./NotificationPreferences.module.scss"

interface NotificationPreferencesProps {
  jurisdiction: Jurisdiction
}

export const NotificationPreferences = ({ jurisdiction }: NotificationPreferencesProps) => {
  const { userService } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)
  const [collapsed, setCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<{
    preferences: string[]
    regions: string[]
  }>({ preferences: [], regions: [] })

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, watch, setValue } = useForm()

  const preferenceOptions = useMemo(
    () => ["hearingAndVision", "mobility", "mobilityHearingAndVision", "lottery", "waitlist"],
    []
  )
  const jurisdictionRegions: string[] = jurisdiction?.regions ?? []
  const regionOptions = jurisdictionRegions

  const rawSelectedRegions: string[] = watch("regionsFieldGroup", [])
  const rawSelectedPreferences: string[] = watch("preferencesFieldGroup", [])

  const selectedRegions = useMemo(
    () =>
      [...new Set(Array.isArray(rawSelectedRegions) ? rawSelectedRegions : [])].filter((r) =>
        regionOptions.includes(r)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(rawSelectedRegions), regionOptions]
  )
  const selectedPreferences = useMemo(
    () =>
      [...new Set(Array.isArray(rawSelectedPreferences) ? rawSelectedPreferences : [])].filter(
        (p) => preferenceOptions.includes(p)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(rawSelectedPreferences), preferenceOptions]
  )

  const isAllSelected =
    selectedPreferences.length === preferenceOptions.length &&
    selectedRegions.length === regionOptions.length

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
  }, [userService, preferenceOptions])

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
      headingPriority={1}
      variant="block"
    >
      <LoadingState loading={isLoading}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Card.Section>
            <fieldset>
              <legend className="sr-only">{t("account.settings.myNotification")}</legend>
              <div className={styles["select-all-container"]}>
                <Field
                  id="select-all-checkbox"
                  name="selectAllCheckbox"
                  type="checkbox"
                  subNote={t("account.settings.notifications.selectAllNote")}
                  label={t("account.settings.notifications.selectAllLabel")}
                  labelClassName={styles["select-all-label"]}
                  className={styles["select-all"]}
                  inputProps={{
                    checked: isAllSelected,
                  }}
                  onChange={(e) => {
                    setValue("preferencesFieldGroup", e.target.checked ? preferenceOptions : [])
                    setValue("regionsFieldGroup", e.target.checked ? regionOptions : [])
                  }}
                />
              </div>
              <FieldGroup
                register={register}
                name="preferencesFieldGroup"
                type={"checkbox"}
                groupLabel={t("account.settings.notifications.notificationTypes")}
                fieldGroupClassName={styles["notification-preferences-field-group"]}
                fields={preferenceOptions.map((option) => ({
                  id: option,
                  label: t(`account.settings.notifications.${option}Label`),
                  note: t(`account.settings.notifications.${option}Note`),
                }))}
              />
              {jurisdictionRegions.length > 0 && (
                <div className={styles["collapsible-field-group"]}>
                  <div className={styles["button-header"]}>
                    <button
                      type="button"
                      onClick={() => setCollapsed(!collapsed)}
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
                              <Icon
                                size={"md"}
                                aria-label={
                                  !collapsed ? t("t.collapseSection") : t("t.expandSection")
                                }
                              >
                                <PlusIcon />
                              </Icon>
                            ) : (
                              <Icon
                                size={"md"}
                                aria-label={
                                  !collapsed ? t("t.collapseSection") : t("t.expandSection")
                                }
                              >
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
                      groupLabel={t("account.settings.notifications.regionLabel")}
                      type={"checkbox"}
                      fields={jurisdictionRegions.map((region) => ({
                        id: region,
                        label: region.replace("_", " "),
                      }))}
                    />
                  </div>
                </div>
              )}
            </fieldset>
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
