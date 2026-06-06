import type { PropsWithChildren } from "react";
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";

import { colors, metrics } from "../theme/tokens";

type LiquidGlassPanelProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

function canUseLiquidGlass() {
  if (Platform.OS !== "ios") {
    return false;
  }

  try {
    return isGlassEffectAPIAvailable() && isLiquidGlassAvailable();
  } catch {
    return false;
  }
}

export function LiquidGlassPanel({ children, style }: LiquidGlassPanelProps) {
  if (canUseLiquidGlass()) {
    return (
      <GlassView
        colorScheme="dark"
        glassEffectStyle="regular"
        tintColor="rgba(200, 170, 110, 0.1)"
        style={[styles.base, styles.glass, style]}
      >
        {children}
      </GlassView>
    );
  }

  return <View style={[styles.base, styles.fallback, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: metrics.glassRadius,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: "hidden",
  },
  glass: {
    backgroundColor: "rgba(20, 16, 12, 0.2)",
  },
  fallback: {
    backgroundColor: "rgba(18, 14, 10, 0.82)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
});
