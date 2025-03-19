import { Button, Card, Drawer, FieldValue, Grid } from "@bloom-housing/ui-seeds"
import SectionWithGrid from "../../shared/SectionWithGrid"
import { Field, FieldGroup, numberOptions, Select, t } from "@bloom-housing/ui-components"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { DrawerHeader } from "@bloom-housing/ui-seeds/src/overlays/Drawer"

type UnitGroupFormProps = {
  onClose: () => void
}

const UnitGroupForm = ({ onClose }: UnitGroupFormProps) => {
  const [addAmiDrawerOpen, setAmiDrawerOpen] = useState(false)
  const { register } = useForm()
  const waitlistStatusOptions = [
    {
      id: "open",
      label: "Open",
      value: "true",
      dataTestId: "open-waitlist",
    },
    {
      id: "closed",
      label: "Closed",
      value: "false",
      dataTestId: "closed-waitlist",
    },
  ]

  const rentOptions = [
    {
      id: "flat-rent",
      value: "flatRent",
      label: t("t.flatRent"),
      dataTestId: "flat-rent",
    },
    {
      id: "percentage-of-income",
      value: "percentageOfIncome",
      label: t("t.ofIncome"),
      dataTestId: "percentage-of-income",
    },
  ]

  return (
    <>
      <Drawer.Content>
        <Card>
          <Card.Section>
            <SectionWithGrid heading={t("listings.unit.details")}>
              <fieldset>
                <Grid.Row columns={1}>
                  <legend className="mb-5">{t("listings.unit.type")}</legend>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <FieldGroup
                    type="checkbox"
                    name="unitTypes"
                    fields={[]}
                    register={register}
                    fieldGroupClassName="grid grid-cols-2"
                  />
                </Grid.Row>
              </fieldset>
            </SectionWithGrid>
            <SectionWithGrid heading={t("listings.unit.details")}>
              <Grid.Row columns={3}>
                <FieldValue label={t("listings.unit.affordableGroupQuantity")}>
                  <Field
                    label={t("listings.unit.affordableGroupQuantity")}
                    name="groupQuantity"
                    placeholder={t("listings.unit.affordableGroupQuantity")}
                    readerOnly
                  />
                </FieldValue>
              </Grid.Row>
              <Grid.Row columns={3}>
                <FieldValue label={t("listings.unit.minOccupancy")}>
                  <Select
                    id="minOccupancy"
                    name="minOccupancy"
                    label={t("listings.unit.minOccupancy")}
                    placeholder={t("listings.unit.minOccupancy")}
                    labelClassName="sr-only"
                    register={register}
                    controlClassName="control"
                    options={numberOptions(11)}
                    errorMessage={t("errors.minGreaterThanMaxOccupancyError")}
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.maxOccupancy")}>
                  <Select
                    id="maxOccupancy"
                    name="maxOccupancy"
                    label={t("listings.unit.maxOccupancy")}
                    placeholder={t("listings.unit.maxOccupancy")}
                    labelClassName="sr-only"
                    register={register}
                    controlClassName="control"
                    options={numberOptions(11)}
                    errorMessage={t("errors.maxLessThanMinOccupancyError")}
                  />
                </FieldValue>
              </Grid.Row>
              <Grid.Row columns={3}>
                <FieldValue label={t("listings.unit.minSquareFootage")}>
                  <Field
                    label={t("listings.unit.minSquareFootage")}
                    name="minSquareFootage"
                    placeholder={t("listings.unit.minSquareFootage")}
                    readerOnly
                    type="number"
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.maxSquareFootage")}>
                  <Field
                    label={t("listings.unit.maxSquareFootage")}
                    name="maxSquareFootage"
                    placeholder={t("listings.unit.maxSquareFootage")}
                    readerOnly
                    type="number"
                  />
                </FieldValue>
              </Grid.Row>
              <Grid.Row columns={3}>
                <FieldValue label={t("listings.unit.minFloor")}>
                  <Select
                    labelClassName="sr-only"
                    controlClassName="control"
                    label={t("listings.unit.minFloor")}
                    name="minFloor"
                    id="minFloor"
                    options={numberOptions(10)}
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.maxFloor")}>
                  <Select
                    labelClassName="sr-only"
                    controlClassName="control"
                    label={t("listings.unit.maxFloor")}
                    name="maxFloor"
                    id="maxFloor"
                    options={numberOptions(10)}
                  />
                </FieldValue>
              </Grid.Row>
              <Grid.Row columns={3}>
                <FieldValue label={t("listings.unit.minBathrooms")}>
                  <Select
                    labelClassName="sr-only"
                    controlClassName="control"
                    label={t("listings.unit.minBathrooms")}
                    name="minBathrooms"
                    id="minBathrooms"
                    options={[{ label: t("t.selectOne"), value: "0" }, ...numberOptions(5)]}
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.maxBathrooms")}>
                  <Select
                    labelClassName="sr-only"
                    controlClassName="control"
                    label={t("listings.unit.maxBathrooms")}
                    name="maxBathrooms"
                    id="maxBathrooms"
                    options={[{ label: t("t.selectOne"), value: "0" }, ...numberOptions(5)]}
                  />
                </FieldValue>
              </Grid.Row>
            </SectionWithGrid>
            <hr className="spacer-section-above spacer-section" />
            <SectionWithGrid heading={t("t.availability")}>
              <Grid.Row columns={3}>
                <FieldValue label={t("listings.unit.groupVacancies")}>
                  <Field
                    label={t("listings.unit.groupVacancies")}
                    placeholder={t("listings.unit.groupVacancies")}
                    id="unitGroupVacancies"
                    name="unitGroupVacancies"
                    readerOnly
                  />
                </FieldValue>
                <FieldValue label={t("listings.unit.waitlistStatus")}>
                  <FieldGroup
                    name="waitlistStatus"
                    type="radio"
                    fields={waitlistStatusOptions}
                    register={register}
                  />
                </FieldValue>
              </Grid.Row>
            </SectionWithGrid>
            <hr className="spacer-section-above spacer-section" />
            <SectionWithGrid heading={t("listings.sections.eligibilityTitle")}>
              <Grid.Cell className="grid-inset-section">
                <Button
                  onClick={() => setAmiDrawerOpen(true)}
                  id="addAmiLevelButton"
                  type="button"
                  variant="primary-outlined"
                >
                  {t("listings.unit.amiAdd")}
                </Button>
              </Grid.Cell>
            </SectionWithGrid>
          </Card.Section>
        </Card>
      </Drawer.Content>
      <Drawer.Footer>
        <Button type="button" variant="primary" size="sm" id={"unitFormSaveAndExitButton"}>
          {t("t.saveExit")}
        </Button>

        <Button type="button" onClick={() => onClose()} variant="text" size="sm">
          {t("t.cancel")}
        </Button>
      </Drawer.Footer>

      <Drawer
        isOpen={addAmiDrawerOpen}
        onClose={() => setAmiDrawerOpen(false)}
        ariaLabelledBy="add-ami-level-drawer-header"
        nested
      >
        <DrawerHeader id="add-ami-level-drawer-header">{t("listings.unit.amiAdd")}</DrawerHeader>
        <Drawer.Content>
          <Card>
            <Card.Section>
              <SectionWithGrid heading={t("listings.unit.amiLevel")}>
                <Grid.Row columns={4}>
                  <FieldValue label={t("listings.unit.amiChart")}>
                    <Select
                      label={t("listings.unit.amiChart")}
                      name="amiChart"
                      options={[{ label: t("t.selectOne"), value: "" }]}
                      labelClassName="sr-only"
                      controlClassName="control"
                    />
                  </FieldValue>
                  <FieldValue label={t("listings.unit.amiPercentage")}>
                    <Select
                      label={t("listings.unit.amiPercentage")}
                      name="amiChart"
                      options={[{ label: t("t.selectOne"), value: "" }]}
                      labelClassName="sr-only"
                      controlClassName="control"
                    />
                  </FieldValue>
                  <FieldValue label={t("listings.unit.rentType")}>
                    <FieldGroup
                      name="waitlistStatus"
                      type="radio"
                      fields={rentOptions}
                      register={register}
                    />
                  </FieldValue>
                  <FieldValue label={t("listings.unit.monthlyRent")}>
                    <Field label={t("listings.unit.monthlyRent")} name="monthly-rent" readerOnly />
                  </FieldValue>
                </Grid.Row>
              </SectionWithGrid>
            </Card.Section>
          </Card>
        </Drawer.Content>
        <Drawer.Footer>
          <Button type="button" variant="primary" size="sm" id={"amiLevelSaveButton"}>
            {t("t.save")}
          </Button>

          <Button type="button" onClick={() => onClose()} variant="text" size="sm">
            {t("t.cancel")}
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  )
}

export default UnitGroupForm
