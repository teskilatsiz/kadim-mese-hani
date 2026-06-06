import React, { useCallback, useState, useRef } from "react";
import {
  FlatList,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { CharacterPortrait } from "../../assets/art/CharacterPortrait";
import { CardDetailSheet } from "../../components/CardDetailSheet";
import { TavernBackdrop } from "../../components/TavernBackdrop";
import { colors, fonts, metrics } from "../../theme/tokens";
import {
  allCards,
  selectCollection,
  selectAchievements,
  useGameStore,
} from "../../store/gameStore";
import { playUITap } from "../../utils/audioManager";
import type { Card, CollectionEntry, Achievement } from "../../types/game";

export default function CollectionScreen() {
  const collection = useGameStore(selectCollection);
  const achievements = useGameStore(selectAchievements);
  const { width } = useWindowDimensions();
  
  const [activeTab, setActiveTab] = useState<"collection" | "achievements">("collection");
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<CollectionEntry | null>(null);
  
  const clearUnreadCollections = useGameStore((s) => s.clearUnreadCollections);
  const clearUnreadAchievements = useGameStore((s) => s.clearUnreadAchievements);
  const clearNewFlags = useGameStore((s) => s.clearNewFlags);

  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  useFocusEffect(
    useCallback(() => {
      clearUnreadCollections();
      clearUnreadAchievements();
      return () => {
        clearNewFlags();
      };
    }, [clearUnreadCollections, clearUnreadAchievements, clearNewFlags])
  );

  const numColumns = width < 400 ? 2 : 3;
  const cardGap = 10;
  const cardW = (width - 28 - cardGap * (numColumns - 1)) / numColumns;
  const cardH = cardW * 1.45;

  const collectionMap = new Map(collection.map((e) => [e.cardId, e]));
  const encounteredCount = collection.length;
  const totalCount = allCards.length;
  
  const unlockedAchievementsCount = achievements.filter((a) => a.unlockedAt !== null).length;

  const handlePressCard = (card: Card, entry: CollectionEntry | undefined) => {
    playUITap();
    if (entry) {
      setSelectedCard(card);
      setSelectedEntry(entry);
    }
  };

  return (
    <View style={styles.screen}>
      <TavernBackdrop />
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {activeTab === "collection" ? "Keşifler" : "Başarımlar"}
          </Text>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              {activeTab === "collection" 
                ? `${encounteredCount}/${totalCount}` 
                : `${unlockedAchievementsCount}/${achievements.length}`}
            </Text>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabSwitcher}>
          <Pressable 
            style={[styles.tabButton, activeTab === "collection" && styles.activeTabButton]}
            onPress={() => { playUITap(); setActiveTab("collection"); }}
          >
            <Text style={[styles.tabText, activeTab === "collection" && styles.activeTabText]}>Keşifler</Text>
          </Pressable>
          <Pressable 
            style={[styles.tabButton, activeTab === "achievements" && styles.activeTabButton]}
            onPress={() => { playUITap(); setActiveTab("achievements"); }}
          >
            <Text style={[styles.tabText, activeTab === "achievements" && styles.activeTabText]}>Başarımlar</Text>
          </Pressable>
        </View>

        {activeTab === "collection" ? (
          <FlatList
            data={allCards}
            numColumns={numColumns}
            key={numColumns}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.grid, { gap: cardGap }]}
            columnWrapperStyle={{ gap: cardGap }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const entry = collectionMap.get(item.id);
              const unlocked = Boolean(entry);

              return (
                <Pressable
                  style={({ pressed }) => [
                    styles.cardWrapper,
                    { width: cardW, height: cardH },
                    pressed && unlocked && styles.cardPressed,
                  ]}
                  onPress={() => handlePressCard(item, entry)}
                  disabled={!unlocked}
                >
                  <View style={{ flex: 1, borderRadius: 10, padding: 2, overflow: "hidden", backgroundColor: "#3a2818" }}>
                    {unlocked && entry?.isNew ? (
                      <>
                        <LinearGradient
                          colors={["#c8aa6e", "#6a5030", "#3a2818", "#6a5030", "#c8aa6e"]}
                          locations={[0, 0.25, 0.5, 0.75, 1]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={StyleSheet.absoluteFill}
                        />
                        <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>
                          <Animated.View
                            style={[
                              {
                                width: 800,
                                height: 800,
                              },
                              rotateStyle,
                            ]}
                          >
                            <LinearGradient
                              colors={["transparent", "transparent", "#fff5d1", "#c8aa6e", "transparent", "transparent"]}
                              locations={[0, 0.4, 0.48, 0.52, 0.6, 1]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={{ flex: 1 }}
                            />
                          </Animated.View>
                        </View>
                      </>
                    ) : (
                      <LinearGradient
                        colors={
                          unlocked
                            ? ["#c8aa6e", "#6a5030", "#3a2818", "#6a5030", "#c8aa6e"]
                            : ["#2a2420", "#1a1614", "#2a2420"]
                        }
                        locations={unlocked ? [0, 0.25, 0.5, 0.75, 1] : [0, 0.5, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                    )}
                    <View style={styles.cardInner}>
                      {unlocked ? (
                        <>
                  <View style={styles.portraitSmall}>
                    <CharacterPortrait variant={item.portraitKey} />
                  </View>
                  <Text
                    style={styles.cardName}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.6}
                  >
                    {item.characterName}
                  </Text>
                  {(entry?.timesEncountered ?? 0) > 1 && (
                    <View style={styles.encounterBadge}>
                      <Text style={styles.encounterText}>
                        ×{entry?.timesEncountered}
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <>
                  <LockedPortrait item={item} />
                  <Text style={styles.lockedName}>Bilinmiyor</Text>
                </>
              )}
            </View>
          </View>
        </Pressable>
              );
            }}
          />
        ) : (
          <>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(unlockedAchievementsCount / achievements.length) * 100}%` },
                ]}
              />
            </View>
            <FlatList
              data={achievements}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <AchievementRow achievement={item} />
              )}
            />
          </>
        )}
      </SafeAreaView>

      <CardDetailSheet
        card={selectedCard}
        entry={selectedEntry}
        onClose={() => {
          setSelectedCard(null);
          setSelectedEntry(null);
        }}
      />
    </View>
  );
}

function LockedPortrait({ item }: { item: Card }) {
  const blurRef = useRef<View>(null);

  return (
    <View style={styles.portraitSmall} ref={blurRef}>
      <View style={{ flex: 1, opacity: 0.3 }}>
        <CharacterPortrait variant={item.portraitKey} />
      </View>
      <View style={StyleSheet.absoluteFillObject}>
        <BlurView
          blurMethod="dimezisBlurView"
          blurTarget={blurRef}
          intensity={100}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.portraitLocked}>
          <View style={styles.lockIcon}>
            <Text style={styles.flatQuestion}>?</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function AchievementRow({ achievement }: { achievement: Achievement }) {
  const unlocked = achievement.unlockedAt !== null;
  const isNew = achievement.isNew;

  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (isNew) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 6000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      rotation.value = 0;
    }
  }, [isNew]);

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.rowOuter, !unlocked && styles.rowLocked]}>
      {unlocked ? (
        <View style={{ borderRadius: 12, overflow: "hidden", padding: isNew ? 1.5 : 1, backgroundColor: "rgba(200, 170, 110, 0.18)" }}>
          {isNew && (
            <View style={[StyleSheet.absoluteFill, { zIndex: 0 }]}>
              <LinearGradient
                colors={["#ebd7a1", "#8a6a38", "#4a3820", "#8a6a38", "#ebd7a1"]}
                locations={[0, 0.25, 0.5, 0.75, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>
                <Animated.View
                  style={[
                    {
                      width: 800,
                      height: 800,
                    },
                    rotateStyle,
                  ]}
                >
                  <LinearGradient
                    colors={["transparent", "transparent", "#fff5d1", "#c8aa6e", "transparent", "transparent"]}
                    locations={[0, 0.4, 0.48, 0.52, 0.6, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1 }}
                  />
                </Animated.View>
              </View>
            </View>
          )}
          <View style={{ backgroundColor: "#14100c", borderRadius: 11, overflow: "hidden", zIndex: 1 }}>
            <LinearGradient
              colors={[
                "rgba(200, 170, 110, 0.12)",
                "rgba(200, 170, 110, 0.04)",
                "rgba(200, 170, 110, 0.08)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.rowGradient, { borderWidth: 0 }]}
            >
              <AchievementContent achievement={achievement} unlocked isNew={isNew} />
            </LinearGradient>
          </View>
        </View>
      ) : (
        <View style={styles.rowPlain}>
          <AchievementContent achievement={achievement} unlocked={false} isNew={false} />
        </View>
      )}
    </View>
  );
}

function AchievementContent({
  achievement,
  unlocked,
  isNew,
  rotateStyle,
}: {
  achievement: Achievement;
  unlocked: boolean;
  isNew: boolean;
  rotateStyle?: any;
}) {
  return (
    <>
      <View style={[styles.iconOuter, unlocked && styles.iconOuterUnlocked]}>
        <View style={[styles.iconInner, unlocked && styles.iconInnerUnlocked]}>
          {unlocked ? (
            <MaterialCommunityIcons
              name={achievement.icon as any}
              size={24}
              color="#f0e6d2"
            />
          ) : (
            <MaterialCommunityIcons name="lock" size={20} color="#5a4a38" />
          )}
        </View>
      </View>
      <View style={styles.info}>
        <Text
          style={[styles.achTitle, !unlocked && styles.achTitleLocked]}
          numberOfLines={1}
        >
          {achievement.title}
        </Text>
        <Text
          style={[styles.achDesc, !unlocked && styles.achDescLocked]}
          numberOfLines={2}
        >
          {achievement.description}
        </Text>
        {unlocked && achievement.unlockedAt !== null && (
          <View style={styles.unlockBadge}>
            <Text style={styles.unlockText}>
              Nesil {achievement.unlockedAt}
            </Text>
          </View>
        )}
      </View>
      {unlocked && (
        <View style={styles.checkmark}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#1a1510" },
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    color: colors.accentGold,
    fontFamily: fonts.display,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1,
  },
  counterBadge: {
    backgroundColor: "rgba(200, 170, 110, 0.12)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  counterText: {
    color: colors.accentGold,
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: "800",
  },
  
  tabSwitcher: {
    flexDirection: "row",
    marginHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "rgba(14, 17, 20, 0.6)",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.15)",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: "rgba(200, 170, 110, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.25)",
  },
  tabText: {
    fontFamily: fonts.display,
    fontSize: 14,
    fontWeight: "700",
    color: "#8a7a60",
  },
  activeTabText: {
    color: colors.accentGold,
    fontWeight: "900",
  },

  grid: { paddingHorizontal: 14, paddingBottom: 100 },
  cardWrapper: { borderRadius: 10 },
  cardPressed: { transform: [{ scale: 0.96 }], opacity: 0.9 },
  cardBorder: { flex: 1, borderRadius: 10, padding: 2 },
  cardInner: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: colors.cardBg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.1)",
  },
  portraitSmall: { flex: 1, overflow: "hidden" },
  cardName: {
    color: colors.accentGold,
    fontFamily: fonts.display,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  portraitLocked: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(14, 17, 20, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  lockIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(200, 170, 110, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  flatQuestion: {
    fontFamily: fonts.serif,
    fontSize: 26,
    color: "rgba(200, 170, 110, 0.5)",
    fontWeight: "400",
  },
  lockedName: {
    color: "#4a3c2e",
    fontFamily: fonts.display,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
    paddingVertical: 6,
  },
  encounterBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(200, 170, 110, 0.8)",
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  encounterText: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 9,
    fontWeight: "900",
  },
  
  progressTrack: {
    marginHorizontal: 14,
    marginTop: 0,
    marginBottom: 12,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(200, 170, 110, 0.08)",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: colors.accentGold,
  },
  list: { paddingHorizontal: 14, paddingBottom: 100, gap: 8 },
  rowOuter: { borderRadius: 12, overflow: "hidden" },
  rowLocked: { opacity: 0.45 },
  rowGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.18)",
  },
  rowPlain: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.06)",
    backgroundColor: "rgba(14, 17, 20, 0.6)",
  },
  iconOuter: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "rgba(200, 170, 110, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(14, 17, 20, 0.4)",
  },
  iconOuterUnlocked: {
    borderColor: "rgba(200, 170, 110, 0.35)",
    backgroundColor: "rgba(200, 170, 110, 0.06)",
  },
  iconInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(200, 170, 110, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconInnerUnlocked: {
    backgroundColor: "rgba(200, 170, 110, 0.15)",
  },
  info: { flex: 1 },
  achTitle: {
    color: "#f0e6d2",
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: "800",
  },
  achTitleLocked: { color: "#4a4032" },
  achDesc: {
    color: "#9a8a6a",
    fontFamily: fonts.serif,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  achDescLocked: { color: "#302820" },
  unlockBadge: {
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: "rgba(200, 170, 110, 0.1)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  unlockText: {
    color: "#c8aa6e",
    fontFamily: fonts.body,
    fontSize: 9,
    fontWeight: "700",
  },
  checkmark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accentGold,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#c8aa6e",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  checkText: { color: colors.ink, fontSize: 16, fontWeight: "900" },
});
