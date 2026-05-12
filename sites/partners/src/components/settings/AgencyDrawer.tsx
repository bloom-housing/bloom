import { useCallback, useContext } from "react"
import { useForm } from "react-hook-form"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { Agency, AgencyCreate } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Card, Drawer, FieldValue, Grid } from "@bloom-housing/ui-seeds"
import { Field, Select, SelectOption, t } from "@bloom-housing/ui-components"
import { addAsterisk, defaultFieldProps, fieldHasError } from "../../lib/helpers"
import SectionWithGrid from "../../components/shared/SectionWithGrid"

type AgencyDrawerProps = {
  drawerOpen: boolean
  editedAgency: Agency | null
  isLoading?: boolean
  onDrawerClose: () => void
  saveAgency: (formattedData: AgencyCreate) => void
}

type AgencyFormTypes = {
  name: string
  jurisdictions: {
    id: string
  }
}

export const AgencyDrawer = ({
  drawerOpen,
  editedAgency,
  isLoading,
  onDrawerClose,
  saveAgency,
}: AgencyDrawerProps) => {
  const { profile } = useContext(AuthContext)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, clearErrors, trigger, getValues } = useForm<AgencyFormTypes>()

  const jurisdictionOptions: SelectOption[] =
    profile.jurisdictions.length !== 0
      ? [
          { label: "", value: "" },
          ...profile.jurisdictions.map((jurisdiction) => ({
            label: jurisdiction.name,
            value: jurisdiction.id,
          })),
        ]
      : []

  const defaultJurisdiction = editedAgency?.jurisdictions
    ? editedAgency.jurisdictions.id
    : jurisdictionOptions.length !== 0
    ? jurisdictionOptions[1].value
    : null

  const defaultJurisdictionName =
    jurisdictionOptions.find((jurisdiction) => jurisdiction.value === defaultJurisdiction)?.label ||
    editedAgency?.jurisdictions?.name

  const handleSave = useCallback(async () => {
    const validated = await trigger()
    if (!validated) return
    const values = getValues()
    if (!values.jurisdictions?.id && defaultJurisdiction) {
      values.jurisdictions = { id: defaultJurisdiction }
    }

    saveAgency(values)
  }, [trigger, getValues, defaultJurisdiction, saveAgency])

  return (
    <Drawer isOpen={drawerOpen} onClose={onDrawerClose}>
      <Drawer.Header>
        {t(editedAgency ? "agencies.drawer.editTitle" : "agencies.drawer.addTitle")}
      </Drawer.Header>
      <Drawer.Content>
        <Card>
          <Card.Section>
            <p className="field-label seeds-m-be-label">{t("listings.requiredToSaveAsterisk")}</p>
            <SectionWithGrid heading={t("agencies.drawer.formTitle")}>
              <Grid.Row columns={3}>
                <Grid.Cell className="seeds-grid-span-2">
                  <Field
                    register={register}
                    defaultValue={editedAgency?.name}
                    validation={{ required: true }}
                    {...defaultFieldProps(
                      "name",
                      t("agencies.drawer.nameLabel"),
                      [],
                      errors,
                      clearErrors,
                      true
                    )}
                    errorMessage={t("errors.requiredFieldError")}
                  />
                </Grid.Cell>
              </Grid.Row>
              {profile.jurisdictions.length > 1 && (
                <Grid.Row columns={3}>
                  <Grid.Cell>
                    {editedAgency ? (
                      <FieldValue label={t("t.jurisdiction")}>{defaultJurisdictionName}</FieldValue>
                    ) : (
                      <Select
                        id={"jurisdiction"}
                        defaultValue={defaultJurisdiction}
                        name={"jurisdictions.id"}
                        label={addAsterisk(t("t.jurisdiction"))}
                        register={register}
                        error={fieldHasError(errors?.jurisdictions?.id)}
                        controlClassName={"control"}
                        errorMessage={t("errors.requiredFieldError")}
                        keyPrefix={"jurisdictions"}
                        options={jurisdictionOptions}
                        validation={{ required: true }}
                        inputProps={{
                          onChange: () => {
                            clearErrors("jurisdictions.id")
                          },
                          "aria-required": true,
                        }}
                      />
                    )}
                  </Grid.Cell>
                </Grid.Row>
              )}
            </SectionWithGrid>
          </Card.Section>
        </Card>
      </Drawer.Content>
      <Drawer.Footer>
        <Button
          type="button"
          variant="primary"
          loadingMessage={isLoading && t("t.formSubmitted")}
          disabled={isLoading}
          onClick={handleSave}
          id={"agency-save-button"}
        >
          {t("t.save")}
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}
