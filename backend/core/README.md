### Setting up a Database

Dev DB reseed:

```shell script
psql -c 'DROP DATABASE bloom;' && psql -c 'CREATE DATABASE bloom;' && yarn typeorm migration:run && yarn seed
```

Test DB reseed:

```shell script
psql -c 'DROP DATABASE bloom_test;' && psql -c 'CREATE DATABASE bloom_test;' && yarn typeorm-test migration:run && yarn test:seed
```

### Running Tests

End-to-end tests:

```shell script
yarn test:e2e
```

or a single module:

```shell script
yarn test:e2e test/user-applications
```
