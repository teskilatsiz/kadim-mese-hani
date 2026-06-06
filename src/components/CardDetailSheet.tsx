import { useEffect, useMemo } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { CharacterPortrait } from "../assets/art/CharacterPortrait";
import { LiquidGlassPanel } from "./LiquidGlassPanel";
import { colors, fonts } from "../theme/tokens";
import type { Card, CollectionEntry } from "../types/game";

type CardDetailSheetProps = {
  card: Card | null;
  entry: CollectionEntry | null;
  onClose: () => void;
};

const DISMISS_THRESHOLD = 80;

export function CardDetailSheet({
  card,
  entry,
  onClose,
}: CardDetailSheetProps) {
  const { height } = useWindowDimensions();
  const translateY = useSharedValue(height);
  const backdropOpacity = useSharedValue(0);
  const dragY = useSharedValue(0);

  useEffect(() => {
    if (card) {
      dragY.value = 0;
      translateY.value = withTiming(0, { duration: 350 });
      backdropOpacity.value = withTiming(1, { duration: 250 });
    } else {
      translateY.value = withTiming(height, { duration: 300 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [card, height, translateY, backdropOpacity, dragY]);

  const dismissSheet = () => {
    translateY.value = withTiming(height, { duration: 300 }, (finished) => {
      if (finished) runOnJS(onClose)();
    });
    backdropOpacity.value = withTiming(0, { duration: 200 });
  };

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onUpdate((event) => {
          if (event.translationY > 0) {
            dragY.value = event.translationY;
          }
        })
        .onEnd((event) => {
          if (dragY.value > DISMISS_THRESHOLD || event.velocityY > 500) {
            runOnJS(dismissSheet)();
          } else {
            dragY.value = withTiming(0, { duration: 200 });
          }
        })
        .onFinalize(() => {}),
    [dragY],
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value + dragY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!card) return null;

  return (
    <Modal
      transparent
      visible={Boolean(card)}
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismissSheet}
    >
      <View style={styles.modalRoot}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={dismissSheet} />
        </Animated.View>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[styles.sheet, { maxHeight: height * 0.78 }, sheetStyle]}
          >
            <LiquidGlassPanel style={styles.sheetPanel}>
              {}
              <View style={styles.handle} />

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                scrollEnabled={false}
              >
                {}
                <View style={styles.portraitLarge}>
                  <CharacterPortrait variant={card.portraitKey} />
                </View>

                <Text style={styles.name}>{card.characterName}</Text>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <View style={styles.dividerDiamond} />
                  <View style={styles.dividerLine} />
                </View>

                <Text style={styles.dialogue}>"{card.dialogue}"</Text>

                {}
                <View style={styles.statsRow}>
                  <StatItem
                    label="Karşılaşma"
                    value={`${entry?.timesEncountered ?? 0}`}
                  />
                  <StatItem
                    label="İlk Görüş"
                    value={`Nesil ${entry?.firstEncounteredGeneration ?? "?"}`}
                  />
                  <StatItem
                    label="Son Karar"
                    value={
                      entry?.lastDecision === "right"
                        ? "→ Kabul"
                        : entry?.lastDecision === "left"
                          ? "← Red"
                          : "—"
                    }
                  />
                </View>

                {}
                <View style={styles.choicesSection}>
                  <Text style={styles.choicesTitle}>Seçenekler</Text>
                  <View style={styles.choiceRow}>
                    <View style={[styles.choicePill, styles.leftChoice]}>
                      <Text style={styles.choiceArrow}>←</Text>
                      <Text style={styles.choiceText} numberOfLines={2}>
                        {card.leftSwipe.text}
                      </Text>
                    </View>
                    <View style={[styles.choicePill, styles.rightChoice]}>
                      <Text style={styles.choiceText} numberOfLines={2}>
                        {card.rightSwipe.text}
                      </Text>
                      <Text style={styles.choiceArrow}>→</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>

              {}
              <Pressable
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closePressed,
                ]}
                onPress={dismissSheet}
              >
                <Text style={styles.closeText}>Kapat</Text>
              </Pressable>
            </LiquidGlassPanel>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  modalRoot: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 4, 2, 0.65)",
  },
  sheet: { width: "100%" },
  sheetPanel: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: 34,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(200, 170, 110, 0.3)",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 6,
  },
  content: { padding: 20, paddingTop: 8 },
  portraitLarge: {
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(200, 170, 110, 0.25)",
    backgroundColor: "#0a0d0e",
  },
  name: {
    marginTop: 14,
    color: colors.accentGold,
    fontFamily: fonts.display,
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 1,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    gap: 6,
  },
  dividerLine: {
    width: 40,
    height: 1,
    backgroundColor: colors.accentGold,
    opacity: 0.3,
  },
  dividerDiamond: {
    width: 6,
    height: 6,
    backgroundColor: colors.accentGold,
    opacity: 0.5,
    transform: [{ rotate: "45deg" }],
  },
  dialogue: {
    color: "#b8a888",
    fontFamily: fonts.serif,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    fontStyle: "italic",
  },
  statsRow: { flexDirection: "row", marginTop: 18, gap: 8 },
  stat: {
    flex: 1,
    backgroundColor: "rgba(200, 170, 110, 0.06)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.12)",
    padding: 10,
    alignItems: "center",
  },
  statValue: {
    color: colors.accentGold,
    fontFamily: fonts.display,
    fontSize: 15,
    fontWeight: "800",
  },
  statLabel: {
    color: "#8a7a60",
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
  },
  choicesSection: { marginTop: 18 },
  choicesTitle: {
    color: "#8a7a60",
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  choiceRow: { flexDirection: "row", gap: 8 },
  choicePill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  leftChoice: {
    backgroundColor: "rgba(155, 58, 74, 0.15)",
    borderColor: "rgba(200, 55, 77, 0.3)",
  },
  rightChoice: {
    backgroundColor: "rgba(91, 138, 114, 0.15)",
    borderColor: "rgba(106, 159, 91, 0.3)",
  },
  choiceArrow: { color: "#8a7a60", fontSize: 14, fontWeight: "800" },
  choiceText: {
    flex: 1,
    color: "#b8a888",
    fontFamily: fonts.serif,
    fontSize: 12,
    lineHeight: 16,
  },
  closeButton: {
    marginHorizontal: 20,
    marginTop: 4,
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: "rgba(200, 170, 110, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  closePressed: { opacity: 0.7 },
  closeText: {
    color: colors.accentGold,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "800",
  },
});
