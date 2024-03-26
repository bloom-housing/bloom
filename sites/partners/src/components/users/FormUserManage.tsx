import React, { useMemo, useContext, useState, useCallback } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { t, Form, Field, Select, useMutate, emailRegex, Modal } from "@bloom-housing/ui-components"
import { Button, Card, Grid, Tag } from "@bloom-housing/ui-seeds"
import { RoleOption, roleKeys, AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { Listing, User, UserRole } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { JurisdictionAndListingSelection } from "./JurisdictionAndListingSelection"
import SectionWithGrid from "../shared/SectionWithGrid"

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
  userRoles?: string
  user_listings?: string[]
  jurisdiction_all?: boolean
  jurisdictions?: string[]
}

const determineUserRole = (roles: UserRole) => {
  if (roles?.isAdmin) {
    return RoleOption.Administrator
  } else if (roles?.isJurisdictionalAdmin) {
    return RoleOption.JurisdictionalAdmin
  }
  return RoleOption.Partner
}

const FormUserManage = ({ mode, user, listings, onDrawerClose }: FormUserManageProps) => {
  const { userService, profile } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)
  const jurisdictionList = profile.jurisdictions

  const [isDeleteModalActive, setDeleteModalActive] = useState<boolean>(false)

  let defaultValues: FormUserManageValues = {}
  if (mode === "edit") {
    defaultValues = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userRoles: determineUserRole(user.userRoles),
      user_listings: user.listings?.map((item) => item.id) ?? [],
      jurisdiction_all: jurisdictionList.length === user.jurisdictions.length,
      jurisdictions: user.jurisdictions.map((elem) => elem.id),
    }
  } else if (profile?.userRoles?.isJurisdictionalAdmin) {
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
      if (jurisdictionalizedListings[listing.jurisdictions.id]) {
        // if the user has access to the jurisdiction
        jurisdictionalizedListings[listing.jurisdictions.id].push({
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
    const { firstName, lastName, email, userRoles, jurisdictions } = getValues()

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

    const roles = (() => {
      return {
        isAdmin: userRoles.includes(RoleOption.Administrator),
        isPartner: userRoles.includes(RoleOption.Partner),
        isJurisdictionalAdmin: userRoles.includes(RoleOption.JurisdictionalAdmin),
        userId: undefined,
      }
    })()

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
      userRoles: roles,
      listings: leasingAgentInListings,
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
          body: body,
        })
        .then(() => {
          addToast(t(`users.inviteSent`), { variant: "success" })
        })
        .catch((e) => {
          if (e?.response?.status === 409) {
            addToast(t(`errors.alert.emailConflict`), { variant: "alert" })
          } else {
            addToast(t(`errors.alert.badRequest`), { variant: "alert" })
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
          addToast(t(`users.confirmationSent`), { variant: "success" })
        })
        .catch(() => {
          addToast(t(`errors.alert.badRequest`), { variant: "alert" })
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
          body: body,
        })
        .then(() => {
          addToast(t(`users.userUpdated`), { variant: "success" })
        })
        .catch(() => {
          addToast(t(`errors.alert.badRequest`), { variant: "alert" })
        })
        .finally(() => {
          onDrawerClose()
        })
    )
  }, [createUserBody, onDrawerClose, updateUser, userService, user, addToast])

  const onDelete = () => {
    void deleteUser(() =>
      userService
        .delete({
          body: {
            id: user.id,
          },
        })
        .then(() => {
          addToast(t(`users.userDeleted`), { variant: "success" })
        })
        .catch(() => {
          addToast(t(`errors.alert.badRequest`), { variant: "alert" })
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
        <Card>
          <Card.Section>
            <SectionWithGrid
              heading={
                <div className="flex content-center">
                  <span>{t("users.userDetails")}</span>

                  {mode === "edit" && (
                    <div className="ml-2 mt-1 flex items-center justify-center">
                      <Tag
                        className="tag-uppercase"
                        variant={user.confirmedAt ? "success" : "primary"}
                      >
                        {user.confirmedAt ? t("users.confirmed") : t("users.unconfirmed")}
                      </Tag>
                    </div>
                  )}
                </div>
              }
            >
              <Grid.Row columns={4}>
                <Grid.Cell>
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
                  />
                </Grid.Cell>

                <Grid.Cell>
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
                  />
                </Grid.Cell>

                <Grid.Cell>
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
                  />
                </Grid.Cell>

                <Grid.Cell>
                  <Select
                    id="userRoles"
                    name="userRoles"
                    label={t("t.role")}
                    placeholder={t("t.role")}
                    register={register}
                    controlClassName="control"
                    keyPrefix="users"
                    options={roleKeys
                      .filter((elem) => {
                        if (profile?.userRoles?.isJurisdictionalAdmin) {
                          return elem !== RoleOption.Administrator
                        }
                        return true
                      })
                      .sort((a, b) => (a < b ? -1 : 1))}
                    error={!!errors?.userRoles}
                    errorMessage={t("errors.requiredFieldError")}
                    validation={{ required: true }}
                  />
                </Grid.Cell>
              </Grid.Row>
            </SectionWithGrid>
            <JurisdictionAndListingSelection
              jurisdictionOptions={jurisdictionOptions}
              listingsOptions={listingsOptions}
            />
          </Card.Section>
        </Card>

        <div className="mt-6">
          {mode === "edit" && (
            <Button
              type="button"
              className="mx-1"
              onClick={() => onSave()}
              variant="primary"
              loadingMessage={isUpdateUserLoading && t("t.formSubmitted")}
            >
              {t("t.save")}
            </Button>
          )}

          {mode === "add" && (
            <Button
              type="button"
              className="mx-1"
              onClick={() => onInvite()}
              variant="primary"
              loadingMessage={isSendInviteLoading && t("t.formSubmitted")}
              id={"invite-user"}
            >
              {t("t.invite")}
            </Button>
          )}

          {!user?.confirmedAt && mode === "edit" && (
            <Button
              type="button"
              className="mx-1"
              onClick={() => onInviteResend()}
              variant="primary-outlined"
              loadingMessage={isResendConfirmationLoading && t("t.formSubmitted")}
            >
              {t("users.resendInvite")}
            </Button>
          )}

          {mode === "edit" && (
            <Button
              type="button"
              className="bg-opacity-0 text-alert"
              onClick={() => setDeleteModalActive(true)}
              variant="text"
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
            variant="alert"
            loadingMessage={isDeleteUserLoading && t("t.formSubmitted")}
            onClick={() => {
              onDelete()
            }}
            size="sm"
          >
            {t("t.delete")}
          </Button>,
          <Button
            type="button"
            onClick={() => {
              setDeleteModalActive(false)
            }}
            variant="primary-outlined"
            size="sm"
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
