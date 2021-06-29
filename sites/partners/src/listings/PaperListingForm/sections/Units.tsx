import React, { useState, useMemo, useCallback } from "react"
import {
  t,
  GridSection,
  MinimalTable,
  Button,
  AppearanceSizeType,
  Drawer,
  Modal,
  AppearanceStyleType,
  AppearanceBorderType,
  ViewItem,
  GridCell,
  Field,
} from "@bloom-housing/ui-components"

import { Unit } from "@bloom-housing/backend-core/types"
import UnitForm from "../UnitForm"
import { useFormContext } from "react-hook-form"

type UnitProps = {
  units: Unit[]
  setUnits: (units: Unit[]) => void
}

const FormUnits = ({ units, setUnits }: UnitProps) => {
  const [unitDrawer, setUnitDrawer] = useState<string | null>(null)
  const [unitDrawerOpen, setUnitDrawerOpen] = useState<boolean>(false)
  const [unitDeleteModal, setUnitDeleteModal] = useState<string | null>(null)

  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  const unitTableHeaders = {
    number: t("listings.unit.number"),
    unitType: t("listings.unit.type"),
    amiPercentage: t("listings.unit.ami"),
    monthlyRent: t("listings.unit.rent"),
    sqFeet: t("listings.unit.sqft"),
    priorityType: t("listings.unit.priorityType"),
    status: t("listings.unit.status"),
    action: "",
  }

  const editUnit = useCallback(
    (number: string | null) => {
      setUnitDrawer(number)
      setUnitDrawerOpen(true)
    },
    [setUnitDrawer]
  )

  const deleteUnit = useCallback(
    (number: string) => {
      const updatedUnits = units.filter((unit) => unit.number !== number)

      setUnits(updatedUnits)
      setUnitDeleteModal(null)
    },
    [setUnitDeleteModal, setUnits, units]
  )

  function saveUnit(newUnit: Unit) {
    const exists = units.some((unit) => unit.number === newUnit.number)

    if (exists) {
      const withoutUpdated = units.filter((unit) => unit.number !== newUnit.number)
      setUnits([...withoutUpdated, newUnit])
    } else {
      setUnits([...units, newUnit])
    }
  }
  const unitTableData = useMemo(
    () =>
      units.map((unit) => ({
        number: unit.number,
        unitType: t(`listings.unitTypes.${unit.unitType}`),
        amiPercentage: unit.amiPercentage,
        monthlyRent: unit.monthlyRent,
        sqFeet: unit.sqFeet,
        priorityType: unit.priorityType,
        status: unit.status,
        action: (
          <div className="flex">
            <Button
              type="button"
              className="front-semibold uppercase"
              onClick={() => editUnit(unit.number)}
              unstyled
            >
              {t("t.edit")}
            </Button>
            <Button
              type="button"
              className="front-semibold uppercase text-red-700"
              onClick={() => setUnitDeleteModal(unit.number)}
              unstyled
            >
              {t("t.delete")}
            </Button>
          </div>
        ),
      })),
    [editUnit, units]
  )

  return (
    <>
      <GridSection title={t("listings.units")} grid={false} separator>
        <ViewItem label={t("listings.unitsDescription")} />
        <GridSection columns={3}>
          <GridCell>
            <ViewItem label={t("listings.unitTypesOrIndividual")}>
              <div className="flex h-12 items-center">
                <Field
                  id="disableUnitsAccordion"
                  name="disableUnitsAccordion"
                  className="m-0"
                  type="radio"
                  label={t("listings.unit.unitTypes")}
                  register={register}
                  inputProps={{
                    value: false,
                  }}
                />
                <Field
                  id="disableUnitsAccordion"
                  name="disableUnitsAccordion"
                  className="m-0"
                  type="radio"
                  label={t("listings.unit.individualUnits")}
                  register={register}
                  inputProps={{
                    value: true,
                  }}
                />
              </div>
            </ViewItem>
          </GridCell>
        </GridSection>
        <div className="bg-gray-300 px-4 py-5">
          {!!units.length && (
            <div className="mb-5">
              <MinimalTable headers={unitTableHeaders} data={unitTableData} />
            </div>
          )}
          <Button type="button" size={AppearanceSizeType.normal} onClick={() => editUnit(null)}>
            {t("listings.unit.add")}
          </Button>
        </div>
      </GridSection>

      <Drawer
        open={unitDrawerOpen}
        title={t("listings.unit.add")}
        ariaDescription={t("listings.unit.add")}
        onClose={() => setUnitDrawerOpen(false)}
      >
        <UnitForm
          onSubmit={(unit) => saveUnit(unit)}
          onClose={() => setUnitDrawerOpen(false)}
          units={units}
          currentNumber={unitDrawer}
        />
      </Drawer>

      <Modal
        open={!!unitDeleteModal}
        title={t("listings.unit.delete")}
        ariaDescription={t("listings.unit.deleteConf")}
        onClose={() => setUnitDeleteModal(null)}
        actions={[
          <Button styleType={AppearanceStyleType.alert} onClick={() => deleteUnit(unitDeleteModal)}>
            {t("t.delete")}
          </Button>,
          <Button
            styleType={AppearanceStyleType.primary}
            border={AppearanceBorderType.borderless}
            onClick={() => {
              setUnitDeleteModal(null)
            }}
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        {t("listings.unit.deleteConf")}
      </Modal>
    </>
  )
}

export default FormUnits
