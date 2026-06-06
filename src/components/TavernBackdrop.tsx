import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient as SvgLinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

export const TavernBackdrop = React.memo(function TavernBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {}
      <LinearGradient
        colors={["#0e1114", "#151210", "#1a1510", "#1a1510"]}
        locations={[0, 0.35, 0.65, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 390 844"
        preserveAspectRatio="none"
      >
        <Defs>
          <SvgLinearGradient id="warmGlow" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#c8aa6e" stopOpacity="0.06" />
            <Stop offset="1" stopColor="#0e1114" stopOpacity="0" />
          </SvgLinearGradient>
          <SvgLinearGradient id="tableTop" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#2a1e14" />
            <Stop offset="0.5" stopColor="#4a3020" />
            <Stop offset="1" stopColor="#1e1410" />
          </SvgLinearGradient>
          <SvgLinearGradient id="fireGlow" x1="0.5" y1="1" x2="0.5" y2="0">
            <Stop offset="0" stopColor="#e8a33d" stopOpacity="0" />
            <Stop offset="1" stopColor="#e8a33d" stopOpacity="0.04" />
          </SvgLinearGradient>
        </Defs>

        {}
        <G opacity="0.06">
          {Array.from({ length: 10 }).map((_, i) => (
            <Rect
              key={`plank${i}`}
              x={i * 42 - 8}
              y="0"
              width="28"
              height="844"
              fill={i % 2 ? "#6a4828" : "#3a2818"}
              opacity={i % 2 ? 0.4 : 0.3}
            />
          ))}
        </G>

        {}
        <G opacity="0.04">
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 6 }).map((_, col) => (
              <Rect
                key={`stone${row}${col}`}
                x={col * 70 + (row % 2 ? 35 : 0) - 10}
                y={row * 50 + 30}
                width="62"
                height="42"
                rx="3"
                fill="#8a7a68"
                stroke="#5a4a38"
                strokeWidth="1"
              />
            )),
          )}
        </G>

        {}
        <Circle cx="60" cy="150" r="160" fill="url(#warmGlow)" />

        {}
        <Rect
          x="42"
          y="80"
          width="90"
          height="120"
          rx="8"
          fill="#0a0e12"
          stroke="#6a5838"
          strokeWidth="4"
          opacity={0.5}
        />
        <Path d="M87 80v120" stroke="#6a5838" strokeWidth="3" opacity={0.4} />
        <Path d="M42 140h90" stroke="#6a5838" strokeWidth="3" opacity={0.4} />
        <Circle cx="87" cy="120" r="28" fill="#a0c0d0" opacity={0.04} />

        {}
        <G opacity={0.4}>
          <Path
            d="M224 100h140"
            stroke="#6a4828"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <Path
            d="M224 155h140"
            stroke="#6a4828"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {}
          <Rect
            x="238"
            y="68"
            width="11"
            height="32"
            rx="4"
            fill="#5a8a58"
            opacity={0.5}
          />
          <Rect
            x="256"
            y="58"
            width="12"
            height="42"
            rx="4"
            fill="#8a3848"
            opacity={0.5}
          />
          <Rect
            x="278"
            y="74"
            width="11"
            height="26"
            rx="4"
            fill="#c8aa6e"
            opacity={0.4}
          />
          <Rect
            x="300"
            y="65"
            width="12"
            height="35"
            rx="4"
            fill="#5888a0"
            opacity={0.5}
          />
          <Rect
            x="320"
            y="72"
            width="11"
            height="28"
            rx="4"
            fill="#8a5830"
            opacity={0.5}
          />
          {}
          <Rect
            x="240"
            y="118"
            width="14"
            height="37"
            rx="5"
            fill="#6a4828"
            opacity={0.4}
          />
          <Rect
            x="268"
            y="125"
            width="12"
            height="30"
            rx="4"
            fill="#4a6838"
            opacity={0.4}
          />
          <Rect
            x="294"
            y="120"
            width="14"
            height="35"
            rx="5"
            fill="#8a6040"
            opacity={0.4}
          />
        </G>

        {}
        {}
        <Path
          d="M-20 650 Q 195 620, 410 660 L 410 850 L -20 850 Z"
          fill="url(#tableTop)"
        />
        <Path
          d="M-20 650 Q 195 620, 410 660"
          stroke="#8a6838"
          strokeOpacity={0.4}
          strokeWidth="3"
        />
        <Path
          d="M-20 655 Q 195 625, 410 665"
          stroke="#1e1410"
          strokeOpacity={0.6}
          strokeWidth="2"
        />

        {}
        <Path
          d="M 20 690 Q 195 670, 370 690 L 380 850 L 10 850 Z"
          fill="#26201a"
          opacity={0.8}
        />
        <Path
          d="M 20 690 Q 195 670, 370 690"
          stroke="#c8aa6e"
          strokeWidth="1"
          opacity={0.2}
        />

        {}
        <G opacity={0.6}>
          <Ellipse
            cx="60"
            cy="710"
            rx="6"
            ry="3"
            fill="#c8aa6e"
            transform="rotate(-15 60 710)"
          />
          <Ellipse
            cx="72"
            cy="718"
            rx="5"
            ry="2.5"
            fill="#e8a33d"
            transform="rotate(25 72 718)"
          />
          <Ellipse
            cx="330"
            cy="695"
            rx="5"
            ry="2.5"
            fill="#c8aa6e"
            transform="rotate(45 330 695)"
          />
        </G>

        {}
        <G opacity={0.4}>
          <Ellipse cx="340" cy="670" rx="18" ry="8" fill="#14100c" />
          <Ellipse
            cx="340"
            cy="670"
            rx="14"
            ry="6"
            fill="#4a3820"
            stroke="#8a6838"
            strokeWidth="1.5"
          />
          <Rect
            x="354"
            y="660"
            width="10"
            height="18"
            rx="4"
            fill="#5a3820"
            stroke="#8a6838"
            strokeWidth="1.5"
          />
        </G>

        {}
        <G opacity={0.15}>
          <Line
            x1="195"
            y1="0"
            x2="195"
            y2="60"
            stroke="#8a7858"
            strokeWidth="2"
          />
          <Rect
            x="183"
            y="55"
            width="24"
            height="30"
            rx="6"
            fill="#c8aa6e"
            opacity={0.4}
          />
          <Circle cx="195" cy="70" r="8" fill="#e8a33d" opacity={0.5} />
        </G>

        {}
        <Ellipse cx="195" cy="850" rx="250" ry="120" fill="url(#fireGlow)" />

        {}
        <G opacity={0.18}>
          <Circle cx="80" cy="250" r="1" fill="#c8aa6e" />
          <Circle cx="300" cy="340" r="1.2" fill="#c8aa6e" />
          <Circle cx="160" cy="180" r="0.8" fill="#c8aa6e" />
          <Circle cx="50" cy="480" r="1" fill="#c8aa6e" />
          <Circle cx="330" cy="520" r="1.2" fill="#c8aa6e" />
          <Circle cx="200" cy="400" r="0.8" fill="#c8aa6e" />
          <Circle cx="120" cy="600" r="1" fill="#c8aa6e" />
          <Circle cx="280" cy="200" r="0.8" fill="#c8aa6e" />
        </G>

        {}
        <G opacity="0.08" stroke="#c8aa6e" strokeWidth="1.5">
          <Path d="M16 32v-16h16" fill="none" />
          <Path d="M374 32v-16h-16" fill="none" />
          <Path d="M16 812v16h16" fill="none" />
          <Path d="M374 812v16h-16" fill="none" />
        </G>
      </Svg>
    </View>
  );
});
