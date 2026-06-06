import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from "react-native-svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fonts } from "../../theme/tokens";
import { useGameStore } from "../../store/gameStore";

function SwordIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line
        x1="6"
        y1="18"
        x2="18"
        y2="6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Line
        x1="16"
        y1="4"
        x2="20"
        y2="4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Line
        x1="20"
        y1="4"
        x2="20"
        y2="8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Line
        x1="9"
        y1="15"
        x2="5"
        y2="19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Line
        x1="8"
        y1="12"
        x2="12"
        y2="16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function BookIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v17H6.5a2.5 2.5 0 0 0 0 5H20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1="9"
        y1="7"
        x2="16"
        y2="7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.6}
      />
      <Line
        x1="9"
        y1="10"
        x2="14"
        y2="10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.6}
      />
    </Svg>
  );
}

function TrophyIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 2h12v6a6 6 0 0 1-12 0V2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Path
        d="M6 4H3v2a3 3 0 0 0 3 3"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 4h3v2a3 3 0 0 1-3 3"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1="12"
        y1="14"
        x2="12"
        y2="18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path d="M8 22h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path
        d="M8 22l1-4h6l1 4"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function TabsLayout() {
  const unreadCollections = useGameStore((s) => s.unreadCollections);
  const unreadAchievements = useGameStore((s) => s.unreadAchievements);
  const totalUnread = unreadCollections + unreadAchievements;
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 60 + Math.max(insets.bottom, 10),
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ],
        tabBarActiveTintColor: colors.accentGold,
        tabBarInactiveTintColor: "#5a4e3a",
        tabBarLabelStyle: styles.tabLabel,
        tabBarBadgeStyle: styles.badge,
      }}
    >
      <Tabs.Screen
        name="game"
        options={{
          title: "Han",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="barn" color={color} size={size + 4} />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: "Koleksiyon",
          tabBarIcon: ({ color, size }) => (
            <BookIcon color={color} size={size} />
          ),
          tabBarBadge: totalUnread > 0 ? totalUnread : undefined,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Ayarlar",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#0e1114",
    borderTopWidth: 1,
    borderTopColor: "rgba(200, 170, 110, 0.15)",
    paddingTop: 6,
    elevation: 0,
  },
  tabLabel: {
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: "#c8374d",
    color: "#f0e6d2",
    fontFamily: fonts.body,
    fontSize: 10,
    fontWeight: "900",
    marginTop: -4,
  },
});
