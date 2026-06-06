import { Pressable, StyleSheet, Text } from "react-native";

import { colors, fonts } from "../theme/tokens";

type NativeActionButtonProps = {
  label: string;
  onPress: () => void;
};

export function NativeActionButton({
  label,
  onPress,
}: NativeActionButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: colors.accentGold,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.5)",
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  label: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: "900",
  },
});
