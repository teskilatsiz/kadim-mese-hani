import { useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { LiquidGlassPanel } from "../../components/LiquidGlassPanel";
import { TavernBackdrop } from "../../components/TavernBackdrop";
import { colors, fonts } from "../../theme/tokens";
import { selectAchievements, useGameStore } from "../../store/gameStore";
import type { Achievement } from "../../types/game";

export default function AchievementsScreen() {
  const achievements = useGameStore(selectAchievements);
  const unlockedCount = achievements.filter(
    (a) => a.unlockedAt !== null,
  ).length;
  const clearUnreadAchievements = useGameStore(
    (s) => s.clearUnreadAchievements,
  );

  useFocusEffect(
    useCallback(() => {
      clearUnreadAchievements();
    }, [clearUnreadAchievements]),
  );

  return (
    <View style={styles.screen}>
      <TavernBackdrop />
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Başarımlar</Text>
            <Text style={styles.subtitle}>Han'ın efsanevi anıları</Text>
          </View>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              {unlockedCount}/{achievements.length}
            </Text>
          </View>
        </View>

        {}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${(unlockedCount / achievements.length) * 100}%` },
            ]}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {achievements.map((ach) => (
            <AchievementRow key={ach.id} achievement={ach} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function AchievementRow({ achievement }: { achievement: Achievement }) {
  const unlocked = achievement.unlockedAt !== null;

  return (
    <View style={[styles.rowOuter, !unlocked && styles.rowLocked]}>
      {unlocked ? (
        <LinearGradient
          colors={[
            "rgba(200, 170, 110, 0.12)",
            "rgba(200, 170, 110, 0.04)",
            "rgba(200, 170, 110, 0.08)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.rowGradient}
        >
          <AchievementContent achievement={achievement} unlocked />
        </LinearGradient>
      ) : (
        <View style={styles.rowPlain}>
          <AchievementContent achievement={achievement} unlocked={false} />
        </View>
      )}
    </View>
  );
}

function AchievementContent({
  achievement,
  unlocked,
}: {
  achievement: Achievement;
  unlocked: boolean;
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
    paddingBottom: 4,
  },
  title: {
    color: colors.accentGold,
    fontFamily: fonts.display,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1,
  },
  subtitle: {
    color: "#6a5a42",
    fontFamily: fonts.serif,
    fontSize: 12,
    marginTop: 1,
  },
  counterBadge: {
    backgroundColor: "rgba(200, 170, 110, 0.12)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.25)",
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  counterText: {
    color: colors.accentGold,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "800",
  },
  progressTrack: {
    marginHorizontal: 14,
    marginTop: 8,
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
  iconText: { fontSize: 22 },
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
