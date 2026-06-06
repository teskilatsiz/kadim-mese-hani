import { Platform } from "react-native";

export const colors = {
  ink: "#1a110b",
  inkLight: "#f0e6d2",
  night: "#0e1114",
  nightWarm: "#151210",

  accentGold: "#c8aa6e",
  accentCrimson: "#c8374d",
  accentTeal: "#5b8a72",
  accentAmber: "#e8a33d",

  sage: "#6a9f5b",
  brass: "#c8aa6e",
  steel: "#7b8fa3",
  wine: "#9b3a4a",
  ember: "#c8374d",

  panel: "#1e1a16",
  panelLight: "#2a2420",
  mist: "rgba(200, 170, 110, 0.08)",
  glassBorder: "rgba(200, 170, 110, 0.22)",
  shadow: "rgba(0, 0, 0, 0.65)",

  cardBg: "#1c1815",
  cardBorder: "rgba(200, 170, 110, 0.3)",
  cardGlow: "rgba(200, 170, 110, 0.08)",
};

export const fonts = {
  display: Platform.select({
    ios: "Palatino",
    android: "serif",
    default: "Georgia",
  }),
  body: Platform.select({
    ios: "Avenir Next",
    android: "sans-serif-medium",
    default: "system-ui",
  }),
  serif: Platform.select({
    ios: "Palatino",
    android: "serif",
    default: "Georgia",
  }),
};

export const metrics = {
  cardRadius: 14,
  glassRadius: 16,
};
