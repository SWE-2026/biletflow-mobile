// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    settings: {
      // Resolve the `@/*` path aliases from tsconfig.json.
      "import/resolver": {
        typescript: { project: `${__dirname}/tsconfig.json` },
      },
    },
  },
]);
