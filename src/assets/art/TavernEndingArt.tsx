import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, {
  Circle,
  Rect,
  Path,
  G,
  Ellipse,
  Line,
  Polygon,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import type { TavernState } from "../../types/game";

type TavernEndingArtProps = {
  variant: TavernState;
};

const W = 320;
const H = 240;

export const TavernEndingArt = React.memo(function TavernEndingArt({
  variant,
}: TavernEndingArtProps) {
  return (
    <View style={styles.container}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          <SvgGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={skyColors[variant].top} />
            <Stop offset="1" stopColor={skyColors[variant].bottom} />
          </SvgGradient>
          <SvgGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={groundColors[variant].top} />
            <Stop offset="1" stopColor={groundColors[variant].bottom} />
          </SvgGradient>
        </Defs>

        {}
        <Rect x="0" y="0" width={W} height={H} fill="url(#sky)" />

        {}
        {renderParticles(variant)}

        {}
        {renderCelestial(variant)}

        {}
        <Path
          d={`M0 ${H * 0.6} Q80 ${H * 0.35} 160 ${H * 0.55} Q240 ${H * 0.38} ${W} ${H * 0.58} L${W} ${H} L0 ${H} Z`}
          fill={groundColors[variant].mountain}
          opacity={0.5}
        />

        {}
        <Rect
          x="0"
          y={H * 0.7}
          width={W}
          height={H * 0.3}
          fill="url(#ground)"
        />

        {}
        {renderOakTree(variant)}

        {}
        {renderTavern(variant)}

        {}
        {renderStateDetails(variant)}
      </Svg>
    </View>
  );
});

const skyColors: Record<TavernState, { top: string; bottom: string }> = {
  wealthy: { top: "#1a1a3a", bottom: "#3a2a50" },
  beloved: { top: "#1a1830", bottom: "#4a2a30" },
  fortified: { top: "#0e1428", bottom: "#1e2a3a" },
  mystical: { top: "#0e0a28", bottom: "#2a1a4a" },
  legendary: { top: "#1a1a2a", bottom: "#3a3050" },
  ruined: { top: "#1a1210", bottom: "#2a1a14" },
  abandoned: { top: "#1a1e28", bottom: "#2a3040" },
  cursed: { top: "#0a0610", bottom: "#1a0a1a" },
};

const groundColors: Record<
  TavernState,
  { top: string; bottom: string; mountain: string }
> = {
  wealthy: { top: "#2a3a1a", bottom: "#1a2a10", mountain: "#1a2020" },
  beloved: { top: "#3a2a1a", bottom: "#2a1a10", mountain: "#2a1a18" },
  fortified: { top: "#1a2a20", bottom: "#0e1a14", mountain: "#141a1a" },
  mystical: { top: "#1a2a2a", bottom: "#0e1a20", mountain: "#1a1a2a" },
  legendary: { top: "#2a3a20", bottom: "#1a2a14", mountain: "#1a2a1a" },
  ruined: { top: "#2a1a10", bottom: "#1a1008", mountain: "#1a1410" },
  abandoned: { top: "#2a2a30", bottom: "#1a1a20", mountain: "#1a1e28" },
  cursed: { top: "#1a0a10", bottom: "#0a0408", mountain: "#10060a" },
};

function renderParticles(variant: TavernState) {
  const particles: React.ReactNode[] = [];
  const color = {
    wealthy: "#f0d080",
    beloved: "#f0a060",
    fortified: "#a0c0e0",
    mystical: "#c090f0",
    legendary: "#f0e0a0",
    ruined: "#f08040",
    abandoned: "#d0e0f0",
    cursed: "#a04060",
  }[variant];

  for (let i = 0; i < 12; i++) {
    const x = 20 + ((i * 26) % (W - 40));
    const y = 10 + ((i * 17 + 7) % 80);
    const r = i % 3 === 0 ? 1.5 : 1;
    particles.push(
      <Circle
        key={`p${i}`}
        cx={x}
        cy={y}
        r={r}
        fill={color}
        opacity={0.4 + (i % 3) * 0.2}
      />,
    );
  }
  return <G>{particles}</G>;
}

function renderCelestial(variant: TavernState) {
  switch (variant) {
    case "wealthy":
    case "legendary":
      return (
        <G>
          <Circle
            cx={W * 0.8}
            cy={H * 0.2}
            r="18"
            fill="#f0e8d0"
            opacity={0.9}
          />
          <Circle
            cx={W * 0.8}
            cy={H * 0.2}
            r="22"
            fill="#f0e8d0"
            opacity={0.15}
          />
        </G>
      );
    case "beloved":
      return (
        <Circle
          cx={W * 0.8}
          cy={H * 0.25}
          r="20"
          fill="#f0a050"
          opacity={0.6}
        />
      );
    case "mystical":
      return (
        <G>
          <Path
            d={`M${W * 0.78} ${H * 0.12} A12 12 0 1 1 ${W * 0.78} ${H * 0.28} A16 16 0 1 0 ${W * 0.78} ${H * 0.12}`}
            fill="#c090f0"
            opacity={0.8}
          />
          <Circle
            cx={W * 0.78}
            cy={H * 0.2}
            r="24"
            fill="#c090f0"
            opacity={0.08}
          />
        </G>
      );
    case "cursed":
      return (
        <G>
          <Circle
            cx={W * 0.8}
            cy={H * 0.18}
            r="16"
            fill="#8a2030"
            opacity={0.8}
          />
          <Circle
            cx={W * 0.8}
            cy={H * 0.18}
            r="24"
            fill="#8a2030"
            opacity={0.1}
          />
        </G>
      );
    case "abandoned":
      return (
        <Circle
          cx={W * 0.75}
          cy={H * 0.2}
          r="14"
          fill="#8a9aaa"
          opacity={0.3}
        />
      );
    default:
      return (
        <Circle cx={W * 0.8} cy={H * 0.2} r="14" fill="#d0d8e0" opacity={0.5} />
      );
  }
}

function renderOakTree(variant: TavernState) {
  const trunkColor =
    variant === "cursed"
      ? "#1a0a0e"
      : variant === "abandoned"
        ? "#3a3a40"
        : "#3a2a1a";
  const foliageColor = {
    wealthy: "#2a5a2a",
    beloved: "#3a5a2a",
    fortified: "#1a4a2a",
    mystical: "#2a3a5a",
    legendary: "#3a6a3a",
    ruined: "#4a3a1a",
    abandoned: "#3a3a3a",
    cursed: "#2a0a1a",
  }[variant];

  const tx = W * 0.22;
  const ty = H * 0.38;

  return (
    <G>
      {}
      <Path
        d={`M${tx - 6} ${H * 0.7} L${tx - 10} ${ty + 40} Q${tx} ${ty + 30} ${tx + 10} ${ty + 40} L${tx + 6} ${H * 0.7} Z`}
        fill={trunkColor}
      />
      {}
      <Path
        d={`M${tx - 8} ${ty + 42} Q${tx - 30} ${ty + 20} ${tx - 35} ${ty + 15}`}
        stroke={trunkColor}
        strokeWidth="3"
        fill="none"
      />
      <Path
        d={`M${tx + 8} ${ty + 42} Q${tx + 25} ${ty + 25} ${tx + 32} ${ty + 20}`}
        stroke={trunkColor}
        strokeWidth="3"
        fill="none"
      />
      {}
      <Circle cx={tx} cy={ty + 10} r="28" fill={foliageColor} />
      <Circle cx={tx - 18} cy={ty + 18} r="20" fill={foliageColor} />
      <Circle cx={tx + 18} cy={ty + 16} r="22" fill={foliageColor} />
      <Circle cx={tx} cy={ty - 8} r="18" fill={foliageColor} />

      {}
      {variant === "mystical" && (
        <Circle cx={tx} cy={ty + 10} r="34" fill="#b070e0" opacity={0.08} />
      )}
      {variant === "cursed" && (
        <>
          {}
          <Path
            d={`M${tx - 6} ${H * 0.7} Q${tx - 20} ${H * 0.75} ${tx - 30} ${H * 0.8}`}
            stroke="#3a0a10"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d={`M${tx + 6} ${H * 0.7} Q${tx + 15} ${H * 0.78} ${tx + 28} ${H * 0.82}`}
            stroke="#3a0a10"
            strokeWidth="3"
            fill="none"
          />
        </>
      )}
      {variant === "legendary" && (
        <>
          {}
          <Circle cx={tx} cy={ty + 10} r="36" fill="#f0d080" opacity={0.06} />
          {}
          <Circle cx={tx - 20} cy={ty} r="1.5" fill="#f0e0a0" opacity={0.8} />
          <Circle cx={tx + 25} cy={ty + 5} r="1" fill="#f0e0a0" opacity={0.6} />
          <Circle
            cx={tx - 10}
            cy={ty - 10}
            r="1.2"
            fill="#f0e0a0"
            opacity={0.7}
          />
        </>
      )}
    </G>
  );
}

function renderTavern(variant: TavernState) {
  const bx = W * 0.55;
  const bw = 90;
  const bh = 65;
  const by = H * 0.7 - bh;

  const wallColor = {
    wealthy: "#4a3a2a",
    beloved: "#3a2a1a",
    fortified: "#2a3040",
    mystical: "#2a2040",
    legendary: "#4a3a28",
    ruined: "#2a1a10",
    abandoned: "#2a2a2a",
    cursed: "#1a0a0e",
  }[variant];

  const roofColor = {
    wealthy: "#8a5a2a",
    beloved: "#6a3a1a",
    fortified: "#3a4a5a",
    mystical: "#4a2a5a",
    legendary: "#8a6a30",
    ruined: "#3a2010",
    abandoned: "#3a3a3a",
    cursed: "#2a0a14",
  }[variant];

  const windowGlow = {
    wealthy: "#f0d080",
    beloved: "#f0a060",
    fortified: "#80a0c0",
    mystical: "#b080e0",
    legendary: "#f0e0a0",
    ruined: "#f06020",
    abandoned: "#000000",
    cursed: "#8a2040",
  }[variant];

  const windowOpacity =
    variant === "abandoned" ? 0.1 : variant === "ruined" ? 0.5 : 0.7;
  const chimneySmoke = variant !== "abandoned" && variant !== "ruined";

  return (
    <G>
      {}
      <Rect x={bx - bw / 2} y={by} width={bw} height={bh} fill={wallColor} />

      {}
      <Polygon
        points={`${bx - bw / 2 - 8},${by} ${bx},${by - 28} ${bx + bw / 2 + 8},${by}`}
        fill={roofColor}
      />

      {}
      <Rect x={bx + 15} y={by - 38} width="10" height="20" fill={roofColor} />
      {chimneySmoke && (
        <G opacity={0.3}>
          <Circle cx={bx + 20} cy={by - 44} r="4" fill="#aaa" />
          <Circle cx={bx + 18} cy={by - 52} r="3" fill="#aaa" />
          <Circle cx={bx + 22} cy={by - 58} r="2.5" fill="#aaa" />
        </G>
      )}

      {}
      <Rect
        x={bx - 8}
        y={by + bh - 22}
        width="16"
        height="22"
        rx="2"
        fill={variant === "ruined" ? "#1a0a08" : "#2a1a0a"}
      />
      {variant !== "ruined" && variant !== "abandoned" && (
        <Circle
          cx={bx + 5}
          cy={by + bh - 10}
          r="1.5"
          fill={windowGlow}
          opacity={0.6}
        />
      )}

      {}
      <Rect
        x={bx - bw / 2 + 10}
        y={by + 14}
        width="14"
        height="12"
        rx="1"
        fill="#0a0608"
      />
      <Rect
        x={bx - bw / 2 + 10}
        y={by + 14}
        width="14"
        height="12"
        rx="1"
        fill={windowGlow}
        opacity={windowOpacity}
      />

      <Rect
        x={bx + bw / 2 - 24}
        y={by + 14}
        width="14"
        height="12"
        rx="1"
        fill="#0a0608"
      />
      <Rect
        x={bx + bw / 2 - 24}
        y={by + 14}
        width="14"
        height="12"
        rx="1"
        fill={windowGlow}
        opacity={windowOpacity}
      />

      {}
      {variant !== "ruined" && variant !== "abandoned" && (
        <G>
          <Line
            x1={bx + bw / 2 + 4}
            y1={by + 8}
            x2={bx + bw / 2 + 4}
            y2={by + 24}
            stroke={roofColor}
            strokeWidth="2"
          />
          <Rect
            x={bx + bw / 2 - 2}
            y={by + 24}
            width="14"
            height="10"
            rx="1"
            fill="#c8aa6e"
            opacity={0.6}
          />
        </G>
      )}

      {}
      {variant === "wealthy" && (
        <Rect
          x={bx - bw / 2 - 4}
          y={by - 4}
          width={bw + 8}
          height={bh + 8}
          rx="2"
          fill="#f0d080"
          opacity={0.04}
        />
      )}
      {variant === "legendary" && (
        <Rect
          x={bx - bw / 2 - 6}
          y={by - 6}
          width={bw + 12}
          height={bh + 10}
          rx="3"
          fill="#f0e0a0"
          opacity={0.06}
        />
      )}
    </G>
  );
}

function renderStateDetails(variant: TavernState) {
  const bx = W * 0.55;
  const by = H * 0.7;

  switch (variant) {
    case "wealthy":
      return (
        <G>
          {}
          <Circle cx={bx - 30} cy={by + 8} r="3" fill="#f0d080" opacity={0.6} />
          <Circle
            cx={bx - 24}
            cy={by + 10}
            r="3"
            fill="#f0d080"
            opacity={0.5}
          />
          <Circle
            cx={bx + 40}
            cy={by + 6}
            r="2.5"
            fill="#f0d080"
            opacity={0.5}
          />
          {}
          <Rect x={bx - 3} y={by - 95} width="6" height="30" fill="#8a6a38" />
          <Polygon
            points={`${bx - 3},${by - 95} ${bx + 3},${by - 95} ${bx + 12},${by - 105} ${bx + 12},${by - 85} ${bx + 3},${by - 92}`}
            fill="#c8aa6e"
          />
        </G>
      );
    case "beloved":
      return (
        <G>
          {}
          <Circle cx={bx - 35} cy={by - 6} r="4" fill="#2a1a0a" />
          <Rect x={bx - 38} y={by - 2} width="6" height="12" fill="#2a1a0a" />
          <Circle cx={bx + 50} cy={by - 6} r="4" fill="#2a1a0a" />
          <Rect x={bx + 47} y={by - 2} width="6" height="12" fill="#2a1a0a" />
          {}
          <Ellipse
            cx={bx}
            cy={by + 2}
            rx="20"
            ry="6"
            fill="#f0a060"
            opacity={0.1}
          />
        </G>
      );
    case "fortified":
      return (
        <G>
          {}
          <Rect x={bx - 60} y={by - 20} width="8" height="30" fill="#3a4a5a" />
          <Rect x={bx + 52} y={by - 20} width="8" height="30" fill="#3a4a5a" />
          {}
          <Rect x={bx - 62} y={by - 26} width="4" height="8" fill="#3a4a5a" />
          <Rect x={bx - 56} y={by - 26} width="4" height="8" fill="#3a4a5a" />
          <Rect x={bx + 52} y={by - 26} width="4" height="8" fill="#3a4a5a" />
          <Rect x={bx + 58} y={by - 26} width="4" height="8" fill="#3a4a5a" />
          {}
          <Circle cx={bx + 58} cy={by - 34} r="4" fill="#4a5a6a" />
          <Line
            x1={bx + 62}
            y1={by - 44}
            x2={bx + 62}
            y2={by - 14}
            stroke="#6a7a8a"
            strokeWidth="2"
          />
        </G>
      );
    case "mystical":
      return (
        <G>
          {}
          <Circle
            cx={bx - 40}
            cy={by - 10}
            r="3"
            fill="#b070e0"
            opacity={0.4}
          />
          <Circle
            cx={bx + 55}
            cy={by - 16}
            r="2"
            fill="#b070e0"
            opacity={0.3}
          />
          <Circle
            cx={bx - 20}
            cy={by - 80}
            r="2.5"
            fill="#b070e0"
            opacity={0.5}
          />
          {}
          <Path
            d={`M${bx - 8} ${by} L${bx - 14} ${by + 16} L${bx + 14} ${by + 16} L${bx + 8} ${by} Z`}
            fill="#b070e0"
            opacity={0.1}
          />
          {}
          <Circle
            cx={bx - 10}
            cy={by - 50}
            r="1.5"
            fill="#d0a0f0"
            opacity={0.6}
          />
          <Circle
            cx={bx + 30}
            cy={by - 40}
            r="1"
            fill="#d0a0f0"
            opacity={0.4}
          />
        </G>
      );
    case "legendary":
      return (
        <G>
          {}
          <Ellipse
            cx={bx}
            cy={by - 30}
            rx="60"
            ry="50"
            fill="#f0d080"
            opacity={0.04}
          />
          {}
          <Rect x={bx - 3} y={by - 100} width="6" height="35" fill="#c8aa6e" />
          <Path
            d={`M${bx - 12} ${by - 100} L${bx + 12} ${by - 100} L${bx} ${by - 88} Z`}
            fill="#f0d080"
            opacity={0.8}
          />
          {}
          <Circle
            cx={bx - 30}
            cy={by - 30}
            r="1.5"
            fill="#f0e0a0"
            opacity={0.7}
          />
          <Circle
            cx={bx + 40}
            cy={by - 45}
            r="1"
            fill="#f0e0a0"
            opacity={0.5}
          />
          <Circle
            cx={bx + 10}
            cy={by - 60}
            r="1.2"
            fill="#f0e0a0"
            opacity={0.6}
          />
          {}
          <Circle cx={bx - 25} cy={by - 4} r="3.5" fill="#3a2a14" />
          <Circle cx={bx + 35} cy={by - 5} r="3.5" fill="#3a2a14" />
          <Circle cx={bx - 48} cy={by - 3} r="3" fill="#3a2a14" />
        </G>
      );
    case "ruined":
      return (
        <G>
          {}
          <Circle
            cx={bx + 20}
            cy={by - 30}
            r="3"
            fill="#f06020"
            opacity={0.5}
          />
          <Circle
            cx={bx - 15}
            cy={by - 25}
            r="2"
            fill="#f08040"
            opacity={0.4}
          />
          {}
          <Path
            d={`M${bx - 20} ${by - 50} L${bx - 14} ${by - 35} L${bx - 18} ${by - 20}`}
            stroke="#1a0a08"
            strokeWidth="1.5"
            fill="none"
            opacity={0.6}
          />
          {}
          <Line
            x1={bx + 48}
            y1={by - 55}
            x2={bx + 52}
            y2={by - 42}
            stroke="#3a2010"
            strokeWidth="2"
          />
        </G>
      );
    case "abandoned":
      return (
        <G>
          {}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Circle
              key={`snow${i}`}
              cx={30 + i * 40}
              cy={by + 2 + (i % 3) * 2}
              r="1.5"
              fill="#d0e0f0"
              opacity={0.3}
            />
          ))}
          {}
          <Path
            d={`M${bx - 50} ${by - 65} Q${bx} ${by - 92} ${bx + 50} ${by - 65}`}
            stroke="#d0e0f0"
            strokeWidth="4"
            fill="none"
            opacity={0.4}
          />
          {}
          <Path
            d={`M${bx - 35} ${by - 55} Q${bx - 25} ${by - 48} ${bx - 30} ${by - 40}`}
            stroke="#6a6a6a"
            strokeWidth="0.5"
            fill="none"
            opacity={0.3}
          />
        </G>
      );
    case "cursed":
      return (
        <G>
          {}
          <Path
            d={`M${bx - 20} ${by} Q${bx - 35} ${by - 20} ${bx - 40} ${by - 40}`}
            stroke="#3a0a10"
            strokeWidth="3"
            fill="none"
            opacity={0.6}
          />
          <Path
            d={`M${bx + 20} ${by} Q${bx + 30} ${by - 15} ${bx + 45} ${by - 30}`}
            stroke="#3a0a10"
            strokeWidth="2.5"
            fill="none"
            opacity={0.5}
          />
          <Path
            d={`M${bx} ${by + 10} Q${bx + 10} ${by - 10} ${bx + 20} ${by - 35}`}
            stroke="#3a0a10"
            strokeWidth="2"
            fill="none"
            opacity={0.4}
          />
          {}
          <Ellipse
            cx={bx - 30}
            cy={by - 53}
            rx="10"
            ry="8"
            fill="#8a2040"
            opacity={0.1}
          />
          <Ellipse
            cx={bx + 30}
            cy={by - 53}
            rx="10"
            ry="8"
            fill="#8a2040"
            opacity={0.1}
          />
        </G>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 12,
  },
});
