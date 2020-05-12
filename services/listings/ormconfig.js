
module.exports = {
  name: "default",
  type: "postgres",
  database: "bloom",
  cli: {
    migrationsDir: `services/listings/src/migrations`,
  },
  entities: [`${__dirname}/src/entity/*{.ts,.js}`],
  migrations: [`${__dirname}/src//migrations/*{.ts,.js}`],
  subscribers: [`${__dirname}/src/subscriber/*{.ts,.js}`],
}
