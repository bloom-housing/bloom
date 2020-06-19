import { SnakeNamingStrategy } from "typeorm-naming-strategies"
import { join } from "path"

// dotenv is a dev dependency, so conditionally import it (don't need it in Prod).
try {
  require("dotenv").config()
} catch {
  // Pass
}

const defaultConnectionForEnv = {
  development: {
    host: "localhost",
    port: 5432,
    database: "bloom",
  },
}

const env = process.env.NODE_ENV || "development"

// If we have a DATABASE_URL, use that
const connectionInfo = process.env.DATABASE_URL
  ? { url: process.env.DATABASE_URL }
  : defaultConnectionForEnv[env]

// Unfortunately, we need to use CommonJS/AMD style exports rather than ES6-style modules for this due to how
// TypeORM expects the config to be available.
export = {
  type: "postgres",
  ...connectionInfo,
  // We don't want to auto-synchronize production data - we should deliberately run migrations.
  synchronize: env === "development",
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [
    // Needed to get a TS context on entity imports.
    // See
    // https://stackoverflow.com/questions/59435293/typeorm-entity-in-nestjs-cannot-use-import-statement-outside-a-module
    join(__dirname, "src/entity/**", "*.ts"),
  ],
  migrations: [join(__dirname, "src/migration/**", "*.ts")],
  subscribers: [join(__dirname, "src/subscriber/**", "*.ts")],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
}
