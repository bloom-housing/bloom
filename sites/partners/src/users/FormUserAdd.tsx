import React, { useMemo, useContext } from "react"
import { useForm } from "react-hook-form"
import {
  Button,
  t,
  Form,
  GridSection,
  GridCell,
  ViewItem,
  Field,
  FieldGroup,
  Select,
  useMutate,
  AuthContext,
  AppearanceStyleType,
  AppearanceBorderType,
  RoleOption,
  roleKeys,
  emailRegex,
  setSiteAlertMessage,
} from "@bloom-housing/ui-components"
import { Listing } from "@bloom-housing/backend-core/types"
import router from "next/router"

type FormUserAddProps = {
  listings: Listing[]
  onDrawerClose: () => void
}

type FormUserAddValues = {
  firstName: string
  lastName: string
  email: string
  role: string
  user_listings: []
  listings_all: boolean
}

const FormUserAdd = ({ listings, onDrawerClose }: FormUserAddProps) => {
  const { userService } = useContext(AuthContext)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, getValues, trigger, setValue } = useForm<FormUserAddValues>()

  const { mutate, isLoading } = useMutate()

  const invite = async () => {
    const { firstName, lastName, email, role, user_listings } = getValues()
    const validation = await trigger()

    if (!validation) return

    const roles = (() => ({
      isAdmin: role.includes(RoleOption.Administrator),
      isPartner: role.includes(RoleOption.Partner),
    }))()

    const leasingAgentInListings = user_listings.map((id) => ({ id }))

    const jurisdictions = user_listings
      .reduce((acc, curr) => {
        const listing = listings.find((listing) => listing.id === curr)

        if (!acc.includes(listing.jurisdiction.id)) {
          acc.push(listing.jurisdiction.id)
        }

        return acc
      }, [])
      .map((id) => ({ id }))

    const body = {
      firstName,
      lastName,
      email,
      roles,
      leasingAgentInListings: leasingAgentInListings,
      jurisdictions: jurisdictions,
    }

    void mutate(() =>
      userService
        .invite({
          body,
        })
        .then(() => {
          setSiteAlertMessage(t(`users.inviteSent`), "success")
        })
        .catch(() => {
          setSiteAlertMessage(t(`errors.alert.badRequest`), "alert")
        })
        .finally(() => {
          onDrawerClose()
          void router.reload()
        })
    )
  }

  const listingsOptions = useMemo(() => {
    return listings.map((listing) => ({
      id: listing.id,
      label: listing.name,
      value: listing.id,
      onChange: () => setValue("listings_all", false),
    }))
  }, [listings, setValue])

  /**
   * Control listing checkboxes on select/deselect all listings option
   */
  const updateAllCheckboxes = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setValue("user_listings", [])
    } else {
      const allListingIds = listingsOptions.map((option) => option.id)
      setValue("user_listings", allListingIds)
    }
  }

  return (
    <Form onSubmit={() => false}>
      <div className="border rounded-md p-8 bg-white">
        <GridSection title={t("users.userDetails")} columns={4}>
          <GridCell>
            <ViewItem label={t("authentication.createAccount.firstName")}>
              <Field
                id="firstName"
                name="firstName"
                label={t("authentication.createAccount.firstName")}
                placeholder={t("authentication.createAccount.firstName")}
                error={!!errors?.firstName}
                errorMessage={t("errors.requiredFieldError")}
                validation={{ required: true }}
                register={register}
                type="text"
                readerOnly
              />
            </ViewItem>
          </GridCell>

          <GridCell>
            <ViewItem label={t("authentication.createAccount.lastName")}>
              <Field
                id="lastName"
                name="lastName"
                label={t("authentication.createAccount.lastName")}
                placeholder={t("authentication.createAccount.lastName")}
                error={!!errors?.lastName}
                errorMessage={t("errors.requiredFieldError")}
                validation={{ required: true }}
                register={register}
                type="text"
                readerOnly
              />
            </ViewItem>
          </GridCell>

          <GridCell>
            <ViewItem label={t("t.email")}>
              <Field
                id="email"
                name="email"
                label={t("t.email")}
                placeholder={t("t.email")}
                error={!!errors?.email}
                errorMessage={t("errors.requiredFieldError")}
                validation={{ required: true, pattern: emailRegex }}
                register={register}
                type="email"
                readerOnly
              />
            </ViewItem>
          </GridCell>

          <GridCell>
            <ViewItem label={t("t.role")}>
              <Select
                id="role"
                name="role"
                label={t("t.role")}
                placeholder={t("t.role")}
                labelClassName="sr-only"
                register={register}
                controlClassName="control"
                keyPrefix="users"
                options={roleKeys}
                error={!!errors?.role}
                errorMessage={t("errors.requiredFieldError")}
                validation={{ required: true }}
              />
            </ViewItem>
          </GridCell>
        </GridSection>

        <GridSection title={t("nav.listings")} columns={2}>
          <GridCell>
            <ViewItem>
              <Field
                id="listings_all"
                name="listings_all"
                label={t("users.allListings")}
                register={register}
                type="checkbox"
                inputProps={{
                  onChange: (e) => updateAllCheckboxes(e),
                }}
              />

              <FieldGroup
                name="user_listings"
                fields={listingsOptions}
                type="checkbox"
                register={register}
                error={!!errors?.user_listings}
                errorMessage={t("errors.requiredFieldError")}
                validation={{ required: true }}
              />
            </ViewItem>
          </GridCell>
        </GridSection>
      </div>

      <div className="mt-6">
        <Button
          type="button"
          className="mx-1"
          onClick={() => invite()}
          styleType={AppearanceStyleType.primary}
          loading={isLoading}
        >
          {t("t.invite")}
        </Button>

        <Button
          type="button"
          onClick={() => onDrawerClose()}
          styleType={AppearanceStyleType.secondary}
          border={AppearanceBorderType.borderless}
        >
          {t("t.cancel")}
        </Button>
      </div>
    </Form>
  )
}

export { FormUserAdd as default, FormUserAdd }
