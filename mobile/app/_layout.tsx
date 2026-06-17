import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "../global.css";

export default function RootLayout() {
  return (
    <View className="flex-1 bg-navy-deep">
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#060b14" },
          animation: "slide_from_right",
        }}
      />
    </View>
  );
}
