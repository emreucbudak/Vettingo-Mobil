const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const frameworks = [
  "react",
  "react/**",
  "react-native",
  "react-native/**",
  "expo",
  "expo-*",
  "@expo/**",
  "@react-native/**",
  "@react-navigation/**",
  "@react-native-async-storage/**",
  "react-native-*",
];
const outerLayers = [
  "**/data/**",
  "**/infrastructure/**",
  "**/presentation/**",
  "**/composition/**",
  "**/app/**",
];
const domainRestrictions = [...frameworks, ...outerLayers, "**/application/**"];
const applicationRestrictions = [...frameworks, ...outerLayers];
const boundaries = (files, group) => ({
  files,
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group,
            message:
              "Feature-first Clean Architecture: keep inward dependencies and wire adapters in composition.",
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
    ["src/core/domain/**/*.ts", "src/shared/domain/**/*.ts"],
    domainRestrictions,
  ),
  boundaries(
    ["src/features/*/domain/**/*.ts"],
    [...domainRestrictions, "**/core/**"],
  ),
  boundaries(
    ["src/core/application/**/*.ts", "src/shared/application/**/*.ts"],
    applicationRestrictions,
  ),
  boundaries(
    ["src/features/*/application/**/*.ts"],
    [...applicationRestrictions, "**/core/**", "**/features/*/application/**"],
  ),
  boundaries(
    ["src/**/data/**/*.ts", "src/**/infrastructure/**/*.ts"],
    [
      "**/application/**",
      "**/presentation/**",
      "**/composition/**",
      "**/app/**",
    ],
  ),
  boundaries(
    ["src/**/presentation/**/*.{ts,tsx}"],
    [
      "**/data/**",
      "**/infrastructure/**",
      "**/composition/**",
      "@react-native-async-storage/**",
      "expo-document-picker",
    ],
  ),
  // Shared is reusable and cannot acquire a feature or app dependency.
  boundaries(
    ["src/shared/domain/**/*.ts"],
    [...domainRestrictions, "**/features/**", "**/core/**"],
  ),
  boundaries(
    ["src/shared/data/**/*.ts", "src/shared/infrastructure/**/*.ts"],
    [
      "**/application/**",
      "**/presentation/**",
      "**/composition/**",
      "**/app/**",
      "**/features/**",
      "**/core/**",
    ],
  ),
  boundaries(
    ["src/shared/presentation/**/*.{ts,tsx}"],
    [
      "**/data/**",
      "**/infrastructure/**",
      "**/composition/**",
      "**/features/**",
      "**/core/**",
      "@react-native-async-storage/**",
      "expo-document-picker",
    ],
  ),
]);
