import React, { useState, useEffect, useMemo } from "react"
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
import { useJurisdictionalPreferenceList } from "../../../../lib/hooks"
import { Preference } from "@bloom-housing/backend-core/types"

type PreferencesProps = {
  preferences: Preference[]
  setPreferences: (units: Preference[]) => void
}

const Preferences = ({ preferences, setPreferences }: PreferencesProps) => {
  const [preferencesTableDrawer, setPreferencesTableDrawer] = useState<boolean | null>(null)
  const [preferencesSelectDrawer, setPreferencesSelectDrawer] = useState<boolean | null>(null)
  const [draftPreferences, setDraftPreferences] = useState<Preference[]>(preferences)
  const [dragOrder, setDragOrder] = useState([])

  const draggableTableData = useMemo(
    () =>
      draftPreferences.map((pref) => ({
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

  const formTableData = useMemo(
    () =>
      preferences.map((pref, index) => ({
        order: index + 1,
        name: pref.title,
        action: (
          <div className="flex">
            <Button
              type="button"
              className="front-semibold uppercase text-red-700"
              onClick={() => {
                const editedPreferences = [...preferences]
                editedPreferences.splice(editedPreferences.indexOf(pref), 1)
                setPreferences(editedPreferences)
                setDraftPreferences(editedPreferences)
              }}
              unstyled
            >
              {t("t.delete")}
            </Button>
          </div>
        ),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [preferences]
  )

  // Update local state with dragged state
  useEffect(() => {
    if (draftPreferences.length > 0 && dragOrder.length > 0) {
      const newDragOrder = []
      dragOrder.forEach((pref) => {
        newDragOrder.push(draftPreferences.filter((draftPref) => draftPref.title === pref.name)[0])
      })
      setDraftPreferences(newDragOrder)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragOrder])

  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, getValues, watch } = formMethods

  const jurisdiction: string = watch("jurisdiction.id")

  // Fetch and filter all preferences
  const { data: preferencesData = [] } = useJurisdictionalPreferenceList(jurisdiction)
  const formTableHeaders = {
    order: "t.order",
    name: "t.name",
    action: "",
  }

  const draggableTableHeaders = {
    name: "t.name",
    action: "",
  }

  return (
    <>
      <GridSection
        title={t("listings.sections.housingPreferencesTitle")}
        description={t("listings.sections.housingPreferencesSubtext")}
        grid={false}
        separator
      >
        <div className="bg-gray-300 px-4 py-5">
          {!!preferences.length && (
            <div className="mb-5">
              <MinimalTable headers={formTableHeaders} data={formTableData} />
            </div>
          )}

          <Button
            type="button"
            size={AppearanceSizeType.normal}
            onClick={() => setPreferencesTableDrawer(true)}
          >
            {preferences.length ? t("listings.editPreferences") : t("listings.addPreference")}
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
              <MinimalTable
                headers={draggableTableHeaders}
                data={draggableTableData}
                draggable={true}
                setData={setDragOrder}
              />
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
            setPreferences(draftPreferences)
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
          setPreferencesSelectDrawer(null)
        }}
        className={"w-auto"}
      >
        <div className="border rounded-md p-8 bg-white">
          {jurisdiction
            ? preferencesData.map((pref, index) => {
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
                          (existingPref) => existingPref.title === pref.title
                        ),
                      }}
                    />
                  </GridSection>
                )
              })
            : t("listings.selectJurisdiction")}
        </div>
        <Button
          type="button"
          className={"mt-4"}
          styleType={AppearanceStyleType.primary}
          size={AppearanceSizeType.normal}
          onClick={() => {
            const selectedPreferences = getValues()
            const formPreferences = []
            preferencesData.forEach((uniquePref) => {
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
