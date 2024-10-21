module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  parserOptions: {
    project: ["./tsconfig.json", "./sites/public/tsconfig.json", "./sites/partners/tsconfig.json"],
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    tsconfigRootDir: ".",
  },
  plugins: ["react", "@typescript-eslint"],
  extends: [
    "eslint:recommended", // the set of rules which are recommended for all projects by the ESLint Team
    "plugin:@typescript-eslint/eslint-recommended", // conflict resolution between above and below rulesets.
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "plugin:@typescript-eslint/recommended-requiring-type-checking", // additional rules that take a little longer to run
    "plugin:import/errors", // check for imports not resolving correctly
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:react-hooks/recommended", // Make sure we follow https://reactjs.org/docs/hooks-rules.html
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-var-requires": "off",
    "react/jsx-uses-vars": "warn",
    "react/jsx-uses-react": "warn",
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      {
        allowNumber: true,
        allowAny: true,
      },
    ],
    // These rules catches various usecases of variables typed as "any", since they won't be flagged by the TS
    // compiler and thus are potential sources of issues. The current codebase has too many uses of `any` to make
    // these effective rules though, so disabling them for now.
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/ban-ts-comment": "off",
  },
  ignorePatterns: [
    "node_modules",
    ".next",
    "dist",
    "api",
    "migration/",
    "**/.eslintrc.js",
    "doorway-ui-components",
    "tasks/import-listings",
    "sentry-example-page.js",
    "sentry-example-api.js",
  ],
}
