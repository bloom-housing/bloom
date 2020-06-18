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
