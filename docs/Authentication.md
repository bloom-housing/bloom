# Authentication

The [backend/core](./backend/core) service handles authentication for the bloom system using the
[auth module](backend/core/src/auth). Routes can then use
[Nest.js guards and Passport](ihttps://docs.nestjs.com/techniques/authentication#authentication) to guard individual
routes.

## Protect a Route

```typescript
// Module definition
@Module({
  // All modules implementing authentication guards must import `PassportModule`
  imports: [PassportModule, ...others],
  // providers, exports, controllers, etc.
})

// Controller definition
import { DefaultAuthGuard } from "src/auth/default.guard"

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
`Authentication` header using the standard `Bearer <TOKEN>` format. Tokens are checked for a valid signature and
valid expiry time (currently 10 minutes). Tokens may also be revoked by adding an entry to `revoked_tokens` table, or
using the auth route `revoke_token`.


## Obtain a token

To obtain a token, a user must first login. Currently, an email/password strategy is the only way to do this. A
client can `POST /auth/login` with body `{ username, password }`. This request will either return 401 or 200 with an
object containing `accessToken`.

To renew a token, `POST /auth/token` with an existing valid token.

## Registration

A user may register using `POST /auth/register`. The app validates the user object, and if creation is successful, the
resulting user will be returned along with a valid `accessToken`.

## Configuration

The app must be configured with an app secret to sign JWT tokens. In development, the app uses a hard-coded value, but
the app will throw an error in production mode if `APP_SECRET` is not provided as an environment variable.


# Front End Authentication/User Management

A few tools are provided to help handle authentication/users in the front end. These are collected under 
`shared/ui-components/authentication`. 

## UserContext

`UserContext` is a React Context that keeps track of the current user state and provides user-related utility
functions.

It provides:

```typescript
type ContextProps = {
  login: (email: string, password: string) => Promise<void>
  createUser: (user: CreateUserDto) => Promise<User>
  signOut: () => void
  // True when an API request is processing
  loading: boolean
  profile?: User
  accessToken?: string
  initialStateLoaded: boolean
}
```

The context is provided to a React App using `UserProvider`, which in turn requires a `ConfigProvider` to function
properly:

```tsx
import { UserProvider, ConfigProvider } from "@bloom-housing/ui-components"

<ConfigProvider apiUrl={...}>
  <UserProvider>
     {/* ...rest of app tree */}
  </UserProvider>
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
const authClient = useAuthenticatedClient();
if (authClient) {
  authClient.get('/protected-route')
}
```

This hook relies on access to the `UserContext` and the `ConfigContext`, so it will not work if the component isn't
in a tree that has both of these providers.

## RequireLogin

This component waits for `UserProvider` to determine current login status before rendering its children. If no login
is found, the component will redirect to its `signInPath` component without rendering children. It can be configured
to require login for all paths other than `signInPath` (default), with a "whitelist" of paths to require login for
(`requireForRoutes`) or a "blacklist" of paths to skip authentication checks for (`skipForRoutes`). These props are
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
