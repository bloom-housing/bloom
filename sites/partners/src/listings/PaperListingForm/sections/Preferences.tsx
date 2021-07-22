import React, { useState, useMemo, useEffect } from "react"
import {
  t,
  GridSection,
  MinimalTable,
  Button,
  AppearanceSizeType,
  Drawer,
  AppearanceStyleType,
  Field,
} from "@bloom-housing/ui-components"
import { useFormContext } from "react-hook-form"
import { FormListing } from "../index"
import { usePreferenceList } from "../../../../lib/hooks"
import { Preference } from "@bloom-housing/backend-core/types"

type PreferencesProps = {
  listing?: FormListing
}

const Preferences = ({ listing }: PreferencesProps) => {
  const [preferencesTableDrawer, setPreferencesTableDrawer] = useState<boolean | null>(null)
  const [preferencesSelectDrawer, setPreferencesSelectDrawer] = useState<boolean | null>(null)
  const [uniquePreferences, setUniquePreferences] = useState<Preference[]>([])
  const [draftPreferences, setDraftPreferences] = useState<Preference[]>(listing?.preferences ?? [])
  const [formPreferences, setFormPreferences] = useState<Preference[]>(listing?.preferences ?? [])

  const { data: preferences = [] } = usePreferenceList()

  useEffect(() => {
    setUniquePreferences(
      preferences.reduce(
        (items, item) =>
          items.find((x) => x.description === item.description) ? [...items] : [...items, item],
        []
      )
    )
  }, [preferences])

  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues } = formMethods

  const preferenceTableHeaders = {
    order: "t.order",
    name: "t.name",
    action: "",
  }

  const draftPreferenceTableData = useMemo(
    () =>
      draftPreferences.map((pref, index) => ({
        order: index + 1,
        name: pref.title,
        action: (
          <div className="flex">
            <Button
              type="button"
              className="front-semibold uppercase text-red-700"
              onClick={() => {
                const editedPreferences = [...draftPreferences]
                editedPreferences.splice(editedPreferences.indexOf(pref), 1)
                setDraftPreferences(editedPreferences)
              }}
              unstyled
            >
              {t("t.delete")}
            </Button>
          </div>
        ),
      })),
    [draftPreferences]
  )

  const formPreferenceTableData = useMemo(
    () =>
      formPreferences.map((pref, index) => ({
        order: index + 1,
        name: pref.title,
        action: (
          <div className="flex">
            <Button
              type="button"
              className="front-semibold uppercase text-red-700"
              onClick={() => {
                const editedPreferences = [...formPreferences]
                editedPreferences.splice(editedPreferences.indexOf(pref), 1)
                setFormPreferences(editedPreferences)
              }}
              unstyled
            >
              {t("t.delete")}
            </Button>
          </div>
        ),
      })),
    [formPreferences]
  )

  return (
    <>
      <GridSection
        title={t("listings.sections.housingPreferencesTitle")}
        description={t("listings.sections.housingPreferencesSubtext")}
        grid={false}
        separator
      >
        <div className="bg-gray-300 px-4 py-5">
          {!!formPreferences.length && (
            <div className="mb-5">
              <MinimalTable headers={preferenceTableHeaders} data={formPreferenceTableData} />
            </div>
          )}

          <Button
            type="button"
            size={AppearanceSizeType.normal}
            onClick={() => setPreferencesTableDrawer(true)}
          >
            {formPreferences.length ? t("listings.editPreferences") : t("listings.addPreference")}
          </Button>
        </div>
      </GridSection>

      <Drawer
        open={!!preferencesTableDrawer}
        title={t("listings.addPreferences")}
        ariaDescription={t("listings.addPreferences")}
        onClose={() => {
          if (!preferencesSelectDrawer) {
            setPreferencesTableDrawer(null)
          }
        }}
      >
        <div className="border rounded-md p-8 bg-white">
          {!!draftPreferences.length && (
            <div className="mb-5">
              <MinimalTable headers={preferenceTableHeaders} data={draftPreferenceTableData} />
            </div>
          )}
          <Button
            type="button"
            size={AppearanceSizeType.normal}
            onClick={() => {
              setPreferencesSelectDrawer(true)
            }}
          >
            {t("listings.selectPreferences")}
          </Button>
        </div>
        <Button
          type="button"
          className={"mt-4"}
          styleType={AppearanceStyleType.primary}
          size={AppearanceSizeType.normal}
          onClick={() => {
            setFormPreferences(draftPreferences)
            setPreferencesTableDrawer(null)
          }}
        >
          {t("t.save")}
        </Button>
      </Drawer>

      <Drawer
        open={!!preferencesSelectDrawer}
        title={t("listings.selectPreferences")}
        ariaDescription={t("listings.selectPreferences")}
        onClose={() => {
          console.log("select drawer on close")
          setPreferencesSelectDrawer(null)
        }}
        className={"w-auto"}
      >
        <div className="border rounded-md p-8 bg-white">
          {uniquePreferences.map((pref, index) => {
            return (
              <GridSection columns={1} key={index}>
                <Field
                  className={"font-semibold"}
                  id={`preference.${pref.id}`}
                  name={`preference.${pref.id}`}
                  type="checkbox"
                  label={pref.title}
                  register={register}
                  inputProps={{
                    defaultChecked: draftPreferences.some(
                      (existingPref) => existingPref.id === pref.id
                    ),
                  }}
                />
              </GridSection>
            )
          })}
        </div>
        <Button
          type="button"
          className={"mt-4"}
          styleType={AppearanceStyleType.primary}
          size={AppearanceSizeType.normal}
          onClick={() => {
            const selectedPreferences = getValues()
            const formPreferences = []
            uniquePreferences.forEach((uniquePref) => {
              if (selectedPreferences.preference[uniquePref.id]) {
                formPreferences.push(uniquePref)
              }
            })
            setDraftPreferences(formPreferences)
            setPreferencesSelectDrawer(null)
          }}
        >
          {t("t.save")}
        </Button>
      </Drawer>
    </>
  )
}

export default Preferences
