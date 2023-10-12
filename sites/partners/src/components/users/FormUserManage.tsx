import React, { useMemo, useContext, useState, useCallback } from "react"
import { FormProvider, useForm } from "react-hook-form"
import {
  Button,
  t,
  Form,
  GridSection,
  GridCell,
  Field,
  Select,
  useMutate,
  AppearanceStyleType,
  emailRegex,
  AppearanceSizeType,
  Modal,
} from "@bloom-housing/ui-components"
import { FieldValue, Tag } from "@bloom-housing/ui-seeds"
import { RoleOption, roleKeys, AuthContext } from "@bloom-housing/shared-helpers"
import { Listing, User, UserRolesCreate } from "@bloom-housing/backend-core/types"
import { JurisdictionAndListingSelection } from "./JurisdictionAndListingSelection"

type FormUserManageProps = {
  mode: "add" | "edit"
  user?: User
  listings: Listing[]
  onDrawerClose: () => void
  setAlertMessage: React.Dispatch<
    React.SetStateAction<{
      type: string
      message: string
    }>
  >
}

type FormUserManageValues = {
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  user_listings?: string[]
  jurisdiction_all?: boolean
  jurisdictions?: string[]
}

const determineUserRole = (roles: UserRolesCreate) => {
  if (roles?.isAdmin) {
    return RoleOption.Administrator
  } else if (roles?.isJurisdictionalAdmin) {
    return RoleOption.JurisdictionalAdmin
  }
  return RoleOption.Partner
}

const FormUserManage = ({
  mode,
  user,
  listings,
  onDrawerClose,
  setAlertMessage,
}: FormUserManageProps) => {
  const { userService, profile } = useContext(AuthContext)
  const jurisdictionList = profile.jurisdictions

  const [isDeleteModalActive, setDeleteModalActive] = useState<boolean>(false)

  let defaultValues: FormUserManageValues = {}
  if (mode === "edit") {
    defaultValues = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: determineUserRole(user.roles),
      user_listings: user.leasingAgentInListings?.map((item) => item.id) ?? [],
      jurisdiction_all: jurisdictionList.length === user.jurisdictions.length,
      jurisdictions: user.jurisdictions.map((elem) => elem.id),
    }
  } else if (profile?.roles?.isJurisdictionalAdmin) {
    defaultValues = {
      jurisdictions: [jurisdictionList[0].id],
    }
  }

  const methods = useForm<FormUserManageValues>({
    defaultValues,
  })
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, getValues, trigger, setValue } = methods

  const jurisdictionOptions = useMemo(() => {
    return jurisdictionList
      .map((juris) => ({
        id: juris.id,
        label: juris.name,
        value: juris.id,
        inputProps: {
          onChange: () => {
            if (getValues("jurisdictions").length === jurisdictionList.length) {
              setValue("jurisdiction_all", true)
            } else {
              setValue("jurisdiction_all", false)
            }
          },
        },
      }))
      .sort((a, b) => (a.label < b.label ? -1 : 1))
  }, [jurisdictionList, getValues, setValue])

  const listingsOptions = useMemo(() => {
    const jurisdictionalizedListings = {}
    jurisdictionList.forEach((juris) => {
      jurisdictionalizedListings[juris.id] = []
    })
    listings.sort((a, b) => a.name.localeCompare(b.name))
    listings.forEach((listing) => {
      if (jurisdictionalizedListings[listing.jurisdiction.id]) {
        // if the user has access to the jurisdiction
        jurisdictionalizedListings[listing.jurisdiction.id].push({
          id: listing.id,
          label: listing.name,
          value: listing.id,
        })
      }
    })

    Object.keys(jurisdictionalizedListings).forEach((key) => {
      const listingsInJurisdiction = jurisdictionalizedListings[key]
      listingsInJurisdiction.forEach((listing) => {
        listing.inputProps = {
          onChange: () => {
            let currValues = getValues("user_listings")
            if (currValues && !Array.isArray(currValues)) {
              currValues = [currValues]
            } else if (!currValues) {
              currValues = []
            }

            const temp = listingsInJurisdiction.every((elem) =>
              currValues.some((search) => elem.id === search)
            )

            if (temp) {
              setValue(`listings_all_${key}`, true)
            } else {
              setValue(`listings_all_${key}`, false)
            }
          },
        }
      })
    })
    return jurisdictionalizedListings
  }, [getValues, listings, setValue, jurisdictionList])

  const { mutate: sendInvite, isLoading: isSendInviteLoading } = useMutate()
  const { mutate: resendConfirmation, isLoading: isResendConfirmationLoading } = useMutate()
  const { mutate: updateUser, isLoading: isUpdateUserLoading } = useMutate()
  const { mutate: deleteUser, isLoading: isDeleteUserLoading } = useMutate()

  const createUserBody = useCallback(async () => {
    const { firstName, lastName, email, role, jurisdictions } = getValues()

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
    })()

    const validation = await trigger()

    if (!validation) return

    const roles = (() => ({
      isAdmin: role.includes(RoleOption.Administrator),
      isPartner: role.includes(RoleOption.Partner),
      isJurisdictionalAdmin: role.includes(RoleOption.JurisdictionalAdmin),
      userId: undefined,
    }))()

    const leasingAgentInListings = user_listings?.map((id) => ({ id })) || []

    let selectedJurisdictions = []
    if (Array.isArray(jurisdictions)) {
      selectedJurisdictions = jurisdictions.map((elem) => ({
        id: elem,
      }))
    } else if (jurisdictions) {
      selectedJurisdictions = [{ id: jurisdictions }]
    } else {
      selectedJurisdictions = jurisdictionOptions.map((elem) => ({ id: elem.id }))
    }

    const body = {
      firstName,
      lastName,
      email,
      roles,
      leasingAgentInListings: leasingAgentInListings,
      jurisdictions: selectedJurisdictions,
      agreedToTermsOfService: user?.agreedToTermsOfService ?? false,
    }

    return body
  }, [getValues, trigger, user?.agreedToTermsOfService, jurisdictionOptions])

  const onInvite = async () => {
    const body = await createUserBody()
    if (!body) return

    void sendInvite(() =>
      userService
        .invite({
          body,
        })
        .then(() => {
          setAlertMessage({ message: t(`users.inviteSent`), type: "success" })
        })
        .catch((e) => {
          if (e?.response?.status === 409) {
            setAlertMessage({ message: t(`errors.alert.emailConflict`), type: "alert" })
          } else {
            setAlertMessage({ message: t(`errors.alert.badRequest`), type: "alert" })
          }
        })
        .finally(() => {
          onDrawerClose()
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
          setAlertMessage({ message: t(`users.confirmationSent`), type: "success" })
        })
        .catch(() => {
          setAlertMessage({ message: t(`errors.alert.badRequest`), type: "alert" })
        })
        .finally(() => {
          onDrawerClose()
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
          setAlertMessage({ message: t(`users.userUpdated`), type: "success" })
        })
        .catch(() => {
          setAlertMessage({ message: t(`errors.alert.badRequest`), type: "alert" })
        })
        .finally(() => {
          onDrawerClose()
        })
    )
  }, [createUserBody, onDrawerClose, updateUser, userService, user, setAlertMessage])

  const onDelete = () => {
    void deleteUser(() =>
      userService
        .delete({
          body: {
            id: user.id,
          },
        })
        .then(() => {
          setAlertMessage({ message: t(`users.userDeleted`), type: "success" })
        })
        .catch(() => {
          setAlertMessage({ message: t(`errors.alert.badRequest`), type: "alert" })
        })
        .finally(() => {
          onDrawerClose()
          setDeleteModalActive(false)
        })
    )
  }

  return (
    <FormProvider {...methods}>
      <Form onSubmit={() => false}>
        <div className="border rounded-md p-8 bg-white">
          <GridSection
            title={
              <div className="flex content-center">
                <span>{t("users.userDetails")}</span>

                {mode === "edit" && (
                  <div className="ml-2 mt-1 flex items-center justify-center">
                    <Tag variant={user.confirmedAt ? "success" : "primary"}>
                      {user.confirmedAt ? t("users.confirmed") : t("users.unconfirmed")}
                    </Tag>
                  </div>
                )}
              </div>
            }
            columns={4}
          >
            <GridCell>
              <FieldValue label={t("authentication.createAccount.firstName")}>
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
              </FieldValue>
            </GridCell>

            <GridCell>
              <FieldValue label={t("authentication.createAccount.lastName")}>
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
              </FieldValue>
            </GridCell>

            <GridCell>
              <FieldValue label={t("t.email")}>
                <Field
                  id="email"
                  name="email"
                  label={t("t.email")}
                  placeholder={t("t.email")}
                  error={!!errors?.email}
                  errorMessage={t("authentication.signIn.loginError")}
                  validation={{ required: true, pattern: emailRegex }}
                  register={register}
                  type="email"
                  readerOnly
                />
              </FieldValue>
            </GridCell>

            <GridCell>
              <FieldValue label={t("t.role")}>
                <Select
                  id="role"
                  name="role"
                  label={t("t.role")}
                  placeholder={t("t.role")}
                  labelClassName="sr-only"
                  register={register}
                  controlClassName="control"
                  keyPrefix="users"
                  options={roleKeys
                    .filter((elem) => {
                      if (profile?.roles?.isJurisdictionalAdmin) {
                        return elem !== RoleOption.Administrator
                      }
                      return true
                    })
                    .sort((a, b) => (a < b ? -1 : 1))}
                  error={!!errors?.role}
                  errorMessage={t("errors.requiredFieldError")}
                  validation={{ required: true }}
                />
              </FieldValue>
            </GridCell>
          </GridSection>
          <JurisdictionAndListingSelection
            jurisdictionOptions={jurisdictionOptions}
            listingsOptions={listingsOptions}
          />
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
              dataTestId={"invite-user"}
            >
              {t("t.invite")}
            </Button>
          )}

          {!user?.confirmedAt && mode === "edit" && (
            <Button
              type="button"
              className="mx-1"
              onClick={() => onInviteResend()}
              loading={isResendConfirmationLoading}
            >
              {t("users.resendInvite")}
            </Button>
          )}

          {mode === "edit" && (
            <Button
              type="button"
              className="bg-opacity-0 text-alert"
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
            size={AppearanceSizeType.small}
          >
            {t("t.delete")}
          </Button>,
          <Button
            type="button"
            onClick={() => {
              setDeleteModalActive(false)
            }}
            size={AppearanceSizeType.small}
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        {t("users.doYouWantDeleteUser")}
      </Modal>
    </FormProvider>
  )
}

export { FormUserManage as default, FormUserManage }
