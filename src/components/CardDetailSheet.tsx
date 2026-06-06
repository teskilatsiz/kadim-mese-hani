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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CharacterPortrait } from "../assets/art/CharacterPortrait";
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
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(height);
  const backdropOpacity = useSharedValue(0);
  const dragY = useSharedValue(0);

  // Bottom padding: safe area + room for tab bar (56px)
  const bottomPad = insets.bottom + 56 + 12;

  useEffect(() => {
    if (card) {
      dragY.value = 0;
      translateY.value = withTiming(0, { duration: 300 });
      backdropOpacity.value = withTiming(1, { duration: 250 });
    } else {
      translateY.value = withTiming(height, { duration: 250 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [card, height, translateY, backdropOpacity, dragY]);

  const dismissSheet = () => {
    translateY.value = withTiming(height, { duration: 250 }, (finished) => {
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
            style={[
              styles.sheet,
              { maxHeight: height - insets.top - 40, paddingBottom: bottomPad },
              sheetStyle,
            ]}
          >
            {/* Handle */}
            <View style={styles.handleBar}>
              <View style={styles.handle} />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Portrait */}
              <View style={styles.portrait}>
                <CharacterPortrait variant={card.portraitKey} />
              </View>

              {/* Name */}
              <Text style={styles.name}>{card.characterName}</Text>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <View style={styles.dividerDot} />
                <View style={styles.dividerLine} />
              </View>

              {/* Dialogue */}
              <Text style={styles.dialogue}>"{card.dialogue}"</Text>

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{entry?.timesEncountered ?? 0}</Text>
                  <Text style={styles.statLabel}>Karşılaşma</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statValue}>Nesil {entry?.firstEncounteredGeneration ?? "?"}</Text>
                  <Text style={styles.statLabel}>İlk Görüş</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={[
                    styles.statValue,
                    entry?.lastDecision === "right" && { color: colors.sage },
                    entry?.lastDecision === "left" && { color: colors.ember },
                  ]}>
                    {entry?.lastDecision === "right"
                      ? "Kabul"
                      : entry?.lastDecision === "left"
                        ? "Red"
                        : "—"}
                  </Text>
                  <Text style={styles.statLabel}>Son Karar</Text>
                </View>
              </View>

              {/* Choices */}
              <Text style={styles.sectionTitle}>Seçenekler</Text>
              <View style={styles.choiceRow}>
                <View style={[styles.choicePill, styles.choiceLeft]}>
                  <Text style={styles.choiceLabelLeft}>← Red</Text>
                  <Text style={styles.choiceText} numberOfLines={2}>
                    {card.leftSwipe.text}
                  </Text>
                </View>
                <View style={[styles.choicePill, styles.choiceRight]}>
                  <Text style={styles.choiceLabelRight}>Kabul →</Text>
                  <Text style={styles.choiceText} numberOfLines={2}>
                    {card.rightSwipe.text}
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Close */}
            <Pressable
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && { opacity: 0.7 },
              ]}
              onPress={dismissSheet}
            >
              <Text style={styles.closeBtnText}>Kapat</Text>
            </Pressable>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },

  /* Sheet container */
  sheet: {
    width: "100%",
    backgroundColor: colors.panel,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.glassBorder,
  },

  /* Handle */
  handleBar: {
    alignItems: "center",
    paddingVertical: 10,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(200, 170, 110, 0.3)",
  },

  /* Scroll */
  scrollContent: {
    paddingHorizontal: 16,
  },

  /* Portrait */
  portrait: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.night,
  },

  /* Name */
  name: {
    marginTop: 12,
    color: colors.accentGold,
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  /* Divider */
  divider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    gap: 8,
  },
  dividerLine: {
    width: 36,
    height: 1,
    backgroundColor: "rgba(200, 170, 110, 0.2)",
  },
  dividerDot: {
    width: 5,
    height: 5,
    backgroundColor: "rgba(200, 170, 110, 0.35)",
    transform: [{ rotate: "45deg" }],
  },

  /* Dialogue */
  dialogue: {
    color: "#b0a080",
    fontFamily: fonts.serif,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    fontStyle: "italic",
  },

  /* Stats */
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(200, 170, 110, 0.05)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.1)",
    marginTop: 16,
    paddingVertical: 12,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(200, 170, 110, 0.12)",
  },
  statValue: {
    color: colors.accentGold,
    fontFamily: fonts.display,
    fontSize: 14,
    fontWeight: "800",
  },
  statLabel: {
    color: "#7a6a50",
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
  },

  /* Choices */
  sectionTitle: {
    color: "#7a6a50",
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  choiceRow: {
    flexDirection: "row",
    gap: 8,
  },
  choicePill: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
  },
  choiceLeft: {
    backgroundColor: "rgba(155, 58, 74, 0.1)",
    borderColor: "rgba(200, 55, 77, 0.2)",
  },
  choiceRight: {
    backgroundColor: "rgba(91, 138, 114, 0.1)",
    borderColor: "rgba(106, 159, 91, 0.2)",
  },
  choiceLabelLeft: {
    color: colors.ember,
    fontFamily: fonts.display,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },
  choiceLabelRight: {
    color: colors.sage,
    fontFamily: fonts.display,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },
  choiceText: {
    color: "#a09080",
    fontFamily: fonts.serif,
    fontSize: 12,
    lineHeight: 16,
  },

  /* Close Button */
  closeBtn: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "rgba(200, 170, 110, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.18)",
    alignItems: "center",
  },
  closeBtnText: {
    color: colors.accentGold,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "800",
  },
});
