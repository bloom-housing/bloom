# Bloom Core

This package holds the core Typescript interfaces for the Bloom affordable housing system.

# Generating frontend client (src/backend-swagger.ts)

1. Start backend locally e.g. on localhost:3100. From root directory run:
```shell script
cd backend/core && yarn dev
```
Now http://localhost:3100/docs-json should contain OpenAPI 3.0 JSON schema. Check if it's true. 

2. Run `yarn generate:client` and commit changes to `src/backend-swagger.ts`. For local development you are fine now, new interfaces are available to `apps/`.
3. (Optional) If you want to publish those changes (so that they are available not only on local dev environment but also for production containers) you need to run `lerna publish` from the root directory. 
