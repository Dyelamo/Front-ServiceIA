const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier");

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    ignores: ["dist/**", ".expo/**", "node_modules/**"],
    rules: {
      // React Native data-loading effects and self-scheduling callbacks are valid
      // patterns here, but these React Compiler rules currently flag them.
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);
