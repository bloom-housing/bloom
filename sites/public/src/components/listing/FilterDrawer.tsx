import { Field, FieldGroup, Form, GridCell, t } from "@bloom-housing/ui-components"
import { Button, Drawer, Grid } from "@bloom-housing/ui-seeds"
import { useForm, useFormContext } from "react-hook-form"
import { listingFeatures } from "@bloom-housing/shared-helpers"
import { UnitTypeEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import styles from "./FilterDrawer.module.scss"
const FilterDrawer = () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register } = useForm()

  const createCheckboxCells = (keyArr: string[], stringBase: string) => {
    return (
      <fieldset>
        <Grid.Row className={styles["filter-section-label"]}>
          <legend>Label</legend>
        </Grid.Row>
        <Grid.Row columns={3} className={styles["filter-section"]}>
          {keyArr.map((key) => (
            <Grid.Cell>
              <Field
                id={key}
                name={key}
                label={t(`${stringBase}.${key}`)}
                labelClassName={styles["filter-checkbox-label"]}
                type="checkbox"
                register={register}
              ></Field>
            </Grid.Cell>
          ))}
        </Grid.Row>
      </fieldset>
    )
  }

  return (
    <Drawer
      isOpen={true}
      className={styles["filter-drawer"]}
      onClose={() => console.log("log")}
      ariaLabelledBy="drawer-heading"
      ariaDescribedBy="drawer-content"
    >
      <Drawer.Header id="drawer-heading">{t("t.filter")}</Drawer.Header>
      <Form>
        <Drawer.Content id="drawer-content">
          {createCheckboxCells(
            Object.keys(UnitTypeEnum),
            "application.household.preferredUnit.options"
          )}
          {/* <FieldGroup
              type="checkbox"
              name="application.preferredUnit"
              fields={createFields(
                Object.values(UnitTypeEnum),
                "application.household.preferredUnit.options"
              )}
              groupLabel={t("application.details.preferredUnitSizes")}
              register={register}
              fieldGroupClassName="flex flex-row"
            /> */}
          {createCheckboxCells(listingFeatures, "eligibility.accessibility")}
        </Drawer.Content>
        <Drawer.Footer>
          <Button variant="primary" size="sm">
            {t("listings.showMatchingListings")}
          </Button>
          <Button variant="primary-outlined" size="sm">
            {t("t.cancel")}
          </Button>
        </Drawer.Footer>
      </Form>
    </Drawer>
  )
}

export { FilterDrawer as default, FilterDrawer }
