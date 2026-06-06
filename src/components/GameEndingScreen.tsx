import React, { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  withRepeat,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { tavernStateColors } from "../data/endings";
import { fonts, metrics as themeMetrics } from "../theme/tokens";
import { playUITap } from "../utils/audioManager";
import type { GameEnding } from "../types/game";

type GameEndingScreenProps = {
  ending: GameEnding;
  onContinue: () => void;
  onHardReset: () => void;
};

export function GameEndingScreen({
  ending,
  onContinue,
  onHardReset,
}: GameEndingScreenProps) {
  const { width } = useWindowDimensions();
  const isVictory = ending.type === "victory";
  const stateColors = tavernStateColors[ending.tavernState];

  const headlineScale = useSharedValue(0.8);
  const headlineOpacity = useSharedValue(0);

  useEffect(() => {
    headlineOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    headlineScale.value = withDelay(
      200,
      withSequence(
        withSpring(1.02, { damping: 10, stiffness: 120 }),
        withSpring(1, { damping: 14, stiffness: 160 }),
      ),
    );
  }, [headlineOpacity, headlineScale]);

  const rotateGlow = useSharedValue(0);

  useEffect(() => {
    rotateGlow.value = withRepeat(
      withTiming(360, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotateGlow]);

  const rotateGlowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateGlow.value}deg` }],
  }));

  const headlineStyle = useAnimatedStyle(() => ({
    opacity: headlineOpacity.value,
    transform: [{ scale: headlineScale.value }],
  }));

  const borderColor = isVictory ? stateColors.primary : "#c8374d";
  const bgColor = isVictory ? "#0a0e08" : "#14080a";

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}sn`;
    return `${m}dk ${s}sn`;
  };

  return (
    <View
      style={[styles.container, { backgroundColor: "transparent" }]}
    >
      <View style={[styles.card, { width: Math.min(width - 32, 400) }]}>
        <View style={[styles.cardBorder, { overflow: "hidden" }]}>
          <LinearGradient
            colors={
              isVictory
                ? [
                    stateColors.primary,
                    stateColors.secondary,
                    bgColor,
                    stateColors.secondary,
                    stateColors.primary,
                  ]
                : ["#c8374d", "#8a2030", bgColor, "#8a2030", "#c8374d"]
            }
            locations={[0, 0.15, 0.5, 0.85, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View
            style={[
              {
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
              },
              rotateGlowStyle,
            ]}
          >
            <LinearGradient
              colors={
                isVictory
                  ? ["transparent", "transparent", "#fff5d1", stateColors.primary, "transparent", "transparent"]
                  : ["transparent", "transparent", "#ff8a9a", "#c8374d", "transparent", "transparent"]
              }
              locations={[0, 0.4, 0.48, 0.52, 0.6, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
          <View style={[styles.cardInner, { backgroundColor: bgColor }]}>
            {}
            <Animated.View style={headlineStyle}>
              <Text style={[styles.eyebrow, { color: borderColor }]}>
                {isVictory ? "HAN EFSANESİ" : "HAN KAPANDI"}
              </Text>
              <Text style={styles.headline}>{ending.headline}</Text>
            </Animated.View>

            <View style={[styles.divider, { backgroundColor: borderColor }]} />

            {}
            <Animated.View entering={FadeInUp.delay(600).duration(500)}>
              <Text
                style={styles.epilogue}
                numberOfLines={5}
                adjustsFontSizeToFit
              >
                {ending.epilogue}
              </Text>
            </Animated.View>

            {}
            <Animated.View
              entering={FadeInDown.delay(900).duration(500)}
              style={styles.statsRow}
            >
              <StatItem
                icon="weather-night"
                label="Gece"
                value={`${ending.stats.nightsSurvived}`}
                delay={0}
                color={borderColor}
              />
              <StatItem
                icon="account-group"
                label="Müşteri"
                value={`${ending.stats.guestsServed}`}
                delay={100}
                color={borderColor}
              />
              <StatItem
                icon="auto-fix"
                label="Gizem"
                value={`${ending.stats.secretEventsFound}`}
                delay={200}
                color={borderColor}
              />
              <StatItem
                icon="timer-sand"
                label="Süre"
                value={formatTime(ending.stats.playTimeSeconds)}
                delay={300}
                color={borderColor}
              />
            </Animated.View>

            {}
            {isVictory && ending.titles.length > 0 && (
              <Animated.View
                entering={FadeInDown.delay(1300).duration(400)}
                style={styles.compactList}
              >
                <Text
                  style={[styles.sectionTitle, { color: stateColors.primary }]}
                >
                  Kazanılan Unvanlar
                </Text>
                <View style={styles.badgesWrap}>
                  {ending.titles.map((title) => (
                    <View
                      key={title.label}
                      style={[
                        styles.badge,
                        { borderColor: `${stateColors.primary}40`, flexDirection: "row", alignItems: "center", gap: 4 },
                      ]}
                    >
                      <MaterialCommunityIcons name={title.icon as any} size={14} color={stateColors.primary} />
                      <Text
                        style={[
                          styles.badgeText,
                          { color: stateColors.primary },
                        ]}
                      >
                        {title.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </Animated.View>
            )}

            {ending.newCardsThisRun.length > 0 && (
              <Animated.View
                entering={FadeInDown.delay(isVictory ? 1500 : 1200).duration(
                  400,
                )}
                style={styles.compactList}
              >
                <View
                  style={[
                    styles.badge,
                    {
                      borderColor: `${borderColor}40`,
                      backgroundColor: `${borderColor}15`,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="cards-playing"
                    size={14}
                    color={borderColor}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.badgeText, { color: borderColor }]}>
                    {ending.newCardsThisRun.length} Yeni Keşif
                  </Text>
                </View>
              </Animated.View>
            )}

            {}
            <Animated.View
              entering={FadeIn.delay(isVictory ? 1800 : 1500).duration(400)}
              style={styles.buttonsContainer}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  {
                    backgroundColor: borderColor,
                    borderColor: `${borderColor}80`,
                  },
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => {
                  playUITap();
                  onContinue();
                }}
              >
                <Text style={styles.primaryButtonText}>
                  {isVictory ? "Yeni Hikâye Başlat" : "Bir Kez Daha Dene"}
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && { opacity: 0.6 },
                ]}
                onPress={() => {
                  playUITap();
                  onHardReset();
                }}
              >
                <Text
                  style={[styles.secondaryButtonText, { color: borderColor }]}
                >
                  Tamamen Sıfırla
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
}

function StatItem({
  icon,
  label,
  value,
  delay,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  delay: number;
  color: string;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(1000 + delay).duration(300)}
      style={styles.statItem}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={color}
        style={styles.statIcon}
      />
      <View>
        <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    borderRadius: themeMetrics.cardRadius,
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
    elevation: 24,
    maxHeight: "95%",
  },
  cardBorder: {
    borderRadius: themeMetrics.cardRadius,
    padding: 2,
  },
  cardInner: {
    borderRadius: themeMetrics.cardRadius - 1.5,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.1)",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  eyebrow: {
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 3,
    textAlign: "center",
    marginBottom: 4,
  },
  headline: {
    color: "#f0e6d2",
    fontFamily: fonts.display,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 26,
    letterSpacing: 0.5,
  },
  divider: {
    width: 40,
    height: 1,
    opacity: 0.3,
    marginVertical: 12,
  },

  epilogue: {
    color: "#9a8a6a",
    fontFamily: fonts.serif,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 16,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "rgba(200, 170, 110, 0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.1)",
    padding: 12,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  statIcon: {
    marginRight: 6,
    opacity: 0.8,
  },
  statValue: {
    color: "#f0e6d2",
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "900",
  },
  statLabel: {
    color: "#6a5a42",
    fontFamily: fonts.body,
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  compactList: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  badgesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(200, 170, 110, 0.06)",
    borderRadius: 6,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "700",
  },

  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 4,
  },
  primaryButton: {
    width: "100%",
    minHeight: 46,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  primaryButtonText: {
    color: "#f0e6d2",
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    marginTop: 12,
    padding: 6,
  },
  secondaryButtonText: {
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
