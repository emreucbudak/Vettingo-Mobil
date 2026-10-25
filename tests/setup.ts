jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
jest.mock("@expo/vector-icons", () => {
  const { Text } = require("react-native");
  const React = require("react");
  const MockIcon = (props: { name: string }) =>
    React.createElement(Text, null, props.name);
  return {
    Ionicons: MockIcon,
    MaterialIcons: MockIcon,
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
  useFocusEffect: (effect: () => void | (() => void)) =>
    require("react").useEffect(effect, [effect]),
}));
jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);
