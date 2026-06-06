import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
  Linking,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGameStore } from "../store/gameStore";
import { colors, fonts } from "../theme/tokens";

type SettingsSheetProps = {
  visible: boolean;
  onClose: () => void;
  onHardReset: () => void;
};

export function SettingsSheet({
  visible,
  onClose,
  onHardReset,
}: SettingsSheetProps) {
  const { height } = useWindowDimensions();
  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);

  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const hardReset = useGameStore((s) => s.hardReset);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
        overshootClamping: true,
      });
    } else {
      opacity.value = withTiming(0, { duration: 250 });
      translateY.value = withTiming(height, { duration: 300 });
    }
  }, [visible, height, translateY, opacity]);

  const pan = Gesture.Pan()
    .onChange((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 120 || event.velocityY > 500) {
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
          overshootClamping: true,
        });
      }
    });

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    pointerEvents: visible ? "auto" : "none",
  }));

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleReset = () => {
    onHardReset();
    onClose();
  };

  return (
    <>
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.sheet, animatedSheetStyle]}
          pointerEvents={visible ? "auto" : "none"}
        >
          <View style={styles.dragHandle} />

          <Text style={styles.title}>AYARLAR</Text>

          <View style={styles.content}>
            <Pressable style={styles.row} onPress={toggleSound}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: soundEnabled
                      ? colors.accentGold
                      : "#3a2b25",
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={soundEnabled ? "volume-high" : "volume-off"}
                  size={24}
                  color={soundEnabled ? "#1a110e" : colors.accentGold}
                />
              </View>
              <Text style={styles.rowText}>
                Ses: {soundEnabled ? "Açık" : "Kapalı"}
              </Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable style={styles.row} onPress={handleReset}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.ember },
                ]}
              >
                <MaterialCommunityIcons
                  name="refresh"
                  size={24}
                  color="#f0e6d2"
                />
              </View>
              <View>
                <Text style={styles.rowText}>Verileri Sıfırla</Text>
                <Text style={styles.rowSubtext}>
                  Tüm koleksiyon ve başarımlar silinir
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>KADİM MEŞE HANI</Text>
            <Text style={styles.footerSubtext}>v1.0.0 · Teşkilatsız</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 100,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#161310",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(200, 170, 110, 0.2)",
    paddingBottom: 40,
    zIndex: 101,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -10 },
    elevation: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(200, 170, 110, 0.3)",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 20,
    fontWeight: "900",
    color: "#f0e6d2",
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 24,
  },
  content: {
    paddingHorizontal: 24,
    gap: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: {
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: "700",
    color: "#f0e6d2",
    letterSpacing: 1,
  },
  rowSubtext: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: "rgba(240, 230, 210, 0.5)",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(200, 170, 110, 0.1)",
    marginVertical: 4,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: "rgba(200, 170, 110, 0.4)",
    letterSpacing: 2,
    fontWeight: "900",
  },
  footerSubtext: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: "rgba(200, 170, 110, 0.3)",
  },
});
