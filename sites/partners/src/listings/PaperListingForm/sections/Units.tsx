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
import UnitForm from "../UnitForm"
import { useFormContext } from "react-hook-form"
import { TempUnit } from "../"
import { AmiChart } from "@bloom-housing/backend-core/types"

type UnitProps = {
  units: TempUnit[]
  setUnits: (units: TempUnit[]) => void
  amiCharts: AmiChart[]
}

const FormUnits = ({ units, setUnits, amiCharts }: UnitProps) => {
  const [unitDrawer, setUnitDrawer] = useState<number | null>(null)
  // const [unitDrawerOpen, setUnitDrawerOpen] = useState<boolean>(false)
  const [unitDeleteModal, setUnitDeleteModal] = useState<number | null>(null)

  const formMethods = useFormContext()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = formMethods

  const unitTableHeaders = {
    number: "listings.unit.number",
    unitType: "listings.unit.type",
    amiPercentage: "listings.unit.ami",
    monthlyRent: "listings.unit.rent",
    sqFeet: "listings.unit.sqft",
    priorityType: "listings.unit.priorityType",
    status: "listings.unit.status",
    action: "",
  }

  const editUnit = useCallback(
    (tempId: number) => {
      setUnitDrawer(tempId)
    },
    [setUnitDrawer]
  )

  const deleteUnit = useCallback(
    (tempId: number) => {
      const updatedUnits = units
        .filter((unit) => unit.tempId !== tempId)
        .map((updatedUnit, index) => ({
          ...updatedUnit,
          tempId: index + 1,
        }))

      setUnits(updatedUnits)
      setUnitDeleteModal(null)
    },
    [setUnitDeleteModal, setUnits, units]
  )

  function saveUnit(newUnit: TempUnit) {
    const exists = units.some((unit) => unit.tempId === newUnit.tempId)
    if (exists) {
      const updateUnits = units.map((unit) => (unit.tempId === newUnit.tempId ? newUnit : unit))
      setUnits(updateUnits)
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
              onClick={() => editUnit(unit.tempId)}
              unstyled
            >
              {t("t.edit")}
            </Button>
            <Button
              type="button"
              className="front-semibold uppercase text-red-700"
              onClick={() => setUnitDeleteModal(unit.tempId)}
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
        <ViewItem label={t("listings.unitTypesOrIndividual")} className="mb-1" />
        <GridSection columns={3}>
          <GridCell>
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
          </GridCell>
        </GridSection>
        <div className="bg-gray-300 px-4 py-5">
          {!!units.length && (
            <div className="mb-5">
              <MinimalTable headers={unitTableHeaders} data={unitTableData} />
            </div>
          )}
          <Button
            type="button"
            size={AppearanceSizeType.normal}
            onClick={() => editUnit(units.length + 1)}
          >
            {t("listings.unit.add")}
          </Button>
        </div>
      </GridSection>

      <Drawer
        open={!!unitDrawer}
        title={t("listings.unit.add")}
        ariaDescription={t("listings.unit.add")}
        onClose={() => setUnitDrawer(null)}
      >
        <UnitForm
          onSubmit={(unit) => saveUnit(unit)}
          onClose={() => setUnitDrawer(null)}
          units={units}
          amiCharts={amiCharts}
          currentTempId={unitDrawer}
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
