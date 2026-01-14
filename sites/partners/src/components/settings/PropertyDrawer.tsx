import { Property, PropertyCreate } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import SectionWithGrid from "../../components/shared/SectionWithGrid"
import { Button, Card, Drawer, Grid } from "@bloom-housing/ui-seeds"
import { Field, Select, SelectOption, t, Textarea } from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import { addAsterisk, defaultFieldProps, fieldHasError } from "../../lib/helpers"
import { useCallback, useContext } from "react"
import { AuthContext } from "@bloom-housing/shared-helpers"

type PropertyDrawerProps = {
  drawerOpen: boolean
  editedProperty: Property | null
  isLoading?: boolean
  onDrawerClose: () => void
  saveQuestion: (formattedData: PropertyCreate) => void
}

type PropertyFormTypes = {
  name: string
  description: string
  url: string
  urlTitle: string
  jurisdictions: {
    id: string
  }
}

export const PropertyDrawer = ({
  drawerOpen,
  editedProperty,
  isLoading,
  onDrawerClose,
  saveQuestion,
}: PropertyDrawerProps) => {
  const { profile } = useContext(AuthContext)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, clearErrors, trigger, getValues } = useForm<PropertyFormTypes>()

  const handleSave = useCallback(async () => {
    const validated = await trigger()
    if (!validated) return

    saveQuestion(getValues())
  }, [trigger, getValues, saveQuestion])

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

  const defaultJurisdiction = editedProperty?.jurisdictions
    ? editedProperty.jurisdictions.id
    : jurisdictionOptions.length !== 0
    ? jurisdictionOptions[0].value
    : null

  return (
    <Drawer isOpen={drawerOpen} onClose={onDrawerClose}>
      <Drawer.Header>
        {t(editedProperty ? "properties.drawer.editTitle" : "properties.drawer.addTitle")}
      </Drawer.Header>
      <Drawer.Content>
        <Card>
          <Card.Section>
            <p className="field-label seeds-m-be-label">
              {t("listings.requiredToPublishAsterisk")}
            </p>
            <SectionWithGrid heading={t("properties.drawer.formTitle")}>
              <Grid.Row columns={3}>
                <Grid.Cell className="seeds-grid-span-2">
                  <Field
                    register={register}
                    defaultValue={editedProperty?.name}
                    validation={{ required: true }}
                    {...defaultFieldProps(
                      "name",
                      t("properties.drawer.nameLabel"),
                      [],
                      errors,
                      clearErrors,
                      true
                    )}
                    errorMessage={t("errors.requiredFieldError")}
                  />
                </Grid.Cell>
              </Grid.Row>
              <Grid.Row columns={3}>
                <Grid.Cell className="seeds-grid-span-2">
                  <Textarea
                    fullWidth={true}
                    register={register}
                    defaultValue={editedProperty?.description}
                    {...defaultFieldProps(
                      "description",
                      t("properties.drawer.descriptionLabel"),
                      [],
                      errors,
                      clearErrors
                    )}
                  />
                </Grid.Cell>
              </Grid.Row>
              <Grid.Row columns={3}>
                <Grid.Cell>
                  <Field
                    register={register}
                    placeholder="https://"
                    defaultValue={editedProperty?.url}
                    {...defaultFieldProps(
                      "url",
                      t("properties.drawer.urlLabel"),
                      [],
                      errors,
                      clearErrors
                    )}
                    type="url"
                    error={!!errors?.url}
                    errorMessage={
                      errors?.url?.type === "https"
                        ? t("errors.urlHttpsError")
                        : t("errors.urlError")
                    }
                  />
                </Grid.Cell>
                <Grid.Cell>
                  <Field
                    register={register}
                    defaultValue={editedProperty?.urlTitle}
                    {...defaultFieldProps(
                      "urlTitle",
                      t("properties.drawer.urlTitleLabel"),
                      [],
                      errors,
                      clearErrors
                    )}
                  />
                </Grid.Cell>
              </Grid.Row>
              {profile.jurisdictions.length > 1 && (
                <Grid.Row columns={3}>
                  <Grid.Cell>
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
                        "aria-hidden": !!defaultJurisdiction,
                      }}
                    />
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
          id={"property-save-button"}
        >
          {t("t.save")}
        </Button>
      </Drawer.Footer>
    </Drawer>
  )
}
