import "react-native-gesture-handler";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useState, useEffect } from "react";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    async function init() {
      SplashScreen.setOptions({
        duration: 1000,
        fade: true,
      });

      SplashScreen.hideAsync().catch(() => {});
    }

    init();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <View style={{ flex: 1, backgroundColor: "#0e1114" }}>
          <StatusBar barStyle="light-content" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#0e1114" },
              animation: "none",
            }}
          />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
