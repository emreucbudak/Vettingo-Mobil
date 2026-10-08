jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
jest.mock("@expo/vector-icons", () => {
  const { Text } = require("react-native");
  const React = require("react");
  return {
    Ionicons: (props: { name: string }) =>
      React.createElement(Text, null, props.name),
  };
});
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: () => false,
  },
  usePathname: () => "/candidate-dashboard",
  useLocalSearchParams: () => ({}),
}));
jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);
