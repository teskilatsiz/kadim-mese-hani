import React, { useState, useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors, fonts } from "../theme/tokens";

function TavernLogo({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M16 28V18"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Path
        d="M16 7c-5 0-9 3-9 6s2 5 4 6c-1 1.5 0 3 1 3h8c1 0 2-1.5 1-3 2-1 4-3 4-6s-4-6-9-6Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <Path
        d="M13 28c-1 1-3 1.5-4 1.5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity={0.4}
      />
      <Path
        d="M19 28c1 1 3 1.5 4 1.5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity={0.4}
      />
      <Circle cx="16" cy="12" r="1.5" fill={color} opacity={0.3} />
    </Svg>
  );
}

const STEPS = [
  {
    icon: "tree" as const,
    isSvg: true,
    title: "Kadim Meşe Hanı'na\nHoş Geldin",
    body: "Sen bir hancısın. Kapına gelen yolculara karar verecek, hanını ayakta tutacaksın. Her gece yeni bir misafir, her misafir yeni bir kader.",
  },
  {
    icon: "chart-bar" as const,
    title: "Dört Denge",
    body: "Hanında 4 kaynak var. Herhangi biri sıfıra düşerse veya sonuna dayanırsa han çöker!",
    resources: [
      { icon: "silverware-clean", name: "Kiler", desc: "Yiyecek stokun", color: "#d1cdc5" },
      { icon: "gold", name: "Kasa", desc: "Altın ve servetin", color: "#e8a33d" },
      { icon: "shield-sword", name: "Düzen", desc: "Güvenlik ve otorite", color: "#7b8fa3" },
      { icon: "drama-masks", name: "Ruh", desc: "Hanın atmosferi ve şöhreti", color: "#c8374d" },
    ],
  },
  {
    icon: "gesture-swipe" as const,
    title: "Kaydır ve Karar Ver",
    body: "Her kart bir misafir veya olaydır.\n\n← Sola kaydır: Reddet / Güvenli seçenek\n→ Sağa kaydır: Kabul et / Riskli seçenek\n\nDiyalogları dikkatlice oku — hangi kaynağı etkileyeceğinin ipuçlarını verir.",
  },
  {
    icon: "trophy" as const,
    title: "Zafer ve Yenilgi",
    body: "30 geceyi 4 kaynağı da dengede tutarak atlatırsan zafer kazanırsın!\n\nAma bir kaynak sıfıra düşer veya taşarsa yenilirsin. Yenildiğinde yeni bir nesil başlar — kararların kalır ama kaynaklar sıfırlanır.",
  },
  {
    icon: "content-save" as const,
    title: "Kaydetme ve Yükleme",
    body: (
      <Text style={{ color: "#b0a080", fontFamily: fonts.serif, fontSize: 14, lineHeight: 22, textAlign: "center" }}>
        Oyununuzu istediğiniz zaman kaydedebilirsiniz.{"\n\n"}
        Ayarlar menüsünden (<MaterialCommunityIcons name="cog" size={16} color="#b0a080" />) kayıt slotlarına erişin. 3 farklı kayıt slotu mevcut — istediğiniz zaman kaydedin, yükleyin veya silin.
      </Text>
    ),
  },
  {
    icon: "sword-cross" as const,
    title: "Hazır mısın?",
    body: "Kadim Meşe'nin kapıları açılıyor. Misafirlerin seni bekliyor.\n\nHanını efsaneye dönüştür!",
  },
];

type OnboardingModalProps = {
  visible: boolean;
  onDone: () => void;
};

export function OnboardingModal({ visible, onDone }: OnboardingModalProps) {
  const [step, setStep] = useState(0);

  // Border glow rotation
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 6000, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [visible]);

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      AsyncStorage.setItem("onboarding_done", "true").catch(() => {});
      onDone();
    }
  }, [step, onDone]);

  const handleBack = useCallback(() => {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  }, [step]);

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <View style={styles.outerShell}>
      {/* Border gradient base */}
      <LinearGradient
        colors={["#c8aa6e", "#6a5030", "#3a2818", "#6a5030", "#c8aa6e"]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Animated sweep */}
      <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>
        <Animated.View style={[{ width: 800, height: 800 }, rotateStyle]}>
          <LinearGradient
            colors={["transparent", "transparent", "#fff5d1", "#c8aa6e", "transparent", "transparent"]}
            locations={[0, 0.4, 0.48, 0.52, 0.6, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>

          {/* Inner content panel */}
          <View style={styles.innerPanel}>
            {/* Step indicator */}
            <View style={styles.stepIndicator}>
              {STEPS.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === step && styles.dotActive,
                    i < step && styles.dotDone,
                  ]}
                />
              ))}
            </View>

            {/* Step content with key-based crossfade */}
            <Animated.View
              key={step}
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(150)}
              style={styles.stepContent}
            >
              {/* Icon */}
              <View style={styles.iconCircle}>
                {current.isSvg ? (
                  <TavernLogo size={40} color={colors.accentGold} />
                ) : (
                  <MaterialCommunityIcons
                    name={current.icon as any}
                    size={40}
                    color={colors.accentGold}
                  />
                )}
              </View>

              {/* Title */}
              <Text style={styles.title}>{current.title}</Text>

              {/* Body */}
              {typeof current.body === "string" ? (
                <Text style={styles.body}>{current.body}</Text>
              ) : (
                current.body
              )}

              {/* Resources if present */}
              {current.resources && (
                <View style={styles.resourcesContainer}>
                  {current.resources.map((res, i) => (
                    <View key={i} style={styles.resourceRow}>
                      <View style={styles.resourceIconWrapper}>
                        <MaterialCommunityIcons name={res.icon as any} size={20} color={res.color} />
                      </View>
                      <Text style={styles.resourceName}>{res.name}</Text>
                      <Text style={styles.resourceDesc}>— {res.desc}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Animated.View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              {step > 0 ? (
                <Pressable
                  style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
                  onPress={handleBack}
                >
                  <Text style={styles.backBtnText}>Geri</Text>
                </Pressable>
              ) : (
                <View style={{ flex: 1 }} />
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.nextBtn,
                  isLast && styles.nextBtnLast,
                  pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
                ]}
                onPress={handleNext}
              >
                <Text style={[styles.nextBtnText, isLast && styles.nextBtnTextLast]}>
                  {isLast ? "Başla!" : "Sonraki"}
                </Text>
                {!isLast && (
                  <MaterialCommunityIcons name="chevron-right" size={18} color={colors.accentGold} />
                )}
              </Pressable>
            </View>
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerShell: {
    width: "100%",
    height: "100%",
    maxWidth: 400,
    maxHeight: 780,
    borderRadius: 20,
    padding: 1.5,
    overflow: "hidden",
  },

  innerPanel: {
    flex: 1,
    backgroundColor: colors.panel,
    borderRadius: 19,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },

  /* Step dots */
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(200, 170, 110, 0.15)",
  },
  dotActive: {
    backgroundColor: colors.accentGold,
    width: 20,
  },
  dotDone: {
    backgroundColor: "rgba(200, 170, 110, 0.4)",
  },

  /* Content */
  stepContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(200, 170, 110, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  title: {
    color: colors.accentGold,
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 16,
    lineHeight: 30,
  },

  body: {
    color: "#b0a080",
    fontFamily: fonts.serif,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },

  resourcesContainer: {
    marginTop: 16,
    width: "100%",
    gap: 8,
  },
  resourceRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(200, 170, 110, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.1)",
  },
  resourceIconWrapper: {
    width: 28,
    alignItems: "center",
  },
  resourceName: {
    fontFamily: fonts.display,
    fontSize: 14,
    fontWeight: "800",
    color: colors.accentGold,
    marginLeft: 4,
    width: 55,
  },
  resourceDesc: {
    fontFamily: fonts.serif,
    fontSize: 13,
    color: "#a09080",
    flex: 1,
  },

  /* Buttons */
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 20,
    gap: 12,
  },

  backBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.18)",
    alignItems: "center",
  },
  backBtnText: {
    color: "#8a7a60",
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "700",
  },

  nextBtn: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.3)",
    backgroundColor: "rgba(200, 170, 110, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  nextBtnLast: {
    backgroundColor: colors.accentGold,
    borderColor: colors.accentGold,
  },
  nextBtnText: {
    color: colors.accentGold,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "800",
  },
  nextBtnTextLast: {
    color: colors.ink,
  },
});
