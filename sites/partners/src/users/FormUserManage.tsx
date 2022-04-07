import React, { useMemo, useContext, useState, useCallback } from "react"
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
  Tag,
  AppearanceSizeType,
  Modal,
} from "@bloom-housing/ui-components"
import { Listing, User, UserRolesCreate } from "@bloom-housing/backend-core/types"
import router from "next/router"

type FormUserManageProps = {
  mode: "add" | "edit"
  user?: User
  listings: Listing[]
  onDrawerClose: () => void
}

type FormUserManageValues = {
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  user_listings?: string[]
  listings_all?: boolean
}

const determineUserRole = (roles: UserRolesCreate) => {
  if (roles?.isAdmin) {
    return RoleOption.Administrator
  }

  return RoleOption.Partner
}

const FormUserManage = ({ mode, user, listings, onDrawerClose }: FormUserManageProps) => {
  const { userService } = useContext(AuthContext)

  const [isDeleteModalActive, setDeleteModalActive] = useState<boolean>(false)

  const defaultValues: FormUserManageValues =
    mode === "edit"
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: determineUserRole(user.roles),
          user_listings: user.leasingAgentInListings?.map((item) => item.id) ?? [],
          listings_all: listings.length === user.leasingAgentInListings.length,
        }
      : {}

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, getValues, trigger, setValue } = useForm<FormUserManageValues>({
    defaultValues,
  })

  const listingsOptions = useMemo(() => {
    return listings.map((listing) => ({
      id: listing.id,
      label: listing.name,
      value: listing.id,
      inputProps: {
        onChange: () => {
          if (getValues("user_listings").length === listings.length) {
            setValue("listings_all", true)
          } else {
            setValue("listings_all", false)
          }
        },
      },
    }))
  }, [getValues, listings, setValue])

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

  const { mutate: sendInvite, isLoading: isSendInviteLoading } = useMutate()
  const { mutate: resendConfirmation, isLoading: isResendConfirmationLoading } = useMutate()
  const { mutate: updateUser, isLoading: isUpdateUserLoading } = useMutate()
  const { mutate: deleteUser, isLoading: isDeleteUserLoading } = useMutate()

  const createUserBody = useCallback(async () => {
    const { firstName, lastName, email, role } = getValues()

    /**
     * react-hook form returns:
     * - false if any option is selected
     * - string if only one option is selected
     * - array of strings if multiple checkboxes are selected
     */
    const user_listings = (() => {
      const value = getValues("user_listings") as string[] | boolean | string
      const valueInArray = Array.isArray(value)

      if (valueInArray) {
        return value
      } else if (typeof value === "string") {
        return [value]
      }

      return []
    })() as string[]

    const validation = await trigger()

    if (!validation) return

    const roles = (() => ({
      isAdmin: role.includes(RoleOption.Administrator),
      isPartner: role.includes(RoleOption.Partner),
    }))()

    const leasingAgentInListings = user_listings?.map((id) => ({ id })) || []

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
      agreedToTermsOfService: user.agreedToTermsOfService,
    }

    return body
  }, [getValues, listings, trigger, user?.agreedToTermsOfService])

  const onInvite = async () => {
    const body = await createUserBody()
    if (!body) return

    void sendInvite(() =>
      userService
        .invite({
          body,
        })
        .then(() => {
          setSiteAlertMessage(t(`users.inviteSent`), "success")
        })
        .catch((e) => {
          if (e?.response?.status === 409) {
            setSiteAlertMessage(t(`errors.alert.emailConflict`), "alert")
          } else {
            setSiteAlertMessage(t(`errors.alert.badRequest`), "alert")
          }
        })
        .finally(() => {
          onDrawerClose()
          void router.reload()
        })
    )
  }

  const onInviteResend = () => {
    const { email } = getValues()

    const body = { email, appUrl: window.location.origin }

    void resendConfirmation(() =>
      userService
        .resendPartnerConfirmation({ body })
        .then(() => {
          setSiteAlertMessage(t(`users.confirmationSent`), "success")
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

  const onSave = useCallback(async () => {
    const form = await createUserBody()
    if (!form) return

    const body = {
      id: user.id,
      ...form,
    }

    void updateUser(() =>
      userService
        .update({
          body,
        })
        .then(() => {
          setSiteAlertMessage(t(`users.userUpdated`), "success")
        })
        .catch(() => {
          setSiteAlertMessage(t(`errors.alert.badRequest`), "alert")
        })
        .finally(() => {
          onDrawerClose()
          void router.reload()
        })
    )
  }, [createUserBody, onDrawerClose, updateUser, userService, user])

  const onDelete = () => {
    void deleteUser(() =>
      userService
        .delete({
          id: user.id,
        })
        .then(() => {
          setSiteAlertMessage(t(`users.userDeleted`), "success")
        })
        .catch(() => {
          setSiteAlertMessage(t(`errors.alert.badRequest`), "alert")
        })
        .finally(() => {
          onDrawerClose()
          setDeleteModalActive(false)
          void router.reload()
        })
    )
  }

  return (
    <>
      <Form onSubmit={() => false}>
        <div className="border rounded-md p-8 bg-white">
          <GridSection
            title={
              <div className="flex content-center">
                <span>{t("users.userDetails")}</span>

                {mode === "edit" && (
                  <div className="ml-2 mt-2">
                    <Tag
                      className="block"
                      size={AppearanceSizeType.small}
                      styleType={
                        user.confirmedAt ? AppearanceStyleType.success : AppearanceStyleType.primary
                      }
                      pillStyle
                    >
                      {user.confirmedAt ? t("users.confirmed") : t("users.unconfirmed")}
                    </Tag>
                  </div>
                )}
              </div>
            }
            columns={4}
          >
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
          {mode === "edit" && (
            <Button
              type="button"
              className="mx-1"
              onClick={() => onSave()}
              styleType={AppearanceStyleType.primary}
              loading={isUpdateUserLoading}
            >
              {t("t.save")}
            </Button>
          )}

          {mode === "add" && (
            <Button
              type="button"
              className="mx-1"
              onClick={() => onInvite()}
              styleType={AppearanceStyleType.primary}
              loading={isSendInviteLoading}
            >
              {t("t.invite")}
            </Button>
          )}

          {!user?.confirmedAt && mode === "edit" && (
            <Button
              type="button"
              className="mx-1"
              onClick={() => onInviteResend()}
              styleType={AppearanceStyleType.secondary}
              loading={isResendConfirmationLoading}
            >
              {t("users.resendInvite")}
            </Button>
          )}

          {mode === "add" && (
            <Button
              type="button"
              onClick={() => onDrawerClose()}
              styleType={AppearanceStyleType.secondary}
              border={AppearanceBorderType.borderless}
            >
              {t("t.cancel")}
            </Button>
          )}

          {mode === "edit" && (
            <Button
              type="button"
              className="bg-opacity-0 text-red-700"
              onClick={() => setDeleteModalActive(true)}
              unstyled
            >
              {t("t.delete")}
            </Button>
          )}
        </div>
      </Form>

      <Modal
        open={!!isDeleteModalActive}
        title={t("t.areYouSure")}
        ariaDescription={t("users.doYouWantDeleteUser")}
        onClose={() => setDeleteModalActive(false)}
        actions={[
          <Button
            type="button"
            styleType={AppearanceStyleType.alert}
            loading={isDeleteUserLoading}
            onClick={() => {
              onDelete()
            }}
          >
            {t("t.delete")}
          </Button>,
          <Button
            type="button"
            styleType={AppearanceStyleType.secondary}
            border={AppearanceBorderType.borderless}
            onClick={() => {
              setDeleteModalActive(false)
            }}
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        {t("users.doYouWantDeleteUser")}
      </Modal>
    </>
  )
}

export { FormUserManage as default, FormUserManage }
