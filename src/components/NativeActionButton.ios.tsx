import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";

type NativeActionButtonProps = {
  label: string;
  onPress: () => void;
};

function canUseGlassButton() {
  try {
    return isGlassEffectAPIAvailable() && isLiquidGlassAvailable();
  } catch {
    return false;
  }
}

export function NativeActionButton({
  label,
  onPress,
}: NativeActionButtonProps) {
  const glassAvailable = canUseGlassButton();

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          glassAvailable ? styles.glassButton : styles.defaultButton,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
      >
        <Text style={[styles.label, glassAvailable && styles.glassLabel]}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    minWidth: 180,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  defaultButton: {
    backgroundColor: "#c8aa6e",
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.5)",
  },
  glassButton: {
    backgroundColor: "rgba(200, 170, 110, 0.15)",
    borderWidth: 1,
    borderColor: "#c8aa6e",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  label: {
    color: "#1a110b",
    fontWeight: "900",
    fontSize: 15,
  },
  glassLabel: {
    color: "#c8aa6e",
  },
});
