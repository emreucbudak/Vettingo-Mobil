const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const frameworkImports = [
  "react",
  "react/**",
  "react-native",
  "react-native/**",
  "expo",
  "expo-*",
  "@react-native-async-storage/**",
  "react-native-*",
];
const boundaries = (files, groups) => ({
  files,
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: groups,
            message:
              "Clean Architecture: depend on inner contracts; wire adapters in composition.",
          },
        ],
      },
    ],
  },
});
module.exports = defineConfig([
  expoConfig,
  { ignores: ["dist/**", "coverage/**"] },
  boundaries(
    ["src/domain/**/*.ts"],
    [
      ...frameworkImports,
      "**/application/**",
      "**/data/**",
      "**/infrastructure/**",
      "**/presentation/**",
      "**/composition/**",
      "**/app/**",
    ],
  ),
  boundaries(
    ["src/application/**/*.ts"],
    [
      ...frameworkImports,
      "**/data/**",
      "**/infrastructure/**",
      "**/presentation/**",
      "**/composition/**",
      "**/app/**",
    ],
  ),
  boundaries(
    ["src/data/**/*.ts", "src/infrastructure/**/*.ts"],
    [
      "**/application/**",
      "**/presentation/**",
      "**/composition/**",
      "**/app/**",
    ],
  ),
  boundaries(
    ["src/presentation/**/*.{ts,tsx}"],
    [
      "**/data/**",
      "**/infrastructure/**",
      "**/composition/**",
      "@react-native-async-storage/**",
      "expo-document-picker",
    ],
  ),
]);
