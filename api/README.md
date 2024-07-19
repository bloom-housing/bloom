# Setup
## Installation
Make sure the .env file's db placement is what works for your set up, Then run the following:

```bash
$ yarn install
$ yarn prisma generate
$ yarn build
$ yarn db:setup:staging
```

These commands are also encapsulated in:
```bash
$ yarn setup
```

If you would prefer to have it setup with more realistic data you can run `yarn db:setup:staging` instead of `yarn db:setup`.

## Starting the application
In order to run the application you can run :
```bash
$ yarn start
```

or to run in watch mode run:
```bash
$ yarn dev
```

# Modifying the Schema

We use [Prisma](https://www.prisma.io/) as the ORM. To modify the schema you will need to work with the <b>schema.prisma</b> file. This file controls the following:
<ol>
  <li> The Structure of each model (entity if you are more familiar with TypeORM) </li>
  <li> The Relationships between models </li>
  <li> Enum creation for use in both the API and the database </li>
  <li> How Prisma connects to the database </li>
</ol>

You will need to:
1. Add the field in the DTO
2. Run `yarn generate:client` to add the type to the swagger file
3. Manually add the field to `schema.prisma`
4. Run `yarn prisma migrate dev --name <name of migration>` to create the migration file


## Conventions
We use the following conventions:
<ul>
  <li> model and enum names are capitalized camelcased (e.g. HelloWorld) </li>
  <li> model and enum names are <b>@@map()</b>ed to lowercase snakecased (e.g. hello_world) </li>
  <li> a model's fields are lowercase camelcased (e.g. helloWorld) </li>
  <li> a model's fields are <b>@map()</b>ed to lowercase snackcased (e.g. hello_world) </li>
</ul>
This is to make the api easier to work with, and to respect postgres's name space conventions.
<p></p>

# Controllers
Controllers are where backend endpoints are housed. They follow the [Nestjs standards](https://docs.nestjs.com/controllers)

They are housed under `/src/controllers`.

## Conventions
Controllers are given the extension `.contoller.ts` and the model name (listing, application, etc) is singular. So for example `listing.controller.ts`.

The exported class should be in capitalized camelcase (e.g. `ListingController`).

# DTOs
Data Transfer Objects. These are how we flag what fields endpoints will take in, and what the form of the response from the backend will be. 

We use the packages [class-transformer](https://www.npmjs.com/package/class-transformer) & [class-validator](https://www.npmjs.com/package/class-validator) for this.

They are housed under `src/dtos`, and are broken up by what model they are related too. There are also shared DTOs which are housed under the shared sub-directory.

## Conventions
DTOs are given the extension `.dto.ts` and the file name is lowercase kebabcase. 

So for example `listings-filter-params.dto.ts`.

The exported class should be in capitalized camelcase (e.g. `ListingFilterParams`) and does not include the DTO as a suffix.

# Enums
These are enums used by NestJs primarily for either taking in a request or sending out a response. Database enums (enums from Prisma) are part of the primsa schema and are not housed here.

They are housed under `src/enums` and the file name is lowercase kebabcase and end with `-enum.ts`. 

So for example `filter-key-enum.ts`.

## Conventions
The exported enum should be in capitalized camelcase (e.g. `ListingFilterKeys`).

# Modules
Modules connect the controllers to services and follow [NestJS standards](https://docs.nestjs.com/modules).

## Conventions
Modules are housed under `src/modules` and are given the extension `.module.ts`. The model name (listing, application, etc) is singular. So for example `listing.module.ts`.

The exported class should be in capitalized camelcase (e.g. `ListingModule`).

# Services
Services are where business logic is performed as well as interfacing with the database. 

Controllers should be calling functions in services in order to do their work.

The follow the [NestJS standards](https://docs.nestjs.com/providers).

## Conventions
Services are housed under `src/services` and are given the extension `.services.ts`. The model name (listing, application, etc) is singular. So for example `listing.service.ts`.

The exported class should be in capitalized camelcase (e.g. `ListingService`).

# Guards & Passport Strategies
We currently use guards for 2 purposes. Passport guards and Permissioning guards.

Passport guards (jwt.guard.ts, mfa.guard.ts, and optional.guard.ts) verify that the request is from a legitimate user. JwtAuthGuard does this by verifying the incoming jwt token (off the request's cookies) matches a user. MfaAuthGuard does this by verifying the incoming login information (email, password, mfaCode) matches a user's information. OptionalAuthGuard is used to allow requests from users not logged in through. It will still verify the user through the JwtAuthGuard if a user was logged in.

Passport guards are paired with a passport strategy (jwt.strategy.ts, and mfa.strategy.ts), this is where the code to actually verify the requester lives. 

Hopefully that makes sense, if not think of guards as customs agents, and the passport strategy is what the guards look for in a request to allow entry to a requester. Allowing them access the endpoint that the guard protects. 

[NestJS passport docs](https://docs.nestjs.com/recipes/passport)
[NestJS guards docs](https://docs.nestjs.com/guards)

Permissioning guards (permission.guard.ts, and user-profile-permission-guard.ts) verify that the requester has access to the resource and action they are trying to perform. For example a user that is not logged in (anonymous user) can submit applications, but cannot create listings. We leverage [Casbin](https://www.npmjs.com/package/casbin) to do user verification. 


# Testing
There are 2 different kinds of tests that the backend supports: Integration tests and Unit tests.

Integration Tests are tests that DO interface with the database, reading/writing/updating/deleting data from that database. 

Unit Tests are tests that MOCK interaction with the database, or test functionality directly that does not interact with the database.


## Integration Testing
Integration Tests are housed under `test/integration`, and files are given the extension `.e2e-spec.ts`.

These tests will generally test going through the controller's endpoints and will mock as little as possible. When testing the database should start off as empty and should be reset to empty once tests are completed (i.e. data is cleaned up).

## How to run integration tests
Running the following will run all integration tests:
```bash
$ yarn test:e2e
```

## Unit Testing
Unit Tests are housed under `test/unit`, and files are given the extension `.spec.ts`.

These tests will generally test the functions of a service, or helper functions.
These tests will mock Prisma and therefore will not interface directly with the database. This allows for verifying the correct business logic is performed without having to set up the database.

## How to run unit tests
Running the following will run all unit tests:
```bash
$ yarn test
```


## Testing with code coverage
We have set up both code coverage and code coverage benchmarks. These benchmarks must be met for your PR to pass CI checks. Test coverage is calculated against both the integration and unit test runs. You can run test coverage with the followig:
```bash
$ yarn test:cov
```


# Considerations For Detroit
As it stands right now `core` uses the AmiChart items column and `detroit` uses the AmiChartItem table.
As we move through converting detroit over to prisma we will unify those and choose one of the two approaches.