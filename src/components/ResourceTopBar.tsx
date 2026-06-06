import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Svg, { Circle, Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

import { colors, fonts } from "../theme/tokens";
import type { MetricKey, Metrics } from "../types/game";

type ResourceTopBarProps = {
  metrics: Metrics;
  generation: number;
  turn: number;
  onOpenSettings?: () => void;
};

const metricConfig: {
  key: MetricKey;
  label: string;
  color: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  { key: "pantry", label: "KİLER", color: "#d1cdc5", icon: "silverware-clean" },
  { key: "wealth", label: "KASA", color: colors.brass, icon: "gold" },
  {
    key: "security",
    label: "DÜZEN",
    color: colors.steel,
    icon: "shield-sword",
  },
  { key: "atmosphere", label: "RUH", color: colors.wine, icon: "drama-masks" },
];



function toRoman(n: number): string {
  const pairs: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  let remaining = n;
  for (const [value, numeral] of pairs) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }
  return result;
}

export function ResourceTopBar({
  metrics,
  generation,
  turn,
  onOpenSettings,
}: ResourceTopBarProps) {
  const { width } = useWindowDimensions();
  const logoSize = Math.min(width * 0.22, 85);

  return (
    <View style={styles.outerContainer}>
      {/* Removed Settings Button */}

      {/* Tavern Sign (Centered at Top) */}
      <View style={styles.tavernSignContainer}>
        <Image 
          source={require('../assets/logo.png')} 
          style={{ width: logoSize, height: logoSize, resizeMode: "contain" }}
        />
        <View style={[styles.titleArea, { marginTop: -logoSize * 0.12 }]}>
          <Text style={styles.innName}>Kadim Meşe</Text>
          <Text style={styles.innSubtitle}>HANI</Text>
        </View>
        <View style={styles.turnPill}>
          <Text style={styles.turnText}>
            {toRoman(generation)} · {turn}
          </Text>
        </View>
      </View>

      {/* Metrics Row */}
      <LinearGradient
        colors={["#1c1512", "#0f0b09", "#1a110e"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.containerGradient}
      >
        {}
        <View style={styles.topGlow} />

        <View style={styles.barsRow}>
          {metricConfig.map(({ key, label, color, icon }) => (
            <MetricCell
              key={key}
              iconName={icon}
              label={label}
              value={metrics[key]}
              color={color}
            />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

function MetricCell({
  iconName,
  label,
  value,
  color,
}: {
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: number;
  color: string;
}) {
  const animatedValue = useSharedValue(value);
  const isNearEdge = value <= 18 || value >= 82;
  const pulseOpacity = useSharedValue(0);

  const [changeDir, setChangeDir] = React.useState<"up" | "down" | null>(null);
  const prevValue = React.useRef(value);

  React.useEffect(() => {
    if (prevValue.current !== value) {
      if (value > prevValue.current) {
        setChangeDir("up");
      } else if (value < prevValue.current) {
        setChangeDir("down");
      }
      prevValue.current = value;

      const timer = setTimeout(() => {
        setChangeDir(null);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [value]);

  useEffect(() => {
    animatedValue.value = withTiming(value, { duration: 450 });
  }, [animatedValue, value]);

  useEffect(() => {
    if (isNearEdge) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 500 }),
          withTiming(0.2, { duration: 500 }),
        ),
        -1,
        true,
      );
    } else {
      pulseOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isNearEdge, pulseOpacity]);

  const fillStyle = useAnimatedStyle(() => ({
    height: `${animatedValue.value}%`,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const barColor = isNearEdge ? colors.ember : color;

  return (
    <View style={styles.metricCell}>
      <MaterialCommunityIcons name={iconName} size={18} color={barColor} />
      <View style={styles.verticalTrack}>
        <Animated.View style={[styles.verticalFill, fillStyle]}>
          <LinearGradient
            colors={[barColor, `${barColor}88`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          {}
          {changeDir && (
            <View style={styles.previewArrowContainer}>
              <MaterialIcons
                name={
                  changeDir === "up"
                    ? "keyboard-arrow-up"
                    : "keyboard-arrow-down"
                }
                size={16}
                color="#1c1512"
              />
            </View>
          )}
        </Animated.View>
        {isNearEdge && (
          <Animated.View style={[styles.verticalPulse, pulseStyle]} />
        )}
      </View>
      <Text style={[styles.metricLabel, isNearEdge && { color: colors.ember }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 16,
    shadowColor: "#c8aa6e",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    position: "relative",
    zIndex: 10,
  },
  containerGradient: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.25)",
    overflow: "hidden",
  },
  topGlow: {
    position: "absolute",
    top: 0,
    left: "10%",
    right: "10%",
    height: 1.5,
    backgroundColor: "rgba(200, 170, 110, 0.4)",
    shadowColor: "#c8aa6e",
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  tavernSignContainer: {
    alignItems: "center",
    paddingTop: 8,
    marginBottom: 16,
    gap: 4,
  },
  settingsButtonContainer: {
    position: "absolute",
    top: 16,
    right: 8,
    zIndex: 20,
    padding: 8,
  },
  titleArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  innName: {
    color: "#ebd6a7",
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1,
    textShadowColor: "rgba(200, 170, 110, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  innSubtitle: {
    color: "#8a7a60",
    fontFamily: fonts.serif,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
    marginTop: -2,
    marginBottom: 6,
  },
  turnPill: {
    backgroundColor: "rgba(200, 170, 110, 0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  turnText: {
    color: "#8a7a60",
    fontFamily: fonts.display,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  barsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    gap: 8,
  },
  metricCell: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  verticalTrack: {
    width: "100%",
    height: 32,
    borderRadius: 6,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.08)",
    overflow: "hidden",
    justifyContent: "flex-end",
    position: "relative",
  },
  verticalFill: {
    width: "100%",
    borderRadius: 4,
    overflow: "hidden",
  },
  verticalPulse: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.ember,
    borderRadius: 4,
    opacity: 0.3,
  },
  metricLabel: {
    color: "#8a7a60",
    fontFamily: fonts.display,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  previewArrowContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
