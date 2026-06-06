import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, {
  Circle,
  Rect,
  Path,
  Polygon,
  G,
  Ellipse,
  ClipPath,
  Defs,
  Line,
} from "react-native-svg";

type CharacterPortraitProps = {
  variant: string;
};

const C: Record<string, any> = {
  alchemist: {
    bg: "#1c2826",
    skin: "#d6b381",
    cloth: "#2d5446",
    hair: "#8f8365",
    accent: "#62d99d",
    prop: "flask",
  },
  princess: {
    bg: "#1a1423",
    skin: "#fdf1e6",
    cloth: "#571c46",
    hair: "#e6c86a",
    accent: "#f2cd5c",
    prop: "crown",
  },
  knight: {
    bg: "#1c212b",
    skin: "#c9a175",
    cloth: "#425166",
    hair: "#1d222b",
    accent: "#9ebad6",
    prop: "helmet",
  },
  inspector: {
    bg: "#2b231a",
    skin: "#c28b5d",
    cloth: "#422f1c",
    hair: "#402e21",
    accent: "#cca13d",
    prop: "monocle",
  },
  hunter: {
    bg: "#1b2618",
    skin: "#ad7e58",
    cloth: "#364a22",
    hair: "#382a1d",
    accent: "#7cba54",
    prop: "fur",
  },
  bard: {
    bg: "#2b1933",
    skin: "#cf9f6f",
    cloth: "#5e2373",
    hair: "#572b15",
    accent: "#d78ce6",
    prop: "lute",
  },
  merchant: {
    bg: "#2e1e16",
    skin: "#c78f5e",
    cloth: "#733e14",
    hair: "#291b11",
    accent: "#e3ad30",
    prop: "gold",
  },
  guard: {
    bg: "#1d212b",
    skin: "#a87551",
    cloth: "#2e3542",
    hair: "#171921",
    accent: "#a4b3cc",
    prop: "spear",
  },
  hooded: {
    bg: "#151017",
    skin: "#e6c8b8",
    cloth: "#361e2b",
    hair: "#1a1014",
    accent: "#b55a7b",
  },
  spirit: {
    bg: "#132121",
    skin: "#8dc2a3",
    cloth: "#193b30",
    hair: "#b6e3c9",
    accent: "#6fe8ab",
    prop: "glow",
  },
  cook: {
    bg: "#291f13",
    skin: "#b88255",
    cloth: "#8c6722",
    hair: "#4a331c",
    accent: "#ebd59d",
    prop: "apron",
  },
  gambler: {
    bg: "#2b131e",
    skin: "#b58362",
    cloth: "#661a35",
    hair: "#1f1116",
    accent: "#cca123",
    prop: "cards",
  },
  caravan: {
    bg: "#1a2229",
    skin: "#ad7e58",
    cloth: "#465937",
    hair: "#2e261f",
    accent: "#72a88a",
    prop: "turban",
  },
  guild: {
    bg: "#291e13",
    skin: "#b8855a",
    cloth: "#5e431d",
    hair: "#332314",
    accent: "#d1ab52",
    prop: "mask",
  },

  pirate: {
    bg: "#0e1a26",
    skin: "#b8855a",
    cloth: "#1a1a2a",
    hair: "#111",
    accent: "#c42b2b",
  },
  bandit: {
    bg: "#1a120e",
    skin: "#a07050",
    cloth: "#2a1a10",
    hair: "#1a0e08",
    accent: "#8a4a2a",
  },
  elder_woman: {
    bg: "#1e1820",
    skin: "#c8a888",
    cloth: "#3a2a30",
    hair: "#a0a0a0",
    accent: "#8a6a8a",
  },
  child: {
    bg: "#1e2218",
    skin: "#e0b888",
    cloth: "#4a3a22",
    hair: "#6a4a28",
    accent: "#d0a060",
  },
  old_keeper: {
    bg: "#261e14",
    skin: "#c09060",
    cloth: "#5a3a1a",
    hair: "#8a8a8a",
    accent: "#c8aa6e",
  },
  inventor: {
    bg: "#1a1e24",
    skin: "#d0a870",
    cloth: "#3a3a2a",
    hair: "#5a3a1a",
    accent: "#c0a030",
  },
  sailor: {
    bg: "#0e1828",
    skin: "#c08868",
    cloth: "#2a2a4a",
    hair: "#2a1a10",
    accent: "#5a8aba",
  },
  rival: {
    bg: "#142014",
    skin: "#c09068",
    cloth: "#2a4a2a",
    hair: "#2a1a0e",
    accent: "#4aaa4a",
  },
  pilgrim: {
    bg: "#22201a",
    skin: "#8a6a4a",
    cloth: "#d0c8b0",
    hair: "#1a1a1a",
    accent: "#e0d0a0",
  },
  ghost: {
    bg: "#101828",
    skin: "#8090a8",
    cloth: "#3a4a5a",
    hair: "#6a7a8a",
    accent: "#a0c0e0",
  },
};

const CUSTOM_HEAD_VARIANTS = ["knight", "princess", "hooded", "ghost", "child"];

export const CharacterPortrait = React.memo(function CharacterPortrait({
  variant,
}: CharacterPortraitProps) {
  const p = C[variant] ?? C.hooded;

  const cx = 132;
  const cy = 110;

  const isWide =
    variant === "merchant" || variant === "cook" || variant === "old_keeper";
  const headW = variant === "child" ? 32 : isWide ? 48 : 36;
  const headH = variant === "child" ? 36 : isWide ? 44 : 48;

  const renderBackground = () => (
    <Rect x="0" y="0" width="264" height="320" fill={p.bg} />
  );

  const renderBody = () => {
    if (variant === "ghost") {
      return (
        <G>
          <Path
            d={`M${cx - 40} 320 Q${cx - 50} 200 ${cx} 170 Q${cx + 50} 200 ${cx + 40} 320 Z`}
            fill={p.cloth}
            opacity={0.5}
          />
          <Path
            d={`M${cx - 30} 320 Q${cx - 35} 250 ${cx} 200 Q${cx + 35} 250 ${cx + 30} 320 Z`}
            fill={p.cloth}
            opacity={0.3}
          />
        </G>
      );
    }
    if (variant === "child") {
      return (
        <Path
          d={`M60 320 L${cx - 50} 200 Q${cx} 175 ${cx + 50} 200 L204 320 Z`}
          fill={p.cloth}
        />
      );
    }

    return (
      <Path
        d={`M40 320 L${cx - 70} 180 Q${cx} 150 ${cx + 70} 180 L224 320 Z`}
        fill={p.cloth}
      />
    );
  };

  const renderHead = () => {
    if (CUSTOM_HEAD_VARIANTS.includes(variant)) return null;

    return (
      <G>
        {}
        <Rect x={cx - 12} y={cy + 20} width="24" height="30" fill={p.skin} />
        {}
        <Ellipse cx={cx} cy={cy} rx={headW} ry={headH} fill={p.skin} />
      </G>
    );
  };

  const renderFace = () => {
    if (CUSTOM_HEAD_VARIANTS.includes(variant)) return null;

    const eyeY = cy - 4;
    const eyeR = variant === "elder_woman" ? 3 : 3.5;
    const eyeSpacing = 16;
    const eyeColor = variant === "spirit" ? p.accent : "#111";

    return (
      <G>
        {}
        <Circle cx={cx - eyeSpacing} cy={eyeY} r={eyeR} fill={eyeColor} />
        <Circle cx={cx + eyeSpacing} cy={eyeY} r={eyeR} fill={eyeColor} />

        {}
        {variant !== "spirit" && (
          <Path
            d={`M${cx} ${cy + 2} L${cx - 4} ${cy + 10} L${cx} ${cy + 10}`}
            stroke="#111"
            strokeWidth="1.5"
            fill="none"
            opacity={0.5}
          />
        )}

        {}
        {variant === "caravan" && (
          <Path
            d={`M${cx + 10} ${cy - 12} L${cx + 24} ${cy + 14}`}
            stroke="#9c3838"
            strokeWidth="2.5"
            opacity={0.8}
          />
        )}
      </G>
    );
  };

  const renderFeatures = () => {
    switch (variant) {
      case "alchemist":
        return (
          <G>
            {}
            <Circle
              cx={cx - 16}
              cy={cy - 4}
              r="10"
              stroke={p.accent}
              strokeWidth="2"
              fill="none"
            />
            <Circle
              cx={cx + 16}
              cy={cy - 4}
              r="10"
              stroke={p.accent}
              strokeWidth="2"
              fill="none"
            />
            <Line
              x1={cx - 6}
              y1={cy - 4}
              x2={cx + 6}
              y2={cy - 4}
              stroke={p.accent}
              strokeWidth="2"
            />
            {}
            <Path
              d="M190 260 L210 300 L170 300 Z"
              fill={p.accent}
              opacity={0.9}
            />
            <Rect
              x="186"
              y="240"
              width="8"
              height="20"
              fill={p.accent}
              opacity={0.6}
            />
            <Circle cx="190" cy="270" r="4" fill="#fff" opacity={0.4} />
          </G>
        );

      case "princess":
        return (
          <G transform="translate(0, 25)">
            {}
            <Path
              d={`M40 320 L${cx - 55} 175 Q${cx} 150 ${cx + 55} 175 L224 320 Z`}
              fill={p.cloth}
            />
            <Path
              d={`M${cx - 20} 170 L${cx} 230 L${cx + 20} 170`}
              fill="#3f1433"
            />
            <Path
              d={`M${cx - 30} 175 L${cx} 220 L${cx + 30} 175`}
              stroke={p.accent}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />

            {}
            <Path
              d={`M${cx - 30} ${cy - 40} C${cx - 60} ${cy - 20} ${cx - 70} ${cy + 60} ${cx - 40} ${cy + 130} L${cx + 40} ${cy + 130} C${cx + 70} ${cy + 60} ${cx + 60} ${cy - 20} ${cx + 30} ${cy - 40} Z`}
              fill={p.hair}
            />

            {}
            <Path
              d={`M${cx - 8} ${cy + 20} L${cx - 10} ${cy + 60} L${cx + 10} ${cy + 60} L${cx + 8} ${cy + 20} Z`}
              fill={p.skin}
            />

            {}
            <Path
              d={`M${cx - 32} ${cy - 40} C${cx - 34} ${cy + 15} ${cx - 18} ${cy + 46} ${cx} ${cy + 52} C${cx + 18} ${cy + 46} ${cx + 34} ${cy + 15} ${cx + 32} ${cy - 40} Z`}
              fill={p.skin}
            />

            {}
            <Path
              d={`M${cx - 32} ${cy - 40} C${cx - 20} ${cy - 65} ${cx + 30} ${cy - 60} ${cx + 32} ${cy - 40} C${cx + 10} ${cy - 30} ${cx - 10} ${cy - 25} ${cx - 32} ${cy - 40} Z`}
              fill={p.hair}
            />
            <Path
              d={`M${cx - 32} ${cy - 40} C${cx - 40} ${cy - 10} ${cx - 35} ${cy + 50} ${cx - 25} ${cy + 70} C${cx - 20} ${cy + 40} ${cx - 15} ${cy} ${cx - 10} ${cy - 25} Z`}
              fill={p.hair}
            />
            <Path
              d={`M${cx + 32} ${cy - 40} C${cx + 40} ${cy - 10} ${cx + 35} ${cy + 50} ${cx + 25} ${cy + 70} C${cx + 20} ${cy + 40} ${cx + 15} ${cy} ${cx + 10} ${cy - 25} Z`}
              fill={p.hair}
            />

            {}
            <Path
              d={`M${cx - 22} ${cy - 2} Q${cx - 15} ${cy - 10} ${cx - 8} ${cy - 2}`}
              stroke="#111"
              strokeWidth="2"
              fill="none"
            />
            <Path
              d={`M${cx - 22} ${cy - 2} Q${cx - 26} ${cy - 5} ${cx - 28} ${cy - 8}`}
              stroke="#111"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <Circle cx={cx - 15} cy={cy - 1} r="3" fill="#3a7ca5" />
            <Path
              d={`M${cx - 20} ${cy - 14} Q${cx - 15} ${cy - 16} ${cx - 10} ${cy - 12}`}
              stroke="#c79740"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />

            <Path
              d={`M${cx + 22} ${cy - 2} Q${cx + 15} ${cy - 10} ${cx + 8} ${cy - 2}`}
              stroke="#111"
              strokeWidth="2"
              fill="none"
            />
            <Path
              d={`M${cx + 22} ${cy - 2} Q${cx + 26} ${cy - 5} ${cx + 28} ${cy - 8}`}
              stroke="#111"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <Circle cx={cx + 15} cy={cy - 1} r="3" fill="#3a7ca5" />
            <Path
              d={`M${cx + 20} ${cy - 14} Q${cx + 15} ${cy - 16} ${cx + 10} ${cy - 12}`}
              stroke="#c79740"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />

            {}
            <Path
              d={`M${cx} ${cy + 6} Q${cx - 2} ${cy + 18} ${cx} ${cy + 18}`}
              stroke="#e6bca3"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />

            {}
            <Path
              d={`M${cx - 8} ${cy + 30} Q${cx} ${cy + 26} ${cx + 8} ${cy + 30} Q${cx} ${cy + 32} ${cx - 8} ${cy + 30}`}
              fill="#c94560"
            />
            <Path
              d={`M${cx - 8} ${cy + 30} Q${cx} ${cy + 36} ${cx + 8} ${cy + 30} Q${cx} ${cy + 32} ${cx - 8} ${cy + 30}`}
              fill="#eb6582"
            />

            {}
            <Ellipse
              cx={cx - 16}
              cy={cy + 14}
              rx="7"
              ry="4"
              fill="#e8849b"
              opacity={0.3}
            />
            <Ellipse
              cx={cx + 16}
              cy={cy + 14}
              rx="7"
              ry="4"
              fill="#e8849b"
              opacity={0.3}
            />

            {}
            {}
            <Path
              d={`M${cx - 28} ${cy - 50} Q${cx} ${cy - 40} ${cx + 28} ${cy - 50}`}
              stroke={p.accent}
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />

            {}
            <Path
              d={`M${cx - 22} ${cy - 48} Q${cx - 15} ${cy - 65} ${cx} ${cy - 72} Q${cx + 15} ${cy - 65} ${cx + 22} ${cy - 48}`}
              stroke={p.accent}
              strokeWidth="2"
              fill="none"
            />
            <Path
              d={`M${cx - 12} ${cy - 45} Q${cx - 5} ${cy - 85} ${cx} ${cy - 85} Q${cx + 5} ${cy - 85} ${cx + 12} ${cy - 45}`}
              stroke={p.accent}
              strokeWidth="2.5"
              fill="none"
            />

            {}
            <Polygon
              points={`${cx},${cy - 85} ${cx - 7},${cy - 70} ${cx},${cy - 60} ${cx + 7},${cy - 70}`}
              fill="#2973b5"
              stroke="#75bced"
              strokeWidth="1"
            />

            {}
            <Circle cx={cx - 14} cy={cy - 58} r="2.5" fill="#ffffff" />
            <Circle cx={cx + 14} cy={cy - 58} r="2.5" fill="#ffffff" />
            <Circle cx={cx - 22} cy={cy - 48} r="1.5" fill="#ffffff" />
            <Circle cx={cx + 22} cy={cy - 48} r="1.5" fill="#ffffff" />

            {}
            <Path
              d={`M${cx} ${cy - 42} L${cx} ${cy - 38}`}
              stroke={p.accent}
              strokeWidth="1.5"
            />
            <Polygon
              points={`${cx},${cy - 38} ${cx - 3},${cy - 33} ${cx},${cy - 28} ${cx + 3},${cy - 33}`}
              fill="#2973b5"
            />
          </G>
        );

      case "knight":
        return (
          <G>
            {}
            <Path
              d={`M40 320 L${cx - 80} 180 L${cx + 80} 180 L224 320 Z`}
              fill={p.cloth}
            />
            <Polygon
              points={`${cx - 40},200 ${cx + 40},200 ${cx},260`}
              fill={p.accent}
              opacity={0.3}
            />
            {}
            <Rect
              x={cx - 30}
              y={cy - 40}
              width="60"
              height="70"
              rx="15"
              fill={p.cloth}
            />
            <Rect
              x={cx - 30}
              y={cy - 40}
              width="60"
              height="20"
              rx="10"
              fill={p.accent}
              opacity={0.5}
            />
            {}
            <Rect
              x={cx - 20}
              y={cy - 4}
              width="40"
              height="8"
              rx="2"
              fill="#111"
            />
          </G>
        );

      case "inspector":
        return (
          <G>
            {}
            <Circle
              cx={cx + 16}
              cy={cy - 4}
              r="10"
              stroke={p.accent}
              strokeWidth="2"
              fill="none"
            />
            <Line
              x1={cx + 24}
              y1={cy}
              x2={cx + 34}
              y2={cy + 10}
              stroke={p.accent}
              strokeWidth="2"
            />
            {}
            <Path
              d={`M${cx - 16} ${cy + 14} Q${cx} ${cy + 8} ${cx + 16} ${cy + 14} Q${cx} ${cy + 16} ${cx - 16} ${cy + 14}`}
              fill={p.hair}
            />
            {}
            <Rect
              x="160"
              y="220"
              width="60"
              height="80"
              rx="4"
              fill={p.accent}
              transform="rotate(-15 160 220)"
            />
          </G>
        );

      case "hunter":
        return (
          <G>
            {}
            <Path
              d={`M${cx - 60} 180 Q${cx} 220 ${cx + 60} 180 Q${cx} 160 ${cx - 60} 180`}
              fill="#594433"
            />
            <Path
              d={`M${cx - 50} 190 Q${cx} 230 ${cx + 50} 190 Q${cx} 170 ${cx - 50} 190`}
              fill="#453426"
            />
            {}
            <Path
              d="M60 180 Q20 250 60 320"
              stroke={p.accent}
              strokeWidth="4"
              fill="none"
            />
            <Line
              x1="60"
              y1="180"
              x2="60"
              y2="320"
              stroke="#fff"
              strokeWidth="1"
              opacity={0.5}
            />
          </G>
        );

      case "bard":
        return (
          <G>
            {}
            <Path
              d={`M${cx - 40} ${cy - 20} Q${cx} ${cy - 60} ${cx + 40} ${cy - 20} Z`}
              fill={p.accent}
            />
            <Circle cx={cx - 30} cy={cy - 10} r="8" fill={p.accent} />
            <Circle cx={cx + 30} cy={cy - 10} r="8" fill={p.accent} />
            {}
            <Ellipse
              cx="190"
              cy="260"
              rx="30"
              ry="40"
              fill="#8c5830"
              transform="rotate(30 190 260)"
            />
            <Line
              x1="165"
              y1="220"
              x2="140"
              y2="180"
              stroke="#8c5830"
              strokeWidth="8"
            />
            <Circle cx="185" cy="255" r="10" fill="#2b1a0d" />
          </G>
        );

      case "merchant":
        return (
          <G>
            {}
            <Path
              d={`M${cx - 48} ${cy - 20} Q${cx} ${cy - 40} ${cx + 48} ${cy - 20} L${cx + 40} ${cy - 44} Q${cx} ${cy - 50} ${cx - 40} ${cy - 44} Z`}
              fill="#8a2727"
            />
            <Path
              d={`M${cx + 40} ${cy - 30} Q${cx + 55} ${cy - 20} ${cx + 50} ${cy - 5} Q${cx + 45} ${cy - 15} ${cx + 40} ${cy - 30}`}
              fill="#8a2727"
            />
            {}
            <Circle
              cx={cx - 46}
              cy={cy + 10}
              r="6"
              stroke="#e0a848"
              strokeWidth="2.5"
              fill="none"
            />
            {}
            <Path
              d={`M${cx - 20} ${cy + 16} Q${cx} ${cy + 40} ${cx + 20} ${cy + 16} Q${cx} ${cy + 25} ${cx - 20} ${cy + 16}`}
              fill={p.hair}
            />
            {}
            <Path
              d={`M${cx + 10} ${cy + 22} L${cx + 30} ${cy + 30} L${cx + 32} ${cy + 22}`}
              stroke="#5c4b3a"
              strokeWidth="3"
              fill="none"
            />
            <Circle cx={cx + 32} cy={cy + 22} r="4" fill="#a86032" />
            <Circle cx={cx + 32} cy={cy + 16} r="3" fill="#fff" opacity={0.3} />
            {}
            <Circle cx="180" cy="240" r="16" fill={p.accent} />
            <Circle cx="196" cy="250" r="16" fill={p.accent} />
            <Circle cx="170" cy="260" r="16" fill={p.accent} />
          </G>
        );

      case "guard":
        return (
          <G>
            {}
            <Path
              d={`M${cx - 36} ${cy + 10} L${cx - 36} ${cy - 30} C${cx - 36} ${cy - 50} ${cx + 36} ${cy - 50} ${cx + 36} ${cy - 30} L${cx + 36} ${cy + 10} Z`}
              fill={p.accent}
            />
            <Rect
              x={cx - 36}
              y={cy + 10}
              width="72"
              height="20"
              rx="4"
              fill={p.accent}
            />
            {}
            <Rect
              x={cx - 6}
              y={cy - 40}
              width="12"
              height="60"
              fill="#c3d1e6"
            />
            {}
            <Rect
              x={cx - 30}
              y={cy - 10}
              width="22"
              height="8"
              rx="2"
              fill="#111"
            />
            <Rect
              x={cx + 8}
              y={cy - 10}
              width="22"
              height="8"
              rx="2"
              fill="#111"
            />
            {}
            <Line
              x1="200"
              y1="100"
              x2="200"
              y2="320"
              stroke="#5c4b3a"
              strokeWidth="8"
            />
            <Polygon points="200,60 188,110 212,110" fill="#e0e6f0" />
            <Line
              x1="200"
              y1="60"
              x2="200"
              y2="110"
              stroke="#111"
              strokeWidth="1"
              opacity={0.3}
            />
          </G>
        );

      case "hooded":
        return (
          <G>
            {}
            <Circle cx={cx} cy={cy - 10} r="50" fill={p.cloth} />
            <Path
              d={`M${cx - 50} ${cy - 10} C${cx - 60} ${cy + 40} ${cx - 70} ${cy + 90} ${cx - 70} ${cy + 120} L${cx + 70} ${cy + 120} C${cx + 70} ${cy + 90} ${cx + 60} ${cy + 40} ${cx + 50} ${cy - 10} Z`}
              fill={p.cloth}
            />

            {}
            <Path
              d={`M${cx - 10} ${cy + 20} L${cx - 14} ${cy + 50} L${cx + 14} ${cy + 50} L${cx + 10} ${cy + 20} Z`}
              fill={p.skin}
            />

            {}
            <Path
              d={`M${cx - 32} ${cy - 40} C${cx - 36} ${cy + 10} ${cx - 16} ${cy + 40} ${cx} ${cy + 45} C${cx + 16} ${cy + 40} ${cx + 36} ${cy + 10} ${cx + 32} ${cy - 40} Z`}
              fill={p.skin}
            />

            {}
            <Path
              d={`M${cx - 32} ${cy - 40} C${cx - 40} ${cy - 20} ${cx - 45} ${cy + 50} ${cx - 20} ${cy + 100} C${cx - 10} ${cy + 70} ${cx - 20} ${cy + 40} ${cx - 20} ${cy - 40}`}
              fill={p.hair}
            />
            <Path
              d={`M${cx + 32} ${cy - 40} C${cx + 40} ${cy - 20} ${cx + 45} ${cy + 50} ${cx + 20} ${cy + 100} C${cx + 10} ${cy + 70} ${cx + 20} ${cy + 40} ${cx + 20} ${cy - 40}`}
              fill={p.hair}
            />

            {}
            <Path
              d={`M${cx - 22} ${cy - 5} Q${cx - 14} ${cy - 10} ${cx - 8} ${cy - 5}`}
              stroke="#111"
              strokeWidth="2.5"
              fill="none"
            />
            <Circle cx={cx - 14} cy={cy - 4} r="3" fill="#6a3a78" />
            <Path
              d={`M${cx - 22} ${cy - 5} C${cx - 26} ${cy - 8} ${cx - 28} ${cy - 10} ${cx - 30} ${cy - 12}`}
              stroke="#111"
              strokeWidth="2"
              fill="none"
            />
            <Path
              d={`M${cx - 18} ${cy - 7} L${cx - 22} ${cy - 12}`}
              stroke="#111"
              strokeWidth="1.5"
              fill="none"
            />
            <Path
              d={`M${cx - 22} ${cy - 3} Q${cx - 14} ${cy} ${cx - 8} ${cy - 3}`}
              stroke="#33182b"
              strokeWidth="1.5"
              fill="none"
            />

            <Path
              d={`M${cx + 22} ${cy - 5} Q${cx + 14} ${cy - 10} ${cx + 8} ${cy - 5}`}
              stroke="#111"
              strokeWidth="2.5"
              fill="none"
            />
            <Circle cx={cx + 14} cy={cy - 4} r="3" fill="#6a3a78" />
            <Path
              d={`M${cx + 22} ${cy - 5} C${cx + 26} ${cy - 8} ${cx + 28} ${cy - 10} ${cx + 30} ${cy - 12}`}
              stroke="#111"
              strokeWidth="2"
              fill="none"
            />
            <Path
              d={`M${cx + 18} ${cy - 7} L${cx + 22} ${cy - 12}`}
              stroke="#111"
              strokeWidth="1.5"
              fill="none"
            />
            <Path
              d={`M${cx + 22} ${cy - 3} Q${cx + 14} ${cy} ${cx + 8} ${cy - 3}`}
              stroke="#33182b"
              strokeWidth="1.5"
              fill="none"
            />

            {}
            <Path
              d={`M${cx} ${cy + 6} L${cx - 2} ${cy + 16} L${cx} ${cy + 16}`}
              stroke="#a8888b"
              strokeWidth="1.5"
              fill="none"
            />

            {}
            <Path
              d={`M${cx - 9} ${cy + 26} Q${cx} ${cy + 23} ${cx + 9} ${cy + 26} Q${cx} ${cy + 28} ${cx - 9} ${cy + 26}`}
              fill="#5e1927"
            />
            <Path
              d={`M${cx - 9} ${cy + 26} Q${cx} ${cy + 32} ${cx + 9} ${cy + 26} Q${cx} ${cy + 28} ${cx - 9} ${cy + 26}`}
              fill="#8a2339"
            />

            {}
            <Path
              d={`M${cx} ${cy - 26} A5 5 0 1 1 ${cx} ${cy - 16} A7 7 0 1 0 ${cx} ${cy - 26}`}
              fill={p.accent}
            />

            {}
            <Path
              d={`M${cx - 32} ${cy - 40} Q${cx - 15} ${cy - 35} ${cx} ${cy - 45} Q${cx + 15} ${cy - 35} ${cx + 32} ${cy - 40} Q${cx + 36} ${cy + 10} ${cx + 16} ${cy + 40} Q${cx} ${cy + 45} ${cx - 16} ${cy + 40} Q${cx - 36} ${cy + 10} ${cx - 32} ${cy - 40} Z`}
              fill="none"
              stroke="#111"
              strokeWidth="8"
              opacity={0.4}
            />

            {}
            <Circle cx="180" cy="240" r="3" fill={p.accent} />
            <Circle cx="200" cy="220" r="2" fill={p.accent} />
            <Circle cx="160" cy="210" r="1.5" fill={p.accent} />
            <Path
              d={`M175 230 C185 220 195 240 205 230`}
              fill="none"
              stroke={p.accent}
              strokeWidth="1"
              opacity={0.6}
            />
          </G>
        );

      case "spirit":
        return (
          <G>
            {}
            <Circle cx={cx} cy={cy} r="60" fill={p.accent} opacity={0.15} />
            <Circle cx={cx} cy={cy} r="80" fill={p.accent} opacity={0.05} />
            {}
            <Path
              d={`M${cx - 40} 240 Q${cx} 300 ${cx + 60} 260 Q${cx + 20} 320 ${cx - 20} 300`}
              fill={p.cloth}
              opacity={0.8}
            />
          </G>
        );

      case "cook":
        return (
          <G>
            {}
            <Circle cx={cx - 15} cy={cy - 60} r="18" fill="#e8e4db" />
            <Circle cx={cx + 15} cy={cy - 60} r="18" fill="#e8e4db" />
            <Circle cx={cx} cy={cy - 70} r="22" fill="#e8e4db" />
            {}
            <Path
              d={`M${cx - 24} ${cy - 30} L${cx - 24} ${cy - 60} L${cx + 24} ${cy - 60} L${cx + 24} ${cy - 30} Z`}
              fill="#e8e4db"
            />
            <Rect
              x={cx - 28}
              y={cy - 32}
              width="56"
              height="10"
              rx="4"
              fill="#d1ccc3"
            />
            {}
            <Line
              x1="190"
              y1="200"
              x2="190"
              y2="320"
              stroke="#5c4b3a"
              strokeWidth="6"
            />
            <Ellipse cx="190" cy="190" rx="16" ry="10" fill={p.accent} />
          </G>
        );

      case "gambler":
        return (
          <G>
            {}
            <Rect
              x="160"
              y="240"
              width="30"
              height="40"
              rx="2"
              fill="#fff"
              transform="rotate(-15 160 240)"
            />
            <Rect
              x="180"
              y="235"
              width="30"
              height="40"
              rx="2"
              fill="#fff"
              transform="rotate(5 180 235)"
            />
            <Circle
              cx="170"
              cy="255"
              r="4"
              fill="#c42b2b"
              transform="rotate(-15 160 240)"
            />
            <Polygon
              points="195,245 190,252 200,252"
              fill="#111"
              transform="rotate(5 180 235)"
            />
          </G>
        );

      case "caravan":
        return (
          <G>
            {}
            <Ellipse cx={cx} cy={cy - 35} rx="44" ry="24" fill={p.accent} />
            <Ellipse cx={cx} cy={cy - 25} rx="46" ry="16" fill={p.cloth} />
            <Circle cx={cx} cy={cy - 30} r="6" fill="#cca13d" />
          </G>
        );

      case "guild":
        return (
          <G>
            {}
            <Rect x={cx - 40} y={cy - 10} width="80" height="20" fill="#111" />
            <Circle cx={cx - 16} cy={cy} r="6" fill={p.skin} />
            <Circle cx={cx + 16} cy={cy} r="6" fill={p.skin} />
            {}
            <Polygon points="190,200 180,260 200,260" fill={p.accent} />
            <Rect x="185" y="260" width="10" height="30" fill="#2b1a0d" />
            <Rect x="175" y="260" width="30" height="4" fill="#555" />
          </G>
        );

      case "pirate":
        return (
          <G>
            {}
            <Rect
              x={cx - 12}
              y={cy + 20}
              width="24"
              height="30"
              fill={p.skin}
            />
            {}
            <Ellipse cx={cx} cy={cy} rx="38" ry="46" fill={p.skin} />

            {}
            <Path
              d={`M${cx - 40} ${cy - 18} Q${cx} ${cy - 50} ${cx + 40} ${cy - 18} L${cx + 38} ${cy - 38} Q${cx} ${cy - 55} ${cx - 38} ${cy - 38} Z`}
              fill={p.accent}
            />
            <Path
              d={`M${cx + 36} ${cy - 26} Q${cx + 50} ${cy - 18} ${cx + 46} ${cy - 2} Q${cx + 42} ${cy - 12} ${cx + 36} ${cy - 26}`}
              fill={p.accent}
            />
            {}
            <Circle cx={cx} cy={cy - 36} r="5" fill="#e0d0c0" opacity={0.6} />
            <Rect
              x={cx - 4}
              y={cy - 32}
              width="8"
              height="4"
              rx="1"
              fill="#e0d0c0"
              opacity={0.4}
            />

            {}
            <Ellipse cx={cx - 16} cy={cy - 4} rx="10" ry="8" fill="#111" />
            <Line
              x1={cx - 26}
              y1={cy - 12}
              x2={cx + 30}
              y2={cy - 20}
              stroke="#111"
              strokeWidth="2.5"
            />
            {}
            <Circle cx={cx + 16} cy={cy - 4} r="3.5" fill="#111" />
            {}
            <Line
              x1={cx + 8}
              y1={cy - 14}
              x2={cx + 26}
              y2={cy - 10}
              stroke="#111"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {}
            <Path
              d={`M${cx - 8} ${cy - 20} L${cx + 4} ${cy + 12}`}
              stroke="#8a3030"
              strokeWidth="2"
              opacity={0.7}
            />

            {}
            <Path
              d={`M${cx} ${cy + 2} L${cx - 5} ${cy + 12} L${cx + 1} ${cy + 12}`}
              stroke="#111"
              strokeWidth="1.5"
              fill="none"
              opacity={0.5}
            />

            {}
            <Path
              d={`M${cx - 20} ${cy + 20} Q${cx} ${cy + 38} ${cx + 20} ${cy + 20}`}
              fill="#1a1010"
              opacity={0.4}
            />
            {}
            <Path
              d={`M${cx - 12} ${cy + 22} Q${cx} ${cy + 28} ${cx + 12} ${cy + 22}`}
              stroke="#111"
              strokeWidth="2"
              fill="none"
            />

            {}
            <Circle
              cx={cx - 42}
              cy={cy + 8}
              r="5"
              stroke="#e8c040"
              strokeWidth="2.5"
              fill="none"
            />

            {}
            <Line
              x1="60"
              y1="180"
              x2="90"
              y2="320"
              stroke="#c0c8d0"
              strokeWidth="5"
            />
            <Rect x="56" y="170" width="12" height="14" rx="2" fill="#8a6a38" />
            <Path d="M50 184 L74 184" stroke="#c8aa6e" strokeWidth="3" />
          </G>
        );

      case "bandit":
        return (
          <G>
            {}
            <Rect
              x={cx - 12}
              y={cy + 20}
              width="24"
              height="30"
              fill={p.skin}
            />
            {}
            <Ellipse cx={cx} cy={cy} rx="38" ry="46" fill={p.skin} />

            {}
            <Path
              d={`M${cx - 44} ${cy - 10} L${cx - 44} ${cy - 35} C${cx - 44} ${cy - 60} ${cx + 44} ${cy - 60} ${cx + 44} ${cy - 35} L${cx + 44} ${cy - 10} Q${cx} ${cy - 25} ${cx - 44} ${cy - 10} Z`}
              fill={p.cloth}
            />
            {}
            <Path
              d={`M${cx - 38} ${cy - 10} Q${cx} ${cy - 22} ${cx + 38} ${cy - 10}`}
              stroke="#111"
              strokeWidth="3"
              fill="none"
              opacity={0.3}
            />

            {}
            <Path
              d={`M${cx - 24} ${cy - 4} L${cx - 8} ${cy - 4}`}
              stroke="#111"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <Circle cx={cx - 16} cy={cy - 4} r="2" fill="#c8a040" />
            <Path
              d={`M${cx + 8} ${cy - 4} L${cx + 24} ${cy - 4}`}
              stroke="#111"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <Circle cx={cx + 16} cy={cy - 4} r="2" fill="#c8a040" />
            {}
            <Line
              x1={cx - 24}
              y1={cy - 14}
              x2={cx - 8}
              y2={cy - 10}
              stroke={p.hair}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <Line
              x1={cx + 24}
              y1={cy - 14}
              x2={cx + 8}
              y2={cy - 10}
              stroke={p.hair}
              strokeWidth="3"
              strokeLinecap="round"
            />

            {}
            <Path
              d={`M${cx - 32} ${cy + 8} Q${cx} ${cy + 4} ${cx + 32} ${cy + 8} L${cx + 28} ${cy + 35} Q${cx} ${cy + 42} ${cx - 28} ${cy + 35} Z`}
              fill="#3a2010"
            />
            <Line
              x1={cx - 20}
              y1={cy + 20}
              x2={cx + 20}
              y2={cy + 20}
              stroke="#2a1808"
              strokeWidth="1.5"
              opacity={0.4}
            />
            <Line
              x1={cx - 18}
              y1={cy + 28}
              x2={cx + 18}
              y2={cy + 28}
              stroke="#2a1808"
              strokeWidth="1.5"
              opacity={0.3}
            />

            {}
            <Line
              x1="80"
              y1="160"
              x2="180"
              y2="300"
              stroke="#c0c8d0"
              strokeWidth="4"
            />
            <Line
              x1="180"
              y1="160"
              x2="80"
              y2="300"
              stroke="#c0c8d0"
              strokeWidth="4"
            />
            <Rect x="74" y="152" width="12" height="12" rx="1" fill="#5a4030" />
            <Rect
              x="174"
              y="152"
              width="12"
              height="12"
              rx="1"
              fill="#5a4030"
            />
          </G>
        );

      case "elder_woman":
        return (
          <G>
            {}
            <Circle cx={cx} cy={cy - 36} r="22" fill={p.hair} />
            <Circle cx={cx} cy={cy - 50} r="14" fill={p.hair} />
            {}
            <Line
              x1={cx - 8}
              y1={cy - 58}
              x2={cx + 12}
              y2={cy - 44}
              stroke="#8a6a8a"
              strokeWidth="2"
            />
            <Circle cx={cx - 8} cy={cy - 60} r="2.5" fill="#b08ab0" />

            {}
            <Path
              d={`M${cx - 70} 190 Q${cx - 40} 160 ${cx} 170 Q${cx + 40} 160 ${cx + 70} 190 L${cx + 60} 220 Q${cx} 200 ${cx - 60} 220 Z`}
              fill="#4a3040"
            />
            <Path
              d={`M${cx - 10} 170 L${cx - 8} 220`}
              stroke="#5a3a4a"
              strokeWidth="1"
              opacity={0.3}
            />
            <Path
              d={`M${cx + 10} 170 L${cx + 8} 220`}
              stroke="#5a3a4a"
              strokeWidth="1"
              opacity={0.3}
            />

            {}
            <Path
              d={`M${cx - 20} ${cy - 16} Q${cx - 14} ${cy - 18} ${cx - 8} ${cy - 16}`}
              stroke="#a08070"
              strokeWidth="1"
              fill="none"
              opacity={0.5}
            />
            <Path
              d={`M${cx + 8} ${cy - 16} Q${cx + 14} ${cy - 18} ${cx + 20} ${cy - 16}`}
              stroke="#a08070"
              strokeWidth="1"
              fill="none"
              opacity={0.5}
            />
            {}
            <Path
              d={`M${cx - 26} ${cy - 2} L${cx - 30} ${cy - 6}`}
              stroke="#a08070"
              strokeWidth="1"
              fill="none"
              opacity={0.4}
            />
            <Path
              d={`M${cx - 26} ${cy} L${cx - 31} ${cy}`}
              stroke="#a08070"
              strokeWidth="1"
              fill="none"
              opacity={0.4}
            />
            <Path
              d={`M${cx + 26} ${cy - 2} L${cx + 30} ${cy - 6}`}
              stroke="#a08070"
              strokeWidth="1"
              fill="none"
              opacity={0.4}
            />
            <Path
              d={`M${cx + 26} ${cy} L${cx + 31} ${cy}`}
              stroke="#a08070"
              strokeWidth="1"
              fill="none"
              opacity={0.4}
            />

            {}
            <Path
              d={`M${cx - 8} ${cy + 18} Q${cx} ${cy + 22} ${cx + 8} ${cy + 18}`}
              stroke="#9a7060"
              strokeWidth="1.5"
              fill="none"
            />
            {}
            <Path
              d={`M${cx} ${cy + 2} Q${cx - 4} ${cy + 12} ${cx} ${cy + 12}`}
              stroke="#9a7868"
              strokeWidth="1.5"
              fill="none"
            />

            {}
            <Line
              x1="200"
              y1="150"
              x2="210"
              y2="320"
              stroke="#6a5040"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <Path
              d="M194 150 Q200 140 206 150"
              stroke="#6a5040"
              strokeWidth="4"
              fill="none"
            />
          </G>
        );

      case "child":
        return (
          <G>
            {}
            <Rect x={cx - 8} y={cy + 18} width="16" height="22" fill={p.skin} />
            <Ellipse cx={cx} cy={cy} rx="30" ry="32" fill={p.skin} />

            {}
            <Path
              d={`M${cx - 30} ${cy - 10} C${cx - 34} ${cy - 40} ${cx + 34} ${cy - 40} ${cx + 30} ${cy - 10} Q${cx} ${cy - 20} ${cx - 30} ${cy - 10} Z`}
              fill={p.hair}
            />
            {}
            <Path
              d={`M${cx - 10} ${cy - 36} Q${cx - 14} ${cy - 50} ${cx - 8} ${cy - 52}`}
              stroke={p.hair}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d={`M${cx + 6} ${cy - 36} Q${cx + 12} ${cy - 52} ${cx + 16} ${cy - 48}`}
              stroke={p.hair}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d={`M${cx - 2} ${cy - 38} Q${cx} ${cy - 54} ${cx + 4} ${cy - 56}`}
              stroke={p.hair}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />

            {}
            <Circle cx={cx - 12} cy={cy - 2} r="6" fill="#fff" />
            <Circle cx={cx + 12} cy={cy - 2} r="6" fill="#fff" />
            <Circle cx={cx - 11} cy={cy - 2} r="4" fill="#5a3a20" />
            <Circle cx={cx + 13} cy={cy - 2} r="4" fill="#5a3a20" />
            <Circle cx={cx - 10} cy={cy - 3} r="1.5" fill="#fff" />
            <Circle cx={cx + 14} cy={cy - 3} r="1.5" fill="#fff" />

            {}
            <Circle cx={cx} cy={cy + 8} r="2" fill="#c8a070" />

            {}
            <Path
              d={`M${cx - 5} ${cy + 16} Q${cx} ${cy + 14} ${cx + 5} ${cy + 16}`}
              stroke="#b08060"
              strokeWidth="1.5"
              fill="none"
            />

            {}
            <Ellipse
              cx={cx - 16}
              cy={cy + 8}
              rx="6"
              ry="4"
              fill="#e0a0a0"
              opacity={0.4}
            />
            <Ellipse
              cx={cx + 16}
              cy={cy + 8}
              rx="6"
              ry="4"
              fill="#e0a0a0"
              opacity={0.4}
            />

            {}
            <Path
              d={`M${cx - 20} 210 L${cx - 25} 218 L${cx - 18} 222`}
              stroke={p.cloth}
              strokeWidth="1.5"
              fill="none"
              opacity={0.5}
            />

            {}
            <Ellipse
              cx={cx + 15}
              cy="230"
              rx="8"
              ry="5"
              fill="#3a2a14"
              opacity={0.3}
            />
          </G>
        );

      case "old_keeper":
        return (
          <G>
            {}
            <Ellipse cx={cx} cy={cy - 20} rx="38" ry="18" fill={p.skin} />
            <Path
              d={`M${cx - 36} ${cy - 14} Q${cx - 44} ${cy + 10} ${cx - 38} ${cy + 30}`}
              stroke={p.hair}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d={`M${cx + 36} ${cy - 14} Q${cx + 44} ${cy + 10} ${cx + 38} ${cy + 30}`}
              stroke={p.hair}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />

            {}
            <Path
              d={`M${cx - 24} ${cy - 14} Q${cx - 16} ${cy - 20} ${cx - 6} ${cy - 14}`}
              stroke={p.hair}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d={`M${cx + 6} ${cy - 14} Q${cx + 16} ${cy - 20} ${cx + 24} ${cy - 14}`}
              stroke={p.hair}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />

            {}
            <Path
              d={`M${cx - 14} ${cy + 16} Q${cx} ${cy + 24} ${cx + 14} ${cy + 16}`}
              stroke="#8a6a4a"
              strokeWidth="2"
              fill="none"
            />
            {}
            <Path
              d={`M${cx} ${cy + 2} Q${cx - 6} ${cy + 12} ${cx + 1} ${cy + 12} Q${cx + 6} ${cy + 12} ${cx} ${cy + 2}`}
              stroke="#111"
              strokeWidth="1.5"
              fill="none"
              opacity={0.4}
            />

            {}
            <Path
              d={`M${cx - 28} ${cy + 20} Q${cx - 30} ${cy + 50} ${cx} ${cy + 60} Q${cx + 30} ${cy + 50} ${cx + 28} ${cy + 20}`}
              fill={p.hair}
            />
            {}
            <Line
              x1={cx - 10}
              y1={cy + 30}
              x2={cx - 12}
              y2={cy + 50}
              stroke="#7a7a7a"
              strokeWidth="1"
              opacity={0.3}
            />
            <Line
              x1={cx + 10}
              y1={cy + 30}
              x2={cx + 12}
              y2={cy + 50}
              stroke="#7a7a7a"
              strokeWidth="1"
              opacity={0.3}
            />
            <Line
              x1={cx}
              y1={cy + 28}
              x2={cx}
              y2={cy + 55}
              stroke="#7a7a7a"
              strokeWidth="1"
              opacity={0.3}
            />

            {}
            <Path
              d={`M${cx - 30} 200 L${cx - 35} 320 L${cx + 35} 320 L${cx + 30} 200 Z`}
              fill="#6a5838"
              opacity={0.6}
            />
            <Line
              x1={cx - 30}
              y1="200"
              x2={cx + 30}
              y2="200"
              stroke="#8a7858"
              strokeWidth="2"
            />

            {}
            <Rect
              x="175"
              y="230"
              width="24"
              height="30"
              rx="4"
              fill="#6a4a2a"
            />
            <Rect x="175" y="226" width="24" height="8" rx="3" fill="#8a6a3a" />
            <Path
              d="M199 238 Q212 242 199 254"
              stroke="#6a4a2a"
              strokeWidth="3"
              fill="none"
            />
            {}
            <Ellipse cx="187" cy="230" rx="10" ry="4" fill="#e8dcc0" />
          </G>
        );

      case "inventor":
        return (
          <G>
            {}
            <Path
              d={`M${cx - 30} ${cy - 24} Q${cx - 36} ${cy - 70} ${cx - 20} ${cy - 60} Q${cx - 14} ${cy - 80} ${cx - 6} ${cy - 58} Q${cx} ${cy - 85} ${cx + 6} ${cy - 58} Q${cx + 14} ${cy - 80} ${cx + 20} ${cy - 60} Q${cx + 36} ${cy - 70} ${cx + 30} ${cy - 24} Z`}
              fill={p.hair}
            />
            {}
            <Path
              d={`M${cx - 18} ${cy - 58} L${cx - 20} ${cy - 68}`}
              stroke="#7a5a2a"
              strokeWidth="2"
              opacity={0.4}
            />
            <Path
              d={`M${cx + 8} ${cy - 60} L${cx + 6} ${cy - 74}`}
              stroke="#7a5a2a"
              strokeWidth="2"
              opacity={0.4}
            />

            {}
            <Ellipse
              cx={cx - 14}
              cy={cy - 22}
              rx="12"
              ry="10"
              fill="#2a2a1a"
              stroke="#8a8040"
              strokeWidth="2"
            />
            <Ellipse
              cx={cx + 14}
              cy={cy - 22}
              rx="12"
              ry="10"
              fill="#2a2a1a"
              stroke="#8a8040"
              strokeWidth="2"
            />
            <Line
              x1={cx - 2}
              y1={cy - 22}
              x2={cx + 2}
              y2={cy - 22}
              stroke="#8a8040"
              strokeWidth="3"
            />
            {}
            <Circle
              cx={cx - 10}
              cy={cy - 24}
              r="3"
              fill="#6a8090"
              opacity={0.3}
            />
            <Circle
              cx={cx + 18}
              cy={cy - 24}
              r="3"
              fill="#6a8090"
              opacity={0.3}
            />
            {}
            <Path
              d={`M${cx - 26} ${cy - 22} Q${cx - 34} ${cy - 18} ${cx - 40} ${cy - 10}`}
              stroke="#5a5030"
              strokeWidth="2"
              fill="none"
            />
            <Path
              d={`M${cx + 26} ${cy - 22} Q${cx + 34} ${cy - 18} ${cx + 40} ${cy - 10}`}
              stroke="#5a5030"
              strokeWidth="2"
              fill="none"
            />

            {}
            <Path
              d={`M${cx - 14} ${cy + 16} Q${cx} ${cy + 26} ${cx + 14} ${cy + 16}`}
              stroke="#111"
              strokeWidth="2"
              fill="none"
            />
            {}
            <Rect
              x={cx - 4}
              y={cy + 18}
              width="8"
              height="5"
              rx="1"
              fill="#e8e0d0"
            />

            {}
            <Path
              d={`M${cx} ${cy + 2} L${cx - 4} ${cy + 10} L${cx} ${cy + 10}`}
              stroke="#111"
              strokeWidth="1.5"
              fill="none"
              opacity={0.5}
            />

            {}
            <Ellipse
              cx={cx + 20}
              cy={cy + 6}
              rx="6"
              ry="4"
              fill="#2a2010"
              opacity={0.3}
            />

            {}
            <Circle
              cx="190"
              cy="250"
              r="18"
              fill="none"
              stroke={p.accent}
              strokeWidth="4"
            />
            <Circle cx="190" cy="250" r="8" fill={p.accent} opacity={0.4} />
            {}
            <Rect x="186" y="228" width="8" height="8" fill={p.accent} />
            <Rect x="186" y="264" width="8" height="8" fill={p.accent} />
            <Rect x="168" y="246" width="8" height="8" fill={p.accent} />
            <Rect x="204" y="246" width="8" height="8" fill={p.accent} />

            {}
            <Circle
              cx="74"
              cy="230"
              r="10"
              fill="none"
              stroke="#8a7040"
              strokeWidth="3"
            />
            <Circle cx="74" cy="230" r="4" fill="#8a7040" opacity={0.3} />
          </G>
        );

      case "sailor":
        return (
          <G>
            {}
            <Rect
              x={cx - 14}
              y={cy + 20}
              width="28"
              height="30"
              fill={p.skin}
            />
            {}
            <Ellipse cx={cx} cy={cy} rx="40" ry="46" fill={p.skin} />
            {}
            <Ellipse
              cx={cx - 20}
              cy={cy + 6}
              rx="10"
              ry="6"
              fill="#c06040"
              opacity={0.4}
            />
            <Ellipse
              cx={cx + 20}
              cy={cy + 6}
              rx="10"
              ry="6"
              fill="#c06040"
              opacity={0.4}
            />
            {}
            <Circle cx={cx} cy={cy + 8} r="6" fill="#c07050" />

            {}
            <Path
              d={`M${cx - 42} ${cy - 22} L${cx + 42} ${cy - 22} L${cx + 36} ${cy - 38} Q${cx} ${cy - 46} ${cx - 36} ${cy - 38} Z`}
              fill="#2a2a5a"
            />
            <Rect
              x={cx - 42}
              y={cy - 24}
              width="84"
              height="6"
              rx="2"
              fill="#1a1a3a"
            />
            {}
            <Line
              x1={cx}
              y1={cy - 40}
              x2={cx}
              y2={cy - 30}
              stroke={p.accent}
              strokeWidth="2"
            />
            <Path
              d={`M${cx - 5} ${cy - 30} Q${cx} ${cy - 26} ${cx + 5} ${cy - 30}`}
              stroke={p.accent}
              strokeWidth="2"
              fill="none"
            />

            {}
            <Path
              d={`M${cx - 22} ${cy - 6} Q${cx - 16} ${cy - 2} ${cx - 8} ${cy - 6}`}
              stroke="#111"
              strokeWidth="2.5"
              fill="none"
            />
            <Circle cx={cx - 16} cy={cy - 3} r="2.5" fill="#111" />
            <Path
              d={`M${cx + 8} ${cy - 6} Q${cx + 16} ${cy - 2} ${cx + 22} ${cy - 6}`}
              stroke="#111"
              strokeWidth="2.5"
              fill="none"
            />
            <Circle cx={cx + 16} cy={cy - 3} r="2.5" fill="#111" />

            {}
            <Path
              d={`M${cx - 24} ${cy + 18} Q${cx} ${cy + 35} ${cx + 24} ${cy + 18}`}
              fill="#3a2a18"
              opacity={0.5}
            />

            {}
            <Path
              d={`M${cx - 12} ${cy + 20} Q${cx - 4} ${cy + 26} ${cx + 6} ${cy + 18} Q${cx + 10} ${cy + 24} ${cx + 14} ${cy + 20}`}
              stroke="#111"
              strokeWidth="1.5"
              fill="none"
            />

            {}
            <Line
              x1={cx - 40}
              y1="200"
              x2={cx + 40}
              y2="200"
              stroke="#4a4a6a"
              strokeWidth="3"
              opacity={0.3}
            />
            <Line
              x1={cx - 44}
              y1="210"
              x2={cx + 44}
              y2="210"
              stroke="#4a4a6a"
              strokeWidth="3"
              opacity={0.3}
            />
            <Line
              x1={cx - 48}
              y1="220"
              x2={cx + 48}
              y2="220"
              stroke="#4a4a6a"
              strokeWidth="3"
              opacity={0.3}
            />

            {}
            <Rect
              x="185"
              y="240"
              width="12"
              height="30"
              rx="3"
              fill="#3a6a3a"
            />
            <Rect x="187" y="232" width="8" height="10" rx="2" fill="#3a6a3a" />
            <Circle cx="191" cy="230" r="3" fill="#4a7a4a" />
          </G>
        );

      case "rival":
        return (
          <G>
            {}
            <Path
              d={`M${cx - 36} ${cy - 14} C${cx - 40} ${cy - 55} ${cx + 40} ${cy - 55} ${cx + 36} ${cy - 14} Q${cx + 40} ${cy - 40} ${cx + 44} ${cy + 10}`}
              fill={p.hair}
            />
            <Path
              d={`M${cx - 36} ${cy - 14} Q${cx - 40} ${cy - 40} ${cx - 44} ${cy + 10}`}
              fill={p.hair}
            />
            {}
            <Path
              d={`M${cx - 20} ${cy - 44} Q${cx} ${cy - 50} ${cx + 20} ${cy - 44}`}
              stroke="#4a3a20"
              strokeWidth="1.5"
              fill="none"
              opacity={0.3}
            />

            {}
            <Path
              d={`M${cx - 24} ${cy - 16} Q${cx - 16} ${cy - 22} ${cx - 6} ${cy - 14}`}
              stroke={p.hair}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d={`M${cx + 6} ${cy - 16} Q${cx + 16} ${cy - 18} ${cx + 24} ${cy - 14}`}
              stroke={p.hair}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />

            {}
            <Path
              d={`M${cx - 22} ${cy - 4} Q${cx - 16} ${cy - 8} ${cx - 8} ${cy - 4}`}
              stroke="#111"
              strokeWidth="2"
              fill="none"
            />
            <Circle cx={cx - 16} cy={cy - 3} r="2.5" fill="#111" />
            <Path
              d={`M${cx + 8} ${cy - 4} Q${cx + 16} ${cy - 8} ${cx + 22} ${cy - 4}`}
              stroke="#111"
              strokeWidth="2"
              fill="none"
            />
            <Circle cx={cx + 16} cy={cy - 3} r="2.5" fill="#111" />

            {}
            <Path
              d={`M${cx} ${cy + 2} L${cx - 4} ${cy + 10} L${cx} ${cy + 10}`}
              stroke="#111"
              strokeWidth="1.5"
              fill="none"
              opacity={0.5}
            />

            {}
            <Path
              d={`M${cx} ${cy + 14} Q${cx - 10} ${cy + 18} ${cx - 22} ${cy + 12}`}
              stroke={p.hair}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d={`M${cx} ${cy + 14} Q${cx + 10} ${cy + 18} ${cx + 22} ${cy + 12}`}
              stroke={p.hair}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {}
            <Circle cx={cx - 24} cy={cy + 11} r="2" fill={p.hair} />
            <Circle cx={cx + 24} cy={cy + 11} r="2" fill={p.hair} />

            {}
            <Path
              d={`M${cx - 8} ${cy + 22} Q${cx + 4} ${cy + 22} ${cx + 12} ${cy + 18}`}
              stroke="#111"
              strokeWidth="1.5"
              fill="none"
            />

            {}
            <Path
              d={`M${cx - 30} 180 L${cx} 200 L${cx + 30} 180`}
              stroke="#5aaa5a"
              strokeWidth="3"
              fill="none"
            />
            <Circle cx={cx} cy="205" r="3" fill={p.accent} />

            {}
            <Ellipse cx="190" cy="240" rx="12" ry="14" fill="#e8c040" />
            <Ellipse cx="190" cy="240" rx="7" ry="9" fill="#c8a030" />
            <Circle cx="190" cy="240" r="3" fill="#e8c040" />
          </G>
        );

      case "pilgrim":
        return (
          <G>
            {}
            <Rect
              x={cx - 10}
              y={cy + 20}
              width="20"
              height="30"
              fill={p.skin}
            />
            {}
            <Ellipse cx={cx} cy={cy} rx="34" ry="44" fill={p.skin} />

            {}
            <Path
              d={`M${cx - 42} ${cy + 10} L${cx - 42} ${cy - 30} C${cx - 42} ${cy - 58} ${cx + 42} ${cy - 58} ${cx + 42} ${cy - 30} L${cx + 42} ${cy + 10} Q${cx} ${cy - 5} ${cx - 42} ${cy + 10} Z`}
              fill={p.cloth}
            />
            {}
            <Path
              d={`M${cx - 42} ${cy + 10} Q${cx - 50} ${cy + 40} ${cx - 55} ${cy + 80}`}
              stroke={p.cloth}
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d={`M${cx + 42} ${cy + 10} Q${cx + 50} ${cy + 40} ${cx + 55} ${cy + 80}`}
              stroke={p.cloth}
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
            />

            {}
            <Circle cx={cx - 14} cy={cy - 2} r="3" fill="#111" />
            <Circle cx={cx + 14} cy={cy - 2} r="3" fill="#111" />
            {}
            <Circle cx={cx - 13} cy={cy - 3} r="1" fill="#fff" opacity={0.5} />
            <Circle cx={cx + 15} cy={cy - 3} r="1" fill="#fff" opacity={0.5} />

            {}
            <Path
              d={`M${cx} ${cy + 2} L${cx - 3} ${cy + 10} L${cx + 1} ${cy + 10}`}
              stroke="#6a5030"
              strokeWidth="1.5"
              fill="none"
              opacity={0.6}
            />

            {}
            <Path
              d={`M${cx - 8} ${cy + 18} Q${cx} ${cy + 22} ${cx + 8} ${cy + 18}`}
              stroke="#6a5030"
              strokeWidth="1.5"
              fill="none"
            />

            {}
            <Path
              d={`M${cx - 18} ${cy + 22} Q${cx} ${cy + 40} ${cx + 18} ${cy + 22}`}
              fill="#222"
              opacity={0.5}
            />

            {}
            <Line
              x1="70"
              y1="120"
              x2="80"
              y2="320"
              stroke="#8a7050"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {}
            <Line
              x1="62"
              y1="118"
              x2="78"
              y2="118"
              stroke="#8a7050"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {}
            <Circle cx="194" cy="220" r="3" fill="#c8b890" />
            <Circle cx="198" cy="230" r="3" fill="#c8b890" />
            <Circle cx="200" cy="240" r="3" fill="#c8b890" />
            <Circle cx="198" cy="250" r="3" fill="#c8b890" />
            <Circle cx="194" cy="258" r="4" fill={p.accent} />
          </G>
        );

      case "ghost":
        return (
          <G>
            {}
            <Circle
              cx={cx}
              cy={cy + 20}
              r="80"
              fill={p.accent}
              opacity={0.05}
            />
            <Circle
              cx={cx}
              cy={cy + 10}
              r="50"
              fill={p.accent}
              opacity={0.08}
            />

            {}
            <Rect
              x={cx - 10}
              y={cy + 20}
              width="20"
              height="26"
              fill={p.skin}
              opacity={0.5}
            />
            {}
            <Ellipse
              cx={cx}
              cy={cy}
              rx="34"
              ry="44"
              fill={p.skin}
              opacity={0.5}
            />

            {}
            <Path
              d={`M${cx - 34} ${cy - 16} C${cx - 38} ${cy - 50} ${cx} ${cy - 54} ${cx} ${cy - 44} C${cx} ${cy - 54} ${cx + 38} ${cy - 50} ${cx + 34} ${cy - 16} Z`}
              fill={p.hair}
              opacity={0.5}
            />

            {}
            <Circle
              cx={cx - 14}
              cy={cy - 4}
              r="5"
              fill={p.accent}
              opacity={0.7}
            />
            <Circle
              cx={cx + 14}
              cy={cy - 4}
              r="5"
              fill={p.accent}
              opacity={0.7}
            />
            <Circle
              cx={cx - 14}
              cy={cy - 4}
              r="2.5"
              fill="#fff"
              opacity={0.6}
            />
            <Circle
              cx={cx + 14}
              cy={cy - 4}
              r="2.5"
              fill="#fff"
              opacity={0.6}
            />
            {}
            <Circle
              cx={cx - 14}
              cy={cy - 4}
              r="8"
              fill={p.accent}
              opacity={0.08}
            />
            <Circle
              cx={cx + 14}
              cy={cy - 4}
              r="8"
              fill={p.accent}
              opacity={0.08}
            />

            {}
            <Path
              d={`M${cx} ${cy + 4} L${cx - 2} ${cy + 10}`}
              stroke={p.skin}
              strokeWidth="1"
              fill="none"
              opacity={0.3}
            />

            {}
            <Ellipse
              cx={cx}
              cy={cy + 22}
              rx="6"
              ry="4"
              fill="#3a4a5a"
              opacity={0.5}
            />

            {}
            <Path
              d={`M${cx - 20} 172 Q${cx} 162 ${cx + 20} 172`}
              stroke={p.accent}
              strokeWidth="1.5"
              fill="none"
              opacity={0.3}
            />
            <Path
              d={`M${cx - 24} 178 Q${cx} 166 ${cx + 24} 178`}
              stroke={p.accent}
              strokeWidth="1"
              fill="none"
              opacity={0.2}
            />

            {}
            <Path
              d={`M${cx - 30} 280 Q${cx - 20} 310 ${cx - 10} 320`}
              stroke={p.cloth}
              strokeWidth="8"
              fill="none"
              opacity={0.15}
            />
            <Path
              d={`M${cx + 30} 280 Q${cx + 20} 310 ${cx + 10} 320`}
              stroke={p.cloth}
              strokeWidth="8"
              fill="none"
              opacity={0.15}
            />

            {}
            <Circle
              cx={cx - 30}
              cy={cy - 30}
              r="1.5"
              fill={p.accent}
              opacity={0.4}
            />
            <Circle
              cx={cx + 25}
              cy={cy - 20}
              r="1"
              fill={p.accent}
              opacity={0.3}
            />
            <Circle
              cx={cx - 20}
              cy={cy + 50}
              r="1.5"
              fill={p.accent}
              opacity={0.3}
            />
            <Circle
              cx={cx + 35}
              cy={cy + 30}
              r="1"
              fill={p.accent}
              opacity={0.2}
            />
          </G>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: p.bg }]}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 264 320"
        preserveAspectRatio="xMidYMid slice"
      >
        <Defs>
          <ClipPath id="cardClip">
            <Rect x="0" y="0" width="264" height="320" />
          </ClipPath>
        </Defs>
        {renderBackground()}
        {renderBody()}
        {renderHead()}
        {renderFace()}
        {renderFeatures()}
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
});
