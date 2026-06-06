import { Pressable, StyleSheet, Text } from "react-native";

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
    minWidth: 180,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#c8aa6e",
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.5)",
    alignItems: "center",
    justifyContent: "center",
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
});
