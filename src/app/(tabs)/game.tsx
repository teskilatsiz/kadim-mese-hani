import { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SystemUI from "expo-system-ui";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAudioPlayer } from "expo-audio";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { GameEndingScreen } from "../../components/GameEndingScreen";
import { LiquidGlassPanel } from "../../components/LiquidGlassPanel";
import { NativeActionButton } from "../../components/NativeActionButton";
import { ResourceTopBar } from "../../components/ResourceTopBar";

import { SwipeCard } from "../../components/SwipeCard";
import { OnboardingModal } from "../../components/OnboardingModal";
import { TavernBackdrop } from "../../components/TavernBackdrop";
import { CharacterPortrait } from "../../assets/art/CharacterPortrait";
import { colors, fonts, metrics } from "../../theme/tokens";
import {
  selectCurrentCard,
  selectEnding,
  selectNextCard,
  useGameStore,
} from "../../store/gameStore";
import {
  playSwipeSound,
  playFailure,
  playUITap,
  playCardAppear,
} from "../../utils/audioManager";
import type { SwipeDirection } from "../../types/game";

const SHUFFLE_CARD_COUNT = 5;

export default function GameScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const metricsState = useGameStore((s) => s.metrics);
  const generation = useGameStore((s) => s.generation);
  const turn = useGameStore((s) => s.turn);
  const failure = useGameStore((s) => s.failure);
  const ending = useGameStore(selectEnding);
  const currentCard = useGameStore(selectCurrentCard);
  const nextCard = useGameStore(selectNextCard);
  const swipe = useGameStore((s) => s.swipe);
  const continueAfterFailure = useGameStore((s) => s.continueAfterFailure);
  const resetGame = useGameStore((s) => s.resetGame);
  const hardReset = useGameStore((s) => s.hardReset);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const musicEnabled = useGameStore((s) => s.musicEnabled);
  const lastLoadedAt = useGameStore((s) => s.lastLoadedAt);

  const availableH = height - 320;
  const cardHeight = Math.min(Math.max(availableH, 360), 520);

  const [shuffling, setShuffling] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const onboardingChecked = useRef(false);

  const hasPlayedInitial = useRef(false);

  useEffect(() => {
    if (!onboardingChecked.current) {
      onboardingChecked.current = true;
      AsyncStorage.getItem("onboarding_done").then((val) => {
        if (val !== "true") {
          setShowOnboarding(true);
        }
      }).catch(() => {});
    }
  }, []);

  const bgPlayer = useAudioPlayer(require("../../assets/audio/background.mp3"));

  useEffect(() => {
    SystemUI.setBackgroundColorAsync("#0e1114").catch(() => undefined);
    bgPlayer.loop = true;
    if (musicEnabled) {
      bgPlayer.play();
    } else {
      bgPlayer.pause();
    }
  }, [bgPlayer, musicEnabled]);

  useEffect(() => {
    if (!hasPlayedInitial.current) {
      hasPlayedInitial.current = true;
      setShuffling(true);
      playCardAppear().catch(() => undefined);
      const timer = setTimeout(() => setShuffling(false), 900);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (generation > 1) {
      setShuffling(true);
      playCardAppear().catch(() => undefined);
      const timer = setTimeout(() => setShuffling(false), 900);
      return () => clearTimeout(timer);
    }
  }, [generation]);

  useEffect(() => {
    if (lastLoadedAt > 0) {
      setShuffling(true);
      playCardAppear().catch(() => undefined);
      const timer = setTimeout(() => setShuffling(false), 900);
      return () => clearTimeout(timer);
    }
  }, [lastLoadedAt]);

  useEffect(() => {
    if (failure) {
      playFailure().catch(() => undefined);
    }
  }, [failure]);

  const handleHardReset = useCallback(() => {
    hardReset();
    bgPlayer.seekTo(0);
    if (musicEnabled) {
      bgPlayer.play();
    }

    setShuffling(true);
    playCardAppear().catch(() => undefined);
    setTimeout(() => setShuffling(false), 900);
  }, [hardReset, bgPlayer, soundEnabled]);

  const handleContinueAfterEnding = useCallback(() => {
    continueAfterFailure();

    setShuffling(true);
    playCardAppear().catch(() => undefined);
    setTimeout(() => setShuffling(false), 900);
  }, [continueAfterFailure]);

  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      playSwipeSound(direction).catch(() => undefined);
      swipe(direction);
    },
    [swipe],
  );

  return (
    <View style={styles.screen}>
      <TavernBackdrop />
      
      {!ending ? (
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
          <ResourceTopBar
            metrics={metricsState}
            generation={generation}
            turn={turn}
          />

          <View style={styles.stage}>
            {shuffling ? (
              <ShuffleAnimation />
            ) : (
              <>
                {nextCard ? (
                  <QueuedCardShadow
                    cardName={nextCard.characterName}
                    portraitKey={nextCard.portraitKey}
                  />
                ) : null}
                {currentCard ? (
                  <SwipeCard
                    key={`${currentCard.id}-${generation}-${turn}`}
                    card={currentCard}
                    disabled={Boolean(failure) || Boolean(ending)}
                    onSwipe={handleSwipe}
                  />
                ) : (
                  <EmptyDeck onReset={resetGame} />
                )}
              </>
            )}
          </View>

          {showOnboarding && (
            <View style={[
              StyleSheet.absoluteFill, 
              { 
                backgroundColor: "transparent", 
                zIndex: 100,
                top: insets.top + 16, // Status bar'a değmemesi için insets.top ve ekstra boşluk
                bottom: insets.bottom + 16,
                alignItems: "center",
                justifyContent: "center"
              }
            ]}>
              <OnboardingModal
                visible={showOnboarding}
                onDone={() => {
                  setShowOnboarding(false);
                  setShuffling(true);
                  setTimeout(() => setShuffling(false), 900);
                }}
              />
            </View>
          )}
        </SafeAreaView>
      ) : null}

      {ending ? (
        <GameEndingScreen
          ending={ending}
          onContinue={handleContinueAfterEnding}
          onHardReset={handleHardReset}
        />
      ) : null}
    </View>
  );
}

function ShuffleAnimation() {
  const { width, height } = useWindowDimensions();
  const cardW = Math.min(width - 60, 320);
  const availableH = height - 250;
  const cardH = Math.min(Math.max(availableH * 0.8, 300), 440);

  return (
    <View style={styles.shuffleContainer}>
      {Array.from({ length: SHUFFLE_CARD_COUNT }).map((_, i) => (
        <ShuffleCard
          key={i}
          index={i}
          total={SHUFFLE_CARD_COUNT}
          cardW={cardW}
          cardH={cardH}
        />
      ))}
    </View>
  );
}

function ShuffleCard({
  index,
  total,
  cardW,
  cardH,
}: {
  index: number;
  total: number;
  cardW: number;
  cardH: number;
}) {
  const translateY = useSharedValue(200);
  const translateX = useSharedValue((index - Math.floor(total / 2)) * 30);
  const rotate = useSharedValue((index - Math.floor(total / 2)) * 8);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = index * 80;

    opacity.value = withDelay(delay, withTiming(1, { duration: 120 }));
    translateY.value = withDelay(
      delay,
      withSpring(-index * 3, { damping: 14, stiffness: 180 }),
    );
    translateX.value = withDelay(
      delay,
      withSequence(
        withSpring((index - Math.floor(total / 2)) * 40, {
          damping: 10,
          stiffness: 140,
        }),
        withDelay(200, withSpring(0, { damping: 16, stiffness: 160 })),
      ),
    );
    rotate.value = withDelay(
      delay,
      withSequence(
        withSpring((index - Math.floor(total / 2)) * 12, {
          damping: 10,
          stiffness: 120,
        }),
        withDelay(200, withSpring(0, { damping: 14, stiffness: 140 })),
      ),
    );
    scale.value = withDelay(
      delay,
      withSequence(
        withSpring(1, { damping: 12, stiffness: 160 }),
        withDelay(
          200,
          withSpring(1 - index * 0.02, { damping: 14, stiffness: 160 }),
        ),
      ),
    );
  }, [index, total, opacity, translateY, translateX, rotate, scale]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.shuffleCardShell,
        { width: cardW, height: cardH, zIndex: total - index },
        animStyle,
      ]}
    >
      <View style={styles.cardBack}>
        <View style={styles.cardBackInner}>
          <View style={styles.cardBackPattern}>
            <View style={styles.cardBackDiamond} />
          </View>
          <Text style={styles.cardBackText}>⚜</Text>
        </View>
      </View>
    </Animated.View>
  );
}

function QueuedCardShadow({
  cardName,
  portraitKey,
}: {
  cardName: string;
  portraitKey: string;
}) {
  return (
    <View style={styles.queuedCard}>
      <View style={styles.queuedPortrait}>
        <CharacterPortrait variant={portraitKey} />
      </View>
      <Text style={styles.queuedText} numberOfLines={1} adjustsFontSizeToFit>
        {cardName}
      </Text>
    </View>
  );
}

function EmptyDeck({ onReset }: { onReset: () => void }) {
  return (
    <LiquidGlassPanel style={styles.emptyPanel}>
      <Text style={styles.emptyTitle}>Bu gece defter kapandı</Text>
      <Pressable
        style={({ pressed }) => [
          styles.resetButton,
          pressed && styles.resetButtonPressed,
        ]}
        onPress={() => {
          playUITap();
          onReset();
        }}
      >
        <Text style={styles.resetButtonText}>Hanı yeniden kur</Text>
      </Pressable>
    </LiquidGlassPanel>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#1a1510" },
  safeArea: { flex: 1, paddingTop: 6 },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingBottom: 8,
    paddingTop: 8,
  },

  shuffleContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: "100%",
    height: "80%",
  },
  shuffleCardShell: {
    position: "absolute",
    borderRadius: metrics.cardRadius,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  cardBack: {
    flex: 1,
    borderRadius: metrics.cardRadius,
    borderWidth: 2.5,
    borderColor: "#8a6a38",
    backgroundColor: "#1a150e",
    padding: 6,
  },
  cardBackInner: {
    flex: 1,
    borderRadius: metrics.cardRadius - 4,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.15)",
    backgroundColor: "#14100c",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBackPattern: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "rgba(200, 170, 110, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cardBackDiamond: {
    width: 16,
    height: 16,
    backgroundColor: "rgba(200, 170, 110, 0.15)",
    transform: [{ rotate: "45deg" }],
  },
  cardBackText: { color: "rgba(200, 170, 110, 0.25)", fontSize: 20 },

  queuedCard: {
    position: "absolute",
    width: "82%",
    maxWidth: 370,
    minHeight: 300,
    borderRadius: metrics.cardRadius,
    padding: 14,
    backgroundColor: "rgba(20, 16, 12, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.12)",
    transform: [{ translateY: 14 }, { scale: 0.94 }],
  },
  queuedPortrait: {
    height: 160,
    borderRadius: metrics.cardRadius,
    overflow: "hidden",
    opacity: 0.4,
  },
  queuedText: {
    marginTop: 10,
    color: "rgba(200, 170, 110, 0.35)",
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyPanel: {
    width: "88%",
    maxWidth: 360,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    color: colors.accentGold,
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
  },
  resetButton: {
    minHeight: 44,
    borderRadius: 10,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentGold,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.5)",
  },
  resetButtonPressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
  resetButtonText: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "900",
  },
});
