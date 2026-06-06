import React, { useCallback, useEffect, useMemo } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import MaskedView from "@react-native-masked-view/masked-view";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { CharacterPortrait } from "../assets/art/CharacterPortrait";
import { colors, fonts, metrics } from "../theme/tokens";
import { playUnlock } from "../utils/audioManager";
import type { Card, SwipeDirection } from "../types/game";

type SwipeCardProps = {
  card: Card;
  disabled?: boolean;
  onSwipe: (direction: SwipeDirection) => void;
};

const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 700;
const RESET_TIMING = { duration: 180 };
const EXIT_TIMING = { duration: 200 };

export const SwipeCard = React.memo(function SwipeCard({
  card,
  disabled = false,
  onSwipe,
}: SwipeCardProps) {
  const { width, height } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const borderGlow = useSharedValue(0.3);
  const rotateGlow = useSharedValue(0);
  const blurRef = React.useRef<View>(null);

  const dealScale = useSharedValue(0.88);
  const dealY = useSharedValue(40);
  const dealOpacity = useSharedValue(0);
  const dealRotate = useSharedValue(-3);

  const exitX = width * 1.2;

  const pillMaxW = Math.min(width * 0.42, 160);
  const pillFont = width < 360 ? 10 : width < 400 ? 11 : 12;

  useEffect(() => {
    dealScale.value = 0.88;
    dealY.value = 40;
    dealOpacity.value = 0;
    dealRotate.value = -3;

    dealOpacity.value = withTiming(1, { duration: 150 });
    dealScale.value = withSpring(1, { damping: 14, stiffness: 180, mass: 0.8 });
    dealY.value = withSpring(0, { damping: 16, stiffness: 160, mass: 0.8 });
    dealRotate.value = withDelay(
      50,
      withSpring(0, { damping: 12, stiffness: 120 }),
    );

    if (card.isReward && card.rewardType) {
      playUnlock(card.rewardType).catch(() => undefined);
    }
  }, [
    card.id,
    dealOpacity,
    dealRotate,
    dealScale,
    dealY,
    card.isReward,
    card.rewardType,
  ]);

  useEffect(() => {
    borderGlow.value = withRepeat(
      withSequence(
        withTiming(0.55, { duration: 2200 }),
        withTiming(0.25, { duration: 2200 }),
      ),
      -1,
      true,
    );
  }, [borderGlow]);

  useEffect(() => {
    if (card.isReward) {
      rotateGlow.value = withRepeat(
        withTiming(360, { duration: 6000, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [card.isReward, rotateGlow]);

  useEffect(() => {
    cancelAnimation(translateX);
    cancelAnimation(translateY);
    translateX.value = 0;
    translateY.value = 0;
  }, [card.id, translateX, translateY]);

  const resetCard = useCallback(() => {
    "worklet";
    translateX.value = withTiming(0, RESET_TIMING);
    translateY.value = withTiming(0, RESET_TIMING);
  }, [translateX, translateY]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled)
        .activeOffsetX([-8, 8])
        .failOffsetY([-28, 28])
        .onUpdate((event) => {
          translateX.value = event.translationX;
          translateY.value = event.translationY * 0.25;
        })
        .onEnd((event) => {
          const shouldCommit =
            Math.abs(translateX.value) > SWIPE_THRESHOLD ||
            Math.abs(event.velocityX) > VELOCITY_THRESHOLD;

          if (!shouldCommit) {
            resetCard();
            return;
          }

          const direction: SwipeDirection =
            translateX.value > 0 ? "right" : "left";
          const targetX = direction === "right" ? exitX : -exitX;

          translateX.value = withTiming(targetX, EXIT_TIMING, (finished) => {
            if (finished) {
              runOnJS(onSwipe)(direction);
            }
          });
          translateY.value = withTiming(event.velocityY * 0.04, EXIT_TIMING);
        })
        .onFinalize((_event, success) => {
          if (!success) {
            resetCard();
          }
        }),
    [disabled, exitX, onSwipe, resetCard, translateX, translateY],
  );

  const animatedCardStyle = useAnimatedStyle(() => {
    const swipeRotate = interpolate(
      translateX.value,
      [-200, 0, 200],
      [-14, 0, 14],
      Extrapolation.CLAMP,
    );
    return {
      opacity: dealOpacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value + dealY.value },
        { rotate: `${swipeRotate + dealRotate.value}deg` },
        { scale: dealScale.value },
      ],
    };
  });

  const borderGlowStyle = useAnimatedStyle(() => ({
    opacity: borderGlow.value,
  }));

  const rotateGlowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateGlow.value}deg` }],
  }));

  const leftChoiceStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, -15],
      [1, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [-SWIPE_THRESHOLD, -15],
          [1, 0.7],
          Extrapolation.CLAMP,
        ),
      },
      {
        translateY: interpolate(
          translateX.value,
          [-SWIPE_THRESHOLD, -15],
          [0, 6],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const rightChoiceStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [15, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [15, SWIPE_THRESHOLD],
          [0.7, 1],
          Extrapolation.CLAMP,
        ),
      },
      {
        translateY: interpolate(
          translateX.value,
          [15, SWIPE_THRESHOLD],
          [6, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const leftTintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD * 1.2, 0],
      [0.2, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const rightTintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD * 1.2],
      [0, 0.2],
      Extrapolation.CLAMP,
    ),
  }));

  let gradientColors: [string, string, string, string, string] = [
    "#c8aa6e",
    "#8a6a38",
    "#4a3820",
    "#8a6a38",
    "#c8aa6e",
  ];
  if (card.isReward && card.rewardType === "achievement") {
    gradientColors = ["#ebd7a1", "#c8aa6e", "#8a6a38", "#c8aa6e", "#ebd7a1"];
  }

  const innerContent = (
    <View style={styles.innerCard}>
      <View style={styles.topAccent} />

      {/* PORTRAIT / REWARD AREA */}
      <View style={styles.portraitContainer} ref={blurRef}>
        <View
          style={[
            styles.portraitFrame,
            card.isReward && card.rewardIcon && styles.rewardFrame,
          ]}
        >
          {card.isReward && card.rewardIcon ? (
            <View style={styles.rewardIconContainer}>
              {/* STROKE LAYER (GLOWING ANIMATION) */}
              <MaskedView
                style={StyleSheet.absoluteFill}
                maskElement={
                  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    {[...Array(12)].map((_, i) => (
                      <MaterialCommunityIcons
                        key={i}
                        name={card.rewardIcon as any}
                        size={120}
                        color="black"
                        style={[
                          i > 0 ? { position: "absolute" } : {},
                          {
                            textShadowColor: "black",
                            textShadowRadius: 6,
                            textShadowOffset: { width: 0, height: 0 },
                          }
                        ]}
                      />
                    ))}
                  </View>
                }
              >
                <LinearGradient
                  colors={
                    card.rewardType === "achievement"
                      ? ["#ebd7a1", "#8a6a38", "#4a3820", "#8a6a38", "#ebd7a1"]
                      : ["#88d4b4", "#3b7a5a", "#1a3a2a", "#3b7a5a", "#88d4b4"]
                  }
                  locations={[0, 0.25, 0.5, 0.75, 1]}
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
                      card.rewardType === "achievement"
                        ? ["transparent", "transparent", "#fff5d1", "#c8aa6e", "transparent", "transparent"]
                        : ["transparent", "transparent", "#d1fff5", "#88d4b4", "transparent", "transparent"]
                    }
                    locations={[0, 0.4, 0.48, 0.52, 0.6, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1 }}
                  />
                </Animated.View>
              </MaskedView>

              {/* INNER FILL LAYER */}
              <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center", zIndex: 1 }]}>
                <MaterialCommunityIcons
                  name={card.rewardIcon as any}
                  size={120}
                  color="#161310"
                />
              </View>
            </View>
          ) : (
            <>
              <CharacterPortrait variant={card.portraitKey} />
              {card.isReward && card.rewardType === "collection" && (
                <View style={styles.mysteryOverlay}>
                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(20, 16, 12, 0.4)",
                      "#14100c",
                    ]}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <Text style={styles.mysteryMarkFlat}>?</Text>
                </View>
              )}
            </>
          )}
          <Animated.View
            style={[styles.tintOverlay, styles.leftTint, leftTintStyle]}
          />
          <Animated.View
            style={[styles.tintOverlay, styles.rightTint, rightTintStyle]}
          />
        </View>

        {/* SWIPE CHOICES */}
        <Animated.View
          style={[
            styles.choicePill,
            styles.rightPill,
            { maxWidth: pillMaxW },
            rightChoiceStyle,
          ]}
        >
          <Text
            style={[styles.pillText, { fontSize: pillFont }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {card.rightSwipe.text}
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.choicePill,
            styles.leftPill,
            { maxWidth: pillMaxW },
            leftChoiceStyle,
          ]}
        >
          <Text
            style={[styles.pillText, { fontSize: pillFont }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {card.leftSwipe.text}
          </Text>
        </Animated.View>
      </View>

      {/* BOTTOM INFO */}
      <View style={styles.bottomContent}>
        <Text
          style={styles.characterName}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.65}
        >
          {card.characterName}
        </Text>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerDiamond} />
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.dialogueContainer}>
          <Text
            style={[styles.dialogue, width < 380 && styles.dialogueSmall]}
            numberOfLines={4}
          >
            {card.dialogue}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.cardShell, animatedCardStyle]}>
        {card.isReward ? (
          <View style={{ flex: 1, borderRadius: metrics.cardRadius, padding: 3, overflow: "hidden", backgroundColor: "#3a2818" }}>
            <LinearGradient
              colors={gradientColors}
              locations={[0, 0.2, 0.5, 0.8, 1]}
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
                colors={["transparent", "transparent", "#fff5d1", gradientColors[0], "transparent", "transparent"]}
                locations={[0, 0.4, 0.48, 0.52, 0.6, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </Animated.View>
            {innerContent}
          </View>
        ) : (
          <>
            <Animated.View
              style={[
                styles.glowBorder,
                borderGlowStyle,
              ]}
            />
            <LinearGradient
              colors={gradientColors}
              locations={[0, 0.2, 0.5, 0.8, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardBorder}
            >
              {innerContent}
            </LinearGradient>
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  cardShell: {
    width: "100%",
    height: "100%",
    maxWidth: 400,
    maxHeight: 650,
    borderRadius: metrics.cardRadius,
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 16,
  },
  glowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: metrics.cardRadius + 2,
    borderWidth: 1.5,
    borderColor: "#c8aa6e",
    shadowColor: "#c8aa6e",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  cardBorder: {
    flex: 1,
    borderRadius: metrics.cardRadius,
    padding: 3,
  },
  innerCard: {
    flex: 1,
    borderRadius: metrics.cardRadius - 1,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.15)",
    backgroundColor: colors.cardBg,
    padding: 12,
    overflow: "hidden",
  },
  topAccent: {
    position: "absolute",
    top: 0,
    left: 24,
    right: 24,
    height: 2,
    backgroundColor: colors.accentGold,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    opacity: 0.4,
  },
  portraitContainer: {
    flex: 1,
    position: "relative",
  },
  portraitFrame: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(200, 170, 110, 0.2)",
    backgroundColor: "#0a0d0e",
  },
  tintOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  leftTint: {
    backgroundColor: "#c8374d",
  },
  rightTint: {
    backgroundColor: "#5b8a72",
  },
  choicePill: {
    position: "absolute",
    top: 10,
    minHeight: 28,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  leftPill: {
    right: 8,
    backgroundColor: "rgba(155, 58, 74, 0.85)",
    borderColor: "rgba(200, 55, 77, 0.6)",
  },
  rightPill: {
    left: 8,
    backgroundColor: "rgba(91, 138, 114, 0.85)",
    borderColor: "rgba(106, 159, 91, 0.6)",
  },
  pillText: {
    color: "#f0e6d2",
    fontFamily: fonts.body,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
  characterName: {
    marginTop: 4,
    color: colors.accentGold,
    fontFamily: fonts.display,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 1,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
    gap: 6,
  },
  dividerLine: {
    width: 36,
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
  bottomContent: {
    paddingTop: 12,
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  rewardFrame: {
    backgroundColor: "#120f0d",
  },
  rewardIconContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#161310",
  },
  iconCleanDrop: {},
  mysteryOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  mysteryMarkFlat: {
    fontFamily: fonts.serif,
    fontSize: 160,
    color: "rgba(200, 170, 110, 0.5)",
    fontWeight: "400",
    transform: [{ translateY: -10 }],
  },
  dialogueContainer: {
    marginTop: 4,
  },
  dialogue: {
    color: "#b8a888",
    fontFamily: fonts.serif,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  dialogueSmall: {
    fontSize: 12,
    lineHeight: 18,
  },
});
