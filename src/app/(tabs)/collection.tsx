import { useCallback, useState, useRef } from "react";
import {
  FlatList,
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

import { CharacterPortrait } from "../../assets/art/CharacterPortrait";
import { CardDetailSheet } from "../../components/CardDetailSheet";
import { TavernBackdrop } from "../../components/TavernBackdrop";
import { colors, fonts, metrics } from "../../theme/tokens";
import {
  allCards,
  selectCollection,
  useGameStore,
} from "../../store/gameStore";
import { playUITap } from "../../utils/audioManager";
import type { Card, CollectionEntry } from "../../types/game";

export default function CollectionScreen() {
  const collection = useGameStore(selectCollection);
  const { width } = useWindowDimensions();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<CollectionEntry | null>(
    null,
  );
  const clearUnreadCollections = useGameStore((s) => s.clearUnreadCollections);

  useFocusEffect(
    useCallback(() => {
      clearUnreadCollections();
    }, [clearUnreadCollections]),
  );

  const numColumns = width < 400 ? 2 : 3;
  const cardGap = 10;
  const cardW = (width - 28 - cardGap * (numColumns - 1)) / numColumns;
  const cardH = cardW * 1.45;

  const collectionMap = new Map(collection.map((e) => [e.cardId, e]));
  const encounteredCount = collection.length;
  const totalCount = allCards.length;

  const handlePress = (card: Card, entry: CollectionEntry | undefined) => {
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
          <Text style={styles.title}>Koleksiyon</Text>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              {encounteredCount}/{totalCount}
            </Text>
          </View>
        </View>

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
                onPress={() => handlePress(item, entry)}
                disabled={!unlocked}
              >
                <LinearGradient
                  colors={
                    unlocked
                      ? ["#c8aa6e", "#6a5030", "#3a2818", "#6a5030", "#c8aa6e"]
                      : ["#2a2420", "#1a1614", "#2a2420"]
                  }
                  locations={unlocked ? [0, 0.25, 0.5, 0.75, 1] : [0, 0.5, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardBorder}
                >
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
                </LinearGradient>
              </Pressable>
            );
          }}
        />
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
});
