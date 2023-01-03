# Authentication

The [backend/core](./backend/core) service handles authentication for the bloom system using the
[auth module](backend/core/src/auth). Routes can then use
[Nest.js guards and Passport](ihttps://docs.nestjs.com/techniques/authentication#authentication) to guard individual
routes.

## Protect a Route

```typescript
// Module definition
import {
  // All modules implementing authentication guards must import `PassportModule`
  // providers, exports, controllers, etc.
  // Controller definition
  DefaultAuthGuard,
} from "src/auth/default.guard"

@Controller()
export class MyController {
  @UseGuards(DefaultAuthGuard)
  @Get("path")
  path() {
    // This route will be protected
  }
}
```

Using the `DefaultAuthGuard` in this way requires the client to provide a valid JWT token as an
`Access-Token Cookie` using the `access-token=<TOKEN>` format. Tokens are checked for a valid signature and
valid expiry time (currently 1 hour). Tokens may also be revoked by adding an entry to `revoked_tokens` table, or
using the auth route `revoke_token`.

## Obtain a token

To obtain an access token cookie, a user must first login. Currently, a Multifactor authenticating and email/password strategy is the only way to do this. A
client can `POST /auth/login` with body `{ username, password }`. This request will either return 401 or 200 with an access cookies attached in the response header.

To renew an access token, `POST /auth/requestNewToken` with an existing valid refresh cookie. That refresh cookie is also provided by the login process.

## Configuration

The app must be configured with an app secret to sign JWT tokens. In development, the app uses a hard-coded value, but
the app will throw an error in production mode if `APP_SECRET` is not provided as an environment variable.

# Front End Authentication/User Management

A few tools are provided to help handle authentication/users in the front end. These are collected under
`shared/ui-components/authentication`.

## AuthContext

`AuthContext` is a React Context that keeps track of the current user state and provides user and auth related utility
functions.

It provides:

```typescript
type ContextProps = {
  login: (email: string, password: string) => Promise<void>
  createUser: (user: UserCreateDto) => Promise<User>
  signOut: () => void
  // True when an API request is processing
  loading: boolean
  profile?: User
  accessToken?: string
  initialStateLoaded: boolean
}
```

The context is provided to a React App using `AuthProvider`, which in turn requires a `ConfigProvider` to function
properly:

```tsx
import { UserProvider, ConfigProvider } from "@bloom-housing/ui-components"

<ConfigProvider apiUrl={...}>
  <AuthProvider>
     {/* ...rest of app tree */}
  </AuthProvider>
</ConfigProvider>
```

`profile` and `accessToken` will be automatically populated if available. `accessToken` is stored in either Session
or Local storage depending on the config (default to session storage) and will be read on initial load. If the token
is current, the provider will attempt to fetch the user profile (and verify login status at the same time). The
provider also reads the token for the expiry and automatically schedules background updates to refresh the token
while the user remains signed in.

## useAuthenticatedClient

This is a convenience hook that allows a component to access a protected route on the API using an Axios client that
has been pre-configured to send an auth token to the API. It will return `undefined` if the user is not logged in.

```tsx
const authClient = useAuthenticatedClient()
if (authClient) {
  authClient.get("/protected-route")
}
```

This hook relies on access to the `AuthContext` and the `ConfigContext`, so it will not work if the component isn't
in a tree that has both of these providers.

## RequireLogin

This component waits for `UserProvider` to determine current login status before rendering its children. If no login
is found, the component will redirect to its `signInPath` component without rendering children. It can be configured
to require login for all paths other than `signInPath` (default), with an "allowlist" of paths to require login for
(`requireForRoutes`) or a "blocklist" of paths to skip authentication checks for (`skipForRoutes`). These props are
both lists of strings, and may contain RegEx strings.

```tsx
<RequireLogin signInPath="/sign-in">
  {/* will only render if logged in */}
</RequireLogin>

<RequireLogin signInPath="/sign-in" skipForRoutes={["/public/*", "/other-path"]}>
  {/* login not required for /public/* or /other-path */}
</RequireLogin>
```

## useRequireLoggedInUser

This is a hook that can be applied to protect a single component by requiring a login without modifying the full app
tree. It returns the logged in `User` if found, and `undefined` before the initial state has loaded. If no login is
found, it redirects to `signInPath`. This hook requires `UserProvider` to be defined on the app tree to work.

```typescript
const user = useRequireLoggedInUser("/sign-in")

// Make sure not to render the component before the user state has loaded
if (!user) {
  return null // or loading screen
}
```

# Authorization

For API authorization, we use a combination of Role Based Access Control (RBAC) and ABAC (Attribute Based Access
Control) implemented using the [casbin library](https://casbin.org/). We define authorizations in the context of
performing a given _action_ on _resource type_ as a _role_. Actions are strings defined in
[authz.service.ts](../backend/core/src/auth/authz.service.ts) as an enum `authzActions`.

For high-level Role-Based Access Control (RBAC), a Nest.js guard, `AuthzGuard` is provided. It can be defined on either
a controller or individual request handler (method) scope, although the former is probably a more common use case. It
should be used in conjunction with the `@ResourceType` decorator to specify what type of entity (e.g. `"application"`)
this controller/handler will be requesting access to. It then checks access to all the requests based on the current
loaded `req.user` (so it must run after a passport-based `AuthGuard` that loads the user onto the request object), the
`ResourceType`, and the requested action. The action is either automatically inferred from the request (e.g. a `PUT`
corresponds to `"update"`, `GET` corresponds to `"read"`, etc.), or can be specified on a per-handler basis using the
`@ResourceType("edit")` decorator.

The other method for enforcing authorization allows for per-object/attribute based access control (ABAC). In this mode,
we are checking specific attributes about the resource access is requested on, so it must be checked in the body of the
handler rather than as a guard (since the resource must be loaded from the DB). This is accomplished using the
`AuthzService.can` or `AuthzService.canOrThrow` methods.

The rules themselves are defined in [authz_policy.csv](../backend/core/src/auth/authz_policy.csv). Each line in this
CSV starting with `p` is a policy and follows the following format:

```
p, role, resourceType, evalRule, action
```

An example:

```
p, admin, application, true, .*
```

In this case, this specifies a policy applying to the `admin` role accessing `application` objects. `evalRule` is a
bit of arbitrary code that is evaluated by Casbin. See
[the docs](https://casbin.org/docs/en/abac#scaling-the-model-for-complex-and-large-number-of-abac-rules) for more
info on how this works. In this example, `true` simply will always evaluate to `true`. Finally, the action is a regex
-enabled matcher for the action verb requested - in this case a wildcard means that an admin can perform all actions.

A more complicated example:

```
p, user, application, !r.obj || (r.sub == r.obj.user_id), (read)|(update)|(delete)
```

In this case, the rules are for the `user` role (which is the default role for logged in users with no other
permissions), again on `application` objects. The first line, the `evalRule` is an expression that uses the
special variable `r.sub` (short for request.subject) to get the _subject_ of this request, which the Authorization
framework sets to the current `userId`. It checks this user id against the `user_id` attribute of `r.obj` (the
_object_ of this request). `r.obj` is an arbitrary Javascript object passed to the authorization framework during
the authorization call - note that it will _only_ work during ABAC (since during RBAC authorization we don't yet have
the database object loaded). The `!r.obj` at the start of this rule allows this rule to apply to RBAC _or_ ABAC,
depending on the context. Finally, the `actions` block is a regex union of `read`, `update` and `delete` actions.

For applications, we also have this line:

```
p, anonymous, application, true, create
```

This allows `anonymous` users (the default permission for non-logged-in users) to perform `create` operations on
`application` resources. Note that the way that the roles are defined is _hierarchical_ - any permissions that are
defined on "lower" level role are also granted to a "higher" role. In this case, both `user` and `admin` inherit all
permissions granted to `anonymous`, so this line also grants `create` permissions to both `user` and `admin` roles.

To define group hierarchies, add lines beginning with `g` to `authz_policy.csv`:

```
g, admin, user
g, user, anonymous
```

The first line denotes that `admin` inherits the `user` role. The second line grants `anonymous` permissions to the
`user` role (and by extension, the `admin` role).
