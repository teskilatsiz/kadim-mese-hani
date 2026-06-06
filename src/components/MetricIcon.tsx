import React from "react";
import Svg, { Circle, Ellipse, Line, Path, Rect } from "react-native-svg";

type MetricIconProps = {
  metric: "pantry" | "wealth" | "security" | "atmosphere";
  size: number;
  color: string;
};

export function MetricIcon({ metric, size, color }: MetricIconProps) {
  switch (metric) {
    case "pantry":
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          {}
          <Ellipse
            cx="10"
            cy="12"
            rx="6"
            ry="4"
            stroke={color}
            strokeWidth="1.5"
          />
          <Path
            d="M7 12V7c0-1.5 1.5-3 3-3s3 1.5 3 3v5"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <Line
            x1="10"
            y1="4"
            x2="10"
            y2="8"
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
            opacity={0.5}
          />
        </Svg>
      );
    case "wealth":
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          {}
          <Circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1.5" />
          <Circle
            cx="10"
            cy="10"
            r="4.5"
            stroke={color}
            strokeWidth="1"
            opacity={0.4}
          />
          <Path
            d="M9 7.5v5M11 7.5v5"
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
            opacity={0.6}
          />
        </Svg>
      );
    case "security":
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          {}
          <Path
            d="M10 3L4 6v4c0 4 3 6.5 6 7.5 3-1 6-3.5 6-7.5V6l-6-3Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <Path
            d="M10 7v4"
            stroke={color}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity={0.5}
          />
          <Circle cx="10" cy="13" r="0.8" fill={color} opacity={0.5} />
        </Svg>
      );
    case "atmosphere":
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          {}
          <Path
            d="M6 5c0-1.5 1.8-3 4-3s4 1.5 4 3"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <Line
            x1="6"
            y1="5"
            x2="6"
            y2="15"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <Line
            x1="14"
            y1="5"
            x2="14"
            y2="15"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <Path
            d="M6 15c0 1.5 1.8 2.5 4 2.5s4-1 4-2.5"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <Line
            x1="8"
            y1="6"
            x2="8"
            y2="14"
            stroke={color}
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity={0.4}
          />
          <Line
            x1="10"
            y1="5"
            x2="10"
            y2="15"
            stroke={color}
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity={0.4}
          />
          <Line
            x1="12"
            y1="6"
            x2="12"
            y2="14"
            stroke={color}
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity={0.4}
          />
        </Svg>
      );
  }
}
