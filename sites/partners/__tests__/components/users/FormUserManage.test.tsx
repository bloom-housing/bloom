import React from "react"
import { screen, waitFor } from "@testing-library/react"
import {
  FeatureFlagEnum,
  Listing,
  User,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import { FormUserManage } from "../../../src/components/users/FormUserManage"
import { mockNextRouter, render } from "../../testUtils"
import userEvent from "@testing-library/user-event"
import { setupServer } from "msw/lib/node"
import { rest } from "msw"

const mockUser: User = {
  id: "123",
  email: "test@test.com",
  firstName: "Test",
  lastName: "User",
  dob: new Date("2020-01-01"),
  createdAt: new Date("2020-01-01"),
  updatedAt: new Date("2020-01-01"),
  jurisdictions: [],
  mfaEnabled: false,
  passwordUpdatedAt: new Date("2020-01-01"),
  passwordValidForDays: 180,
  agreedToTermsOfService: true,
  listings: [],
}

const adminUser: User = {
  ...mockUser,
  userRoles: { isAdmin: true },
}

const server = setupServer()

beforeAll(() => server.listen())

afterEach(() => {
  server.resetHandlers()
  window.sessionStorage.clear()
})

afterAll(() => server.close())

describe("<FormUserManage>", () => {
  beforeAll(() => {
    mockNextRouter()
  })
  describe("Add user", () => {
    describe("with jurisdictional admins enabled", () => {
      describe("as admin", () => {
        const adminUserWithJurisdictions = {
          ...adminUser,
          jurisdictions: [
            { id: "jurisdiction1", name: "jurisdictionWithJurisdictionAdmin", featureFlags: [] },
            { id: "jurisdiction2", name: "jurisdictionWithJurisdictionAdmin2", featureFlags: [] },
          ],
        }
        it("should invite an admin user", async () => {
          // Watch the invite call to make sure it's called
          const requestSpy = jest.fn()
          server.events.on("request:start", (request) => {
            if (request.method === "POST" && request.url.href.includes("invite")) {
              requestSpy(request.body)
            }
          })
          server.use(
            rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
              return res(ctx.json(adminUserWithJurisdictions))
            }),
            rest.post("http://localhost/api/adapter/user/invite", (_req, res, ctx) => {
              return res(ctx.json({ success: true }))
            })
          )
          const onCancel = jest.fn()
          const onDrawerClose = jest.fn()
          document.cookie = "access-token-available=True"

          render(
            <FormUserManage
              isOpen={true}
              title={t("users.addUser")}
              mode={"add"}
              listings={[]}
              onCancel={onCancel}
              onDrawerClose={onDrawerClose}
            />
          )

          await waitFor(() => screen.getByText("Administrator"))
          expect(screen.getByText("Add user")).toBeInTheDocument()
          expect(screen.getByText("User details")).toBeInTheDocument()
          expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
          expect(screen.getByRole("textbox", { name: "First name" })).toBeInTheDocument()
          expect(screen.getByRole("textbox", { name: "Last name" })).toBeInTheDocument()
          expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument()
          // "Role" select should have all four role option
          expect(screen.getByRole("combobox", { name: "Role" })).toBeInTheDocument()
          expect(screen.getByRole("option", { name: "Administrator" })).toBeInTheDocument()
          expect(screen.getByRole("option", { name: "Jurisdictional admin" })).toBeInTheDocument()
          expect(
            screen.getByRole("option", { name: "Jurisdictional admin - No PII" })
          ).toBeInTheDocument()
          expect(screen.getByRole("option", { name: "Partner" })).toBeInTheDocument()
          expect(screen.getByRole("button", { name: "Invite" })).toBeInTheDocument()
          await userEvent.type(screen.getByRole("textbox", { name: "First name" }), "firstName")
          await userEvent.type(screen.getByRole("textbox", { name: "Last name" }), "lastName")
          await userEvent.type(screen.getByRole("textbox", { name: "Email" }), "email@example.com")
          await userEvent.selectOptions(
            screen.getByRole("combobox", { name: "Role" }),
            screen.getByRole("option", { name: "Administrator" })
          )
          await userEvent.click(screen.getByRole("button", { name: "Invite" }))
          await waitFor(() => {
            expect(requestSpy).toHaveBeenCalledWith({
              firstName: "firstName",
              lastName: "lastName",
              email: "email@example.com",
              userRoles: {
                isAdmin: true,
                isPartner: false,
                isJurisdictionalAdmin: false,
                isLimitedJurisdictionalAdmin: false,
                isSupportAdmin: false,
              },
              listings: [],
              jurisdictions: [{ id: "jurisdiction1" }, { id: "jurisdiction2" }],
              agreedToTermsOfService: false,
            })
          })
          await waitFor(() => expect(onDrawerClose).toBeCalled())
        })

        it("should invite a jurisdictional admin user", async () => {
          // Watch the invite call to make sure it's called
          const requestSpy = jest.fn()
          server.events.on("request:start", (request) => {
            if (request.method === "POST" && request.url.href.includes("invite")) {
              requestSpy(request.body)
            }
          })
          server.use(
            rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
              return res(ctx.json(adminUserWithJurisdictions))
            }),
            rest.post("http://localhost/api/adapter/user/invite", (_req, res, ctx) => {
              return res(ctx.json({ success: true }))
            })
          )
          const onCancel = jest.fn()
          const onDrawerClose = jest.fn()
          document.cookie = "access-token-available=True"

          render(
            <FormUserManage
              isOpen={true}
              title={t("users.addUser")}
              mode={"add"}
              listings={[]}
              onCancel={onCancel}
              onDrawerClose={onDrawerClose}
            />
          )

          await waitFor(() => screen.getByText("Jurisdictional admin"))
          // "Role" select should have all three role option
          expect(screen.getByRole("combobox", { name: "Role" })).toBeInTheDocument()
          expect(screen.getByRole("option", { name: "Administrator" })).toBeInTheDocument()
          expect(screen.getByRole("option", { name: "Jurisdictional admin" })).toBeInTheDocument()
          expect(
            screen.getByRole("option", { name: "Jurisdictional admin - No PII" })
          ).toBeInTheDocument()
          expect(screen.getByRole("option", { name: "Partner" })).toBeInTheDocument()
          await userEvent.type(screen.getByRole("textbox", { name: "First name" }), "firstName")
          await userEvent.type(screen.getByRole("textbox", { name: "Last name" }), "lastName")
          await userEvent.type(screen.getByRole("textbox", { name: "Email" }), "eamil@example.com")
          await userEvent.selectOptions(
            screen.getByRole("combobox", { name: "Role" }),
            screen.getByRole("option", { name: "Jurisdictional admin" })
          )
          await userEvent.click(screen.getByRole("button", { name: "Invite" }))
          expect(screen.getByText("This field is required"))
          // Should display both jurisdiction options
          expect(
            screen.getByRole("option", { name: "jurisdictionWithJurisdictionAdmin" })
          ).toBeInTheDocument()
          expect(
            screen.getByRole("option", { name: "jurisdictionWithJurisdictionAdmin2" })
          ).toBeInTheDocument()
          await userEvent.selectOptions(
            screen.getByRole("combobox", { name: "Jurisdiction" }),
            screen.getByRole("option", { name: "jurisdictionWithJurisdictionAdmin" })
          )
          await userEvent.click(screen.getByRole("button", { name: "Invite" }))
          await waitFor(() => {
            expect(requestSpy).toHaveBeenCalledWith({
              firstName: "firstName",
              lastName: "lastName",
              email: "eamil@example.com",
              userRoles: {
                isAdmin: false,
                isPartner: false,
                isJurisdictionalAdmin: true,
                isLimitedJurisdictionalAdmin: false,
                isSupportAdmin: false,
              },
              listings: [],
              jurisdictions: [{ id: "jurisdiction1" }],
              agreedToTermsOfService: false,
            })
          })
          await waitFor(() => expect(onDrawerClose).toBeCalled())
        })

        it("should invite a partner user", async () => {
          // Watch the invite call to make sure it's called
          const requestSpy = jest.fn()
          server.events.on("request:start", (request) => {
            if (request.method === "POST" && request.url.href.includes("invite")) {
              requestSpy(request.body)
            }
          })
          server.use(
            rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
              return res(ctx.json(adminUserWithJurisdictions))
            }),
            rest.post("http://localhost/api/adapter/user/invite", (_req, res, ctx) => {
              return res(ctx.json({ success: true }))
            })
          )
          const onCancel = jest.fn()
          const onDrawerClose = jest.fn()
          document.cookie = "access-token-available=True"

          render(
            <FormUserManage
              isOpen={true}
              title={t("users.addUser")}
              mode={"add"}
              listings={[
                { id: "id1", name: "listing1", jurisdictions: { id: "jurisdiction1" } } as Listing,
                { id: "id2", name: "listing2", jurisdictions: { id: "jurisdiction1" } } as Listing,
                { id: "id3", name: "listing3", jurisdictions: { id: "jurisdiction1" } } as Listing,
              ]}
              onCancel={onCancel}
              onDrawerClose={onDrawerClose}
            />
          )

          await waitFor(() => screen.getByText("Jurisdictional admin"))
          // "Role" select should have all four role option
          expect(screen.getByRole("combobox", { name: "Role" })).toBeInTheDocument()
          expect(screen.getByRole("option", { name: "Administrator" })).toBeInTheDocument()
          expect(screen.getByRole("option", { name: "Jurisdictional admin" })).toBeInTheDocument()
          expect(
            screen.getByRole("option", { name: "Jurisdictional admin - No PII" })
          ).toBeInTheDocument()
          expect(screen.getByRole("option", { name: "Partner" })).toBeInTheDocument()
          await userEvent.type(screen.getByRole("textbox", { name: "First name" }), "firstName")
          await userEvent.type(screen.getByRole("textbox", { name: "Last name" }), "lastName")
          await userEvent.type(screen.getByRole("textbox", { name: "Email" }), "email@example.com")
          await userEvent.selectOptions(
            screen.getByRole("combobox", { name: "Role" }),
            screen.getByRole("option", { name: "Partner" })
          )
          await userEvent.click(screen.getByRole("button", { name: "Invite" }))
          expect(screen.getByText("This field is required"))
          // Should display both jurisdiction options as checkboxes
          expect(
            screen.getByRole("checkbox", { name: "jurisdictionWithJurisdictionAdmin" })
          ).toBeInTheDocument()
          expect(
            screen.getByRole("checkbox", { name: "jurisdictionWithJurisdictionAdmin2" })
          ).toBeInTheDocument()
          await userEvent.click(
            screen.getByRole("checkbox", { name: "jurisdictionWithJurisdictionAdmin" })
          )
          await waitFor(() => screen.getByText("jurisdictionWithJurisdictionAdmin listings"))
          await userEvent.click(screen.getByRole("checkbox", { name: "listing1" }))
          await userEvent.click(screen.getByRole("checkbox", { name: "listing3" }))
          await userEvent.click(screen.getByRole("button", { name: "Invite" }))
          await waitFor(() => {
            expect(requestSpy).toHaveBeenCalledWith({
              firstName: "firstName",
              lastName: "lastName",
              email: "email@example.com",
              userRoles: {
                isAdmin: false,
                isPartner: true,
                isJurisdictionalAdmin: false,
                isLimitedJurisdictionalAdmin: false,
                isSupportAdmin: false,
              },
              listings: [{ id: "id1" }, { id: "id3" }],
              jurisdictions: [{ id: "jurisdiction1" }],
              agreedToTermsOfService: false,
            })
          })
          await waitFor(() => expect(onDrawerClose).toBeCalled())
        })
      })
      describe("as jurisdictional admin", () => {
        const jurisAdminUserWithJurisdictions = {
          ...mockUser,
          userRoles: { isJurisdictionalAdmin: true },
          jurisdictions: [
            { id: "jurisdiction1", name: "jurisdictionWithJurisdictionAdmin", featureFlags: [] },
          ],
        }
        it("should only be able to select jurisdictional admin or partner", async () => {
          server.use(
            rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
              return res(ctx.json(jurisAdminUserWithJurisdictions))
            }),
            rest.post("http://localhost/api/adapter/user/invite", (_req, res, ctx) => {
              return res(ctx.json({ success: true }))
            })
          )
          const onCancel = jest.fn()
          const onDrawerClose = jest.fn()
          document.cookie = "access-token-available=True"

          render(
            <FormUserManage
              isOpen={true}
              title={t("users.addUser")}
              mode={"add"}
              listings={[]}
              onCancel={onCancel}
              onDrawerClose={onDrawerClose}
            />
          )
          await waitFor(() => screen.getByText("Jurisdictional admin"))
          expect(screen.queryByRole("option", { name: "Administrator" })).not.toBeInTheDocument()
          expect(screen.getByRole("option", { name: "Jurisdictional admin" })).toBeInTheDocument()
          expect(
            screen.getByRole("option", { name: "Jurisdictional admin - No PII" })
          ).toBeInTheDocument()
          expect(screen.getByRole("option", { name: "Partner" })).toBeInTheDocument()
        })
      })
    })

    describe("with jurisdictional admins disabled", () => {
      it("should show jurisdictional admin, but only for one jurisdiction", async () => {
        const adminUserWithJurisdictionsAndOneDisabled = {
          ...adminUser,
          jurisdictions: [
            {
              id: "jurisdiction1",
              name: "jurisdictionWithJurisdictionAdmin",
              featureFlags: [{ name: FeatureFlagEnum.disableJurisdictionalAdmin, active: true }],
            },
            { id: "jurisdiction2", name: "jurisdictionWithJurisdictionAdmin2", featureFlags: [] },
          ],
        }
        server.use(
          rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
            return res(ctx.json(adminUserWithJurisdictionsAndOneDisabled))
          }),
          rest.post("http://localhost/api/adapter/user/invite", (_req, res, ctx) => {
            return res(ctx.json({ success: true }))
          })
        )
        const onCancel = jest.fn()
        const onDrawerClose = jest.fn()
        document.cookie = "access-token-available=True"

        render(
          <FormUserManage
            isOpen={true}
            title={t("users.addUser")}
            mode={"add"}
            listings={[]}
            onCancel={onCancel}
            onDrawerClose={onDrawerClose}
          />
        )

        await waitFor(() => screen.getByText("Administrator"))
        expect(screen.getByText("Add user")).toBeInTheDocument()
        expect(screen.getByText("User details")).toBeInTheDocument()
        // "Role" select should have all three role option
        expect(screen.getByRole("combobox", { name: "Role" })).toBeInTheDocument()
        expect(screen.getByRole("option", { name: "Administrator" })).toBeInTheDocument()
        expect(screen.getByRole("option", { name: "Jurisdictional admin" })).toBeInTheDocument()
        expect(
          screen.getByRole("option", { name: "Jurisdictional admin - No PII" })
        ).toBeInTheDocument()
        expect(screen.getByRole("option", { name: "Partner" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Invite" })).toBeInTheDocument()
        await userEvent.selectOptions(
          screen.getByRole("combobox", { name: "Role" }),
          screen.getByRole("option", { name: "Jurisdictional admin" })
        )
        expect(
          screen.getByRole("option", { name: "jurisdictionWithJurisdictionAdmin2" })
        ).toBeInTheDocument()
        expect(
          screen.queryAllByRole("option", { name: "jurisdictionWithJurisdictionAdmin" })
        ).toHaveLength(0)
      })

      it("should not show jurisdictional admin if all have it disabled", async () => {
        const adminUserWithJurisdictionsAndAllDisabled = {
          ...adminUser,
          jurisdictions: [
            {
              id: "jurisdiction1",
              name: "jurisdictionWithJurisdictionAdmin",
              featureFlags: [{ name: FeatureFlagEnum.disableJurisdictionalAdmin, active: true }],
            },
            {
              id: "jurisdiction2",
              name: "jurisdictionWithJurisdictionAdmin2",
              featureFlags: [{ name: FeatureFlagEnum.disableJurisdictionalAdmin, active: true }],
            },
          ],
        }
        server.use(
          rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
            return res(ctx.json(adminUserWithJurisdictionsAndAllDisabled))
          }),
          rest.post("http://localhost/api/adapter/user/invite", (_req, res, ctx) => {
            return res(ctx.json({ success: true }))
          })
        )
        const onCancel = jest.fn()
        const onDrawerClose = jest.fn()
        document.cookie = "access-token-available=True"

        render(
          <FormUserManage
            isOpen={true}
            title={t("users.addUser")}
            mode={"add"}
            listings={[]}
            onCancel={onCancel}
            onDrawerClose={onDrawerClose}
          />
        )

        await waitFor(() => screen.getByText("Administrator"))
        expect(screen.getByText("Add user")).toBeInTheDocument()
        expect(screen.getByText("User details")).toBeInTheDocument()
        // "Role" select should not have Jurisdictional admin
        expect(screen.getByRole("combobox", { name: "Role" })).toBeInTheDocument()
        expect(screen.getByRole("option", { name: "Administrator" })).toBeInTheDocument()
        expect(screen.getByRole("option", { name: "Partner" })).toBeInTheDocument()
        expect(
          screen.queryByRole("option", { name: "Jurisdictional admin" })
        ).not.toBeInTheDocument()
        expect(
          screen.queryByRole("option", { name: "Jurisdictional Admin - No PII" })
        ).not.toBeInTheDocument()
      })
    })

    describe("enableSupportAdmin", () => {
      it("should not show support admin role when feature flag not enabled", async () => {
        const adminUserWithJurisdictionsAndAllDisabled = {
          ...adminUser,
          jurisdictions: [
            {
              id: "jurisdiction1",
              name: "jurisdictionWithoutSupportAdmin",
            },
            {
              id: "jurisdiction2",
              name: "jurisdictionWithoutSupportAdmin2",
            },
          ],
        }
        server.use(
          rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
            return res(ctx.json(adminUserWithJurisdictionsAndAllDisabled))
          }),
          rest.post("http://localhost/api/adapter/user/invite", (_req, res, ctx) => {
            return res(ctx.json({ success: true }))
          })
        )
        const onCancel = jest.fn()
        const onDrawerClose = jest.fn()
        document.cookie = "access-token-available=True"

        render(
          <FormUserManage
            isOpen={true}
            title={t("users.addUser")}
            mode={"add"}
            listings={[]}
            onCancel={onCancel}
            onDrawerClose={onDrawerClose}
          />
        )

        await waitFor(() => screen.getByText("Administrator"))
        expect(screen.getByText("Add user")).toBeInTheDocument()
        expect(screen.getByText("User details")).toBeInTheDocument()
        // "Role" select should not have Support Admin
        expect(screen.getByRole("combobox", { name: "Role" })).toBeInTheDocument()
        expect(screen.getByRole("option", { name: "Administrator" })).toBeInTheDocument()
        expect(screen.getByRole("option", { name: "Partner" })).toBeInTheDocument()
        expect(screen.queryByRole("option", { name: "Admin (support)" })).not.toBeInTheDocument()
      })

      it("should show support admin role when feature flag enabled", async () => {
        const adminUserWithJurisdictionsAndOneEnabled = {
          ...adminUser,
          jurisdictions: [
            {
              id: "jurisdiction1",
              name: "jurisdictionWithSupportAdmin",
            },
            {
              id: "jurisdiction2",
              name: "jurisdictionWithSupportAdmin2",
              featureFlags: [{ name: FeatureFlagEnum.enableSupportAdmin, active: true }],
            },
          ],
        }
        server.use(
          rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
            return res(ctx.json(adminUserWithJurisdictionsAndOneEnabled))
          }),
          rest.post("http://localhost/api/adapter/user/invite", (_req, res, ctx) => {
            return res(ctx.json({ success: true }))
          })
        )
        const onCancel = jest.fn()
        const onDrawerClose = jest.fn()
        document.cookie = "access-token-available=True"

        render(
          <FormUserManage
            isOpen={true}
            title={t("users.addUser")}
            mode={"add"}
            listings={[]}
            onCancel={onCancel}
            onDrawerClose={onDrawerClose}
          />
        )

        await waitFor(() => screen.getByText("Administrator"))
        expect(screen.getByText("Add user")).toBeInTheDocument()
        expect(screen.getByText("User details")).toBeInTheDocument()
        // "Role" select should not Support Admin
        expect(screen.getByRole("combobox", { name: "Role" })).toBeInTheDocument()
        expect(screen.queryByRole("option", { name: "Admin (support)" })).toBeInTheDocument()
        expect(screen.getByRole("option", { name: "Administrator" })).toBeInTheDocument()
        expect(screen.getByRole("option", { name: "Partner" })).toBeInTheDocument()
      })
    })
  })

  describe("Edit User", () => {
    const adminUserWithJurisdictions = {
      ...adminUser,
      jurisdictions: [
        { id: "jurisdiction1", name: "jurisdictionWithJurisdictionAdmin", featureFlags: [] },
        { id: "jurisdiction2", name: "jurisdictionWithJurisdictionAdmin2", featureFlags: [] },
      ],
    }
    it("should update a partner user and their listings", async () => {
      // Watch the update call to make sure it's called
      const requestSpy = jest.fn()
      server.events.on("request:start", (request) => {
        if (request.method === "PUT" && request.url.href.includes("user/%7Bid%7D")) {
          requestSpy(request.body)
        }
      })
      server.use(
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(ctx.json(adminUserWithJurisdictions))
        }),
        rest.put("http://localhost/api/adapter/user/%7Bid%7D", (_req, res, ctx) => {
          return res(ctx.json({ success: true }))
        })
      )
      const onCancel = jest.fn()
      const onDrawerClose = jest.fn()
      document.cookie = "access-token-available=True"

      render(
        <FormUserManage
          isOpen={true}
          title={t("users.editUser")}
          mode={"edit"}
          user={
            {
              id: "existingUserId",
              firstName: "existingFirstName",
              lastName: "existingLastName",
              email: "existingEmail@email.com",
              userRoles: { isPartner: true },
              jurisdictions: [{ id: "jurisdiction1" }],
              listings: [
                { id: "id1", name: "listing1" },
                { id: "id2", name: "listing2" },
              ],
            } as User
          }
          listings={[
            { id: "id1", name: "listing1", jurisdictions: { id: "jurisdiction1" } } as Listing,
            { id: "id2", name: "listing2", jurisdictions: { id: "jurisdiction1" } } as Listing,
            { id: "id3", name: "listing3", jurisdictions: { id: "jurisdiction1" } } as Listing,
          ]}
          onCancel={onCancel}
          onDrawerClose={onDrawerClose}
        />
      )

      await waitFor(() => screen.getByText("Administrator"))
      expect(screen.getByText("Edit user")).toBeInTheDocument()
      expect(screen.getByText("User details")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: "First name" })).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: "Last name" })).toBeInTheDocument()
      expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Resend invite" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument()
      // "Role" select should have all three role option
      expect(screen.getByRole("combobox", { name: "Role" })).toBeInTheDocument()
      expect(screen.getByRole("option", { name: "Administrator" })).toBeInTheDocument()
      expect(screen.getByRole("option", { name: "Jurisdictional admin" })).toBeInTheDocument()
      expect(screen.getByRole("option", { name: "Partner" })).toBeInTheDocument()
      // Jurisdiction options
      expect(
        screen.getByRole("checkbox", { name: "jurisdictionWithJurisdictionAdmin" })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("checkbox", { name: "jurisdictionWithJurisdictionAdmin2" })
      ).toBeInTheDocument()
      // Listing options with the correct listings preselected
      expect(screen.getByRole("checkbox", { name: "listing1", checked: true })).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "listing2", checked: true })).toBeInTheDocument()
      expect(screen.getByRole("checkbox", { name: "listing3", checked: false })).toBeInTheDocument()
      // Select and unselect listings
      await userEvent.click(screen.getByRole("checkbox", { name: "listing3" }))
      await userEvent.click(screen.getByRole("checkbox", { name: "listing2" }))
      await userEvent.click(screen.getByRole("button", { name: "Save" }))
      await waitFor(() => {
        expect(requestSpy).toHaveBeenCalledWith({
          id: "existingUserId",
          firstName: "existingFirstName",
          lastName: "existingLastName",
          email: "existingEmail@email.com",
          userRoles: {
            isAdmin: false,
            isPartner: true,
            isJurisdictionalAdmin: false,
            isLimitedJurisdictionalAdmin: false,
            isSupportAdmin: false,
          },
          listings: [{ id: "id1" }, { id: "id3" }],
          jurisdictions: [{ id: "jurisdiction1" }],
          agreedToTermsOfService: false,
        })
      })
      await waitFor(() => expect(onDrawerClose).toBeCalled())
    })

    it("should resend invite", async () => {
      // Watch the resend invite call to make sure it's called
      const requestSpy = jest.fn()
      server.events.on("request:start", (request) => {
        if (request.method === "POST" && request.url.href.includes("resend-partner-confirmation")) {
          requestSpy(request.body)
        }
      })
      server.use(
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(ctx.json(adminUserWithJurisdictions))
        }),
        rest.post(
          "http://localhost/api/adapter/user/resend-partner-confirmation",
          (_req, res, ctx) => {
            return res(ctx.json({ success: true }))
          }
        )
      )
      const onCancel = jest.fn()
      const onDrawerClose = jest.fn()
      document.cookie = "access-token-available=True"

      render(
        <FormUserManage
          isOpen={true}
          title={t("users.editUser")}
          mode={"edit"}
          user={
            {
              id: "existingUserId",
              firstName: "existingFirstName",
              lastName: "existingLastName",
              email: "existingEmail@email.com",
              userRoles: { isPartner: true },
              jurisdictions: [{ id: "jurisdiction1" }],
              listings: [
                { id: "id1", name: "listing1" },
                { id: "id2", name: "listing2" },
              ],
            } as User
          }
          listings={[
            { id: "id1", name: "listing1", jurisdictions: { id: "jurisdiction1" } } as Listing,
            { id: "id2", name: "listing2", jurisdictions: { id: "jurisdiction1" } } as Listing,
            { id: "id3", name: "listing3", jurisdictions: { id: "jurisdiction1" } } as Listing,
          ]}
          onCancel={onCancel}
          onDrawerClose={onDrawerClose}
        />
      )

      await waitFor(() => screen.getByText("Administrator"))
      // Select and unselect listings
      await userEvent.click(screen.getByRole("button", { name: "Resend invite" }))
      await waitFor(() => {
        expect(requestSpy).toHaveBeenCalledWith({
          appUrl: "http://localhost",
          email: "existingEmail@email.com",
        })
      })
      await waitFor(() => expect(onDrawerClose).toBeCalled())
    })

    it("should delete user", async () => {
      // Watch the invite call to make sure it's called
      const requestSpy = jest.fn()
      server.events.on("request:start", (request) => {
        if (request.method === "DELETE") {
          requestSpy(request.body)
        }
      })
      server.use(
        rest.get("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(ctx.json(adminUserWithJurisdictions))
        }),
        rest.delete("http://localhost/api/adapter/user", (_req, res, ctx) => {
          return res(ctx.json({ success: true }))
        })
      )
      const onCancel = jest.fn()
      const onDrawerClose = jest.fn()
      document.cookie = "access-token-available=True"

      render(
        <FormUserManage
          isOpen={true}
          title={t("users.editUser")}
          mode={"edit"}
          user={
            {
              id: "existingUserId",
              firstName: "existingFirstName",
              lastName: "existingLastName",
              email: "existingEmail@email.com",
              userRoles: { isPartner: true },
              jurisdictions: [{ id: "jurisdiction1" }],
              listings: [
                { id: "id1", name: "listing1" },
                { id: "id2", name: "listing2" },
              ],
            } as User
          }
          listings={[
            { id: "id1", name: "listing1", jurisdictions: { id: "jurisdiction1" } } as Listing,
            { id: "id2", name: "listing2", jurisdictions: { id: "jurisdiction1" } } as Listing,
            { id: "id3", name: "listing3", jurisdictions: { id: "jurisdiction1" } } as Listing,
          ]}
          onCancel={onCancel}
          onDrawerClose={onDrawerClose}
        />
      )

      await waitFor(() => screen.getByText("Administrator"))
      // Click first delete button
      await userEvent.click(screen.getByRole("button", { name: "Delete" }))
      await waitFor(() => screen.getByText("Do you really want to delete this user?"))
      // Hit confirmation
      await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[1])
      await waitFor(() => expect(onDrawerClose).toBeCalled())
      await waitFor(() => {
        expect(requestSpy).toHaveBeenCalledWith({
          id: "existingUserId",
        })
      })
    })
  })
})
