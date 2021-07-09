import { SnakeNamingStrategy } from "typeorm-naming-strategies"
import { join } from "path"
import { ConnectionOptions } from "typeorm"

// dotenv is a dev dependency, so conditionally import it (don't need it in Prod).
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv").config()
} catch {
  // Pass
}

export = {
  type: "postgres",
  url: process.env.TEST_DATABASE_URL || "postgres://localhost:5432/bloom_test",
  synchronize: true,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [
    // Needed to get a TS context on entity imports.
    // See
    // https://stackoverflow.com/questions/59435293/typeorm-entity-in-nestjs-cannot-use-import-statement-outside-a-module
    join(__dirname, "src/**", "*.entity.{js,ts}"),
  ],
  migrations: [join(__dirname, "src/migration", "*.{js,ts}")],
  subscribers: [join(__dirname, "src/subscriber", "*.{js,ts}")],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
} as ConnectionOptions
