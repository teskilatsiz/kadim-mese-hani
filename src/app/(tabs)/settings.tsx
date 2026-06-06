import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { TavernBackdrop } from "../../components/TavernBackdrop";
import { useGameStore } from "../../store/gameStore";
import { colors, fonts } from "../../theme/tokens";
import { playUITap } from "../../utils/audioManager";

type SlotInfo = {
  exists: boolean;
  generation?: number;
  turn?: number;
  date?: string;
};

export default function SettingsScreen() {
  const musicEnabled = useGameStore((s) => s.musicEnabled);
  const sfxEnabled = useGameStore((s) => s.sfxEnabled);
  const toggleMusic = useGameStore((s) => s.toggleMusic);
  const toggleSfx = useGameStore((s) => s.toggleSfx);
  const hardReset = useGameStore((s) => s.hardReset);
  const saveGame = useGameStore((s) => s.saveGame);
  const loadGame = useGameStore((s) => s.loadGame);
  const deleteGame = useGameStore((s) => s.deleteGame);
  const router = useRouter();

  const [slots, setSlots] = useState<Record<number, SlotInfo>>({
    1: { exists: false },
    2: { exists: false },
    3: { exists: false },
  });

  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: "",
    message: "",
    confirmText: "",
    cancelText: "İptal",
    isDestructive: false,
    onConfirm: () => {},
  });

  const rotateGlow = useSharedValue(0);

  React.useEffect(() => {
    rotateGlow.value = withRepeat(
      withTiming(360, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const rotateGlowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateGlow.value}deg` }],
  }));

  const showAlert = (
    title: string,
    message: string,
    confirmText: string,
    isDestructive: boolean,
    onConfirm: () => void
  ) => {
    setModalConfig({
      visible: true,
      title,
      message,
      confirmText,
      cancelText: "İptal",
      isDestructive,
      onConfirm,
    });
  };

  const closeAlert = () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
  };

  const loadSlotsInfo = useCallback(async () => {
    const newSlots = { ...slots };
    for (let i = 1; i <= 3; i++) {
      try {
        const data = await AsyncStorage.getItem(`save_slot_${i}`);
        if (data) {
          const parsed = JSON.parse(data);
          newSlots[i] = {
            exists: true,
            generation: parsed.generation,
            turn: parsed.turn,
            date: new Date().toLocaleDateString(), // Simple date as we don't save date directly, but we can just say "Dolu"
          };
        } else {
          newSlots[i] = { exists: false };
        }
      } catch (e) {
        newSlots[i] = { exists: false };
      }
    }
    setSlots(newSlots);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSlotsInfo();
    }, [loadSlotsInfo])
  );

  const handleSave = async (slotIndex: number) => {
    playUITap();
    showAlert(
      "Oyunu Kaydet",
      `Kayıt ${slotIndex} üzerine yazılsın mı?`,
      "Kaydet",
      false,
      async () => {
        closeAlert();
        await saveGame(slotIndex);
        loadSlotsInfo();
      }
    );
  };

  const handleLoad = async (slotIndex: number) => {
    playUITap();
    showAlert(
      "Oyunu Yükle",
      `Kayıt ${slotIndex} yüklensin mi? Mevcut ilerlemeniz kaydedilmediyse kaybolacaktır.`,
      "Yükle",
      true,
      async () => {
        closeAlert();
        const success = await loadGame(slotIndex);
        if (success) {
          router.navigate("/game");
        } else {
          setTimeout(() => {
            showAlert("Hata", "Kayıt dosyası okunamadı.", "Tamam", true, closeAlert);
          }, 300);
        }
      }
    );
  };

  const handleDelete = (slotIndex: number) => {
    playUITap();
    showAlert(
      "Kaydı Sil",
      `Kayıt ${slotIndex} kalıcı olarak silinecek. Emin misiniz?`,
      "Sil",
      true,
      async () => {
        closeAlert();
        await deleteGame(slotIndex);
        loadSlotsInfo();
      }
    );
  };

  const handleReset = () => {
    playUITap();
    showAlert(
      "Verileri Sıfırla",
      "Tüm ilerlemeniz, başarımlarınız ve koleksiyonunuz silinecek. Emin misiniz?",
      "Sıfırla",
      true,
      () => {
        closeAlert();
        hardReset();
      }
    );
  };

  return (
    <View style={styles.screen}>
      <TavernBackdrop />
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Ayarlar</Text>
          <Text style={styles.subtitle}>Han'ın Yönetimi</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Genel Ayarlar */}
          <Text style={styles.sectionTitle}>GENEL</Text>
          <Pressable style={styles.row} onPress={() => { playUITap(); toggleMusic(); }}>
            <View style={[styles.iconContainer, { backgroundColor: musicEnabled ? colors.accentGold : "#3a2b25" }]}>
              <MaterialCommunityIcons name={musicEnabled ? "music" : "music-off"} size={24} color={musicEnabled ? "#1a110e" : colors.accentGold} />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowText}>Arka Plan Müziği</Text>
              <Text style={styles.rowSubtext}>{musicEnabled ? "Açık" : "Kapalı"}</Text>
            </View>
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.row} onPress={() => { playUITap(); toggleSfx(); }}>
            <View style={[styles.iconContainer, { backgroundColor: sfxEnabled ? colors.accentGold : "#3a2b25" }]}>
              <MaterialCommunityIcons name={sfxEnabled ? "volume-high" : "volume-off"} size={24} color={sfxEnabled ? "#1a110e" : colors.accentGold} />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowText}>Ses Efektleri</Text>
              <Text style={styles.rowSubtext}>{sfxEnabled ? "Açık" : "Kapalı"}</Text>
            </View>
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.row} onPress={handleReset}>
            <View style={[styles.iconContainer, { backgroundColor: "rgba(200, 55, 77, 0.2)" }]}>
              <MaterialCommunityIcons name="delete-forever" size={24} color={colors.ember} />
            </View>
            <View style={styles.rowInfo}>
              <Text style={[styles.rowText, { color: colors.ember }]}>Verileri Sıfırla</Text>
              <Text style={styles.rowSubtext}>Tüm koleksiyon ve başarımlar silinir</Text>
            </View>
          </Pressable>

          {/* Kayıt Sistemi */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>KAYIT YÖNETİMİ</Text>

          {[1, 2, 3].map((slot) => {
            const info = slots[slot];
            return (
              <LinearGradient
                key={slot}
                colors={["rgba(200, 170, 110, 0.1)", "rgba(200, 170, 110, 0.02)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.slotCard}
              >
                <View style={styles.slotInfo}>
                  <Text style={styles.slotTitle}>Kayıt {slot}</Text>
                  <Text style={styles.slotDetail}>
                    {info.exists
                      ? `Nesil ${info.generation} - Tur ${info.turn}`
                      : "Boş Slot"}
                  </Text>
                </View>

                <View style={styles.slotActions}>
                  {info.exists && (
                    <>
                      <Pressable
                        style={[styles.actionBtn, styles.deleteBtn]}
                        onPress={() => handleDelete(slot)}
                      >
                        <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.ember} />
                      </Pressable>
                      <Pressable
                        style={[styles.actionBtn, styles.loadBtn]}
                        onPress={() => handleLoad(slot)}
                      >
                        <MaterialCommunityIcons name="folder-download" size={18} color="#f0e6d2" />
                        <Text style={styles.actionBtnText}>Yükle</Text>
                      </Pressable>
                    </>
                  )}
                  <Pressable
                    style={[styles.actionBtn, styles.saveBtn]}
                    onPress={() => handleSave(slot)}
                  >
                    <MaterialCommunityIcons name="content-save" size={18} color="#1a1510" />
                    <Text style={[styles.actionBtnText, { color: "#1a1510" }]}>Kaydet</Text>
                  </Pressable>
                </View>
              </LinearGradient>
            );
          })}

          <View style={styles.footer}>
            <Text style={styles.footerText}>KADİM MEŞE HANI</Text>
            <Text style={styles.footerSubtext}>v1.0.1 · Teşkilatsız</Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={modalConfig.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCardWrapper}>
            <View style={styles.modalGradientBorder}>
              <LinearGradient
                colors={
                  modalConfig.isDestructive
                    ? ["#c8374d", "#8a2030", "#14080a", "#8a2030", "#c8374d"]
                    : ["#c8aa6e", "#6a5030", "#14100c", "#6a5030", "#c8aa6e"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    width: "200%",
                    height: "200%",
                  },
                  rotateGlowStyle,
                ]}
              >
                <LinearGradient
                  colors={
                    modalConfig.isDestructive
                      ? ["transparent", "transparent", "#ff8a9a", "#c8374d", "transparent", "transparent"]
                      : ["transparent", "transparent", "#fff5d1", "#c8aa6e", "transparent", "transparent"]
                  }
                  locations={[0, 0.4, 0.48, 0.52, 0.6, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
              </Animated.View>

              <View style={styles.modalContent}>
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color: modalConfig.isDestructive
                        ? "#c8374d"
                        : colors.accentGold,
                    },
                  ]}
                >
                  {modalConfig.title}
                </Text>
                <Text style={styles.modalMessage}>{modalConfig.message}</Text>
                <View style={styles.modalButtons}>
                  <Pressable
                    style={styles.modalCancelBtn}
                    onPress={() => {
                      playUITap();
                      closeAlert();
                    }}
                  >
                    <Text style={styles.modalCancelText}>
                      {modalConfig.cancelText}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.modalConfirmBtn,
                      {
                        backgroundColor: modalConfig.isDestructive
                          ? "#c8374d"
                          : colors.accentGold,
                      },
                    ]}
                    onPress={() => {
                      playUITap();
                      modalConfig.onConfirm();
                    }}
                  >
                    <Text style={styles.modalConfirmText}>
                      {modalConfig.confirmText}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#1a1510" },
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    color: colors.accentGold,
    fontFamily: fonts.display,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 1,
  },
  subtitle: {
    color: "#6a5a42",
    fontFamily: fonts.serif,
    fontSize: 14,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "800",
    color: "rgba(200, 170, 110, 0.5)",
    letterSpacing: 2,
    marginBottom: 12,
    marginLeft: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(14, 17, 20, 0.6)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.1)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  rowInfo: { flex: 1 },
  rowText: {
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: "700",
    color: "#f0e6d2",
    letterSpacing: 0.5,
  },
  rowSubtext: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: "rgba(200, 170, 110, 0.6)",
    marginTop: 4,
  },
  divider: {
    height: 12,
  },
  slotCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.2)",
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  slotInfo: {
    flex: 1,
  },
  slotTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: "800",
    color: colors.accentGold,
  },
  slotDetail: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: "#9a8a6a",
    marginTop: 4,
  },
  slotActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  saveBtn: {
    backgroundColor: colors.accentGold,
  },
  loadBtn: {
    backgroundColor: "rgba(200, 170, 110, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.3)",
  },
  deleteBtn: {
    backgroundColor: "rgba(200, 55, 77, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(200, 55, 77, 0.3)",
    paddingHorizontal: 10,
  },
  actionBtnText: {
    fontFamily: fonts.body,
    fontSize: 12,
    fontWeight: "800",
    color: "#f0e6d2",
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
    opacity: 0.5,
  },
  footerText: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.accentGold,
    letterSpacing: 2,
    fontWeight: "900",
  },
  footerSubtext: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: "#8a7a60",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCardWrapper: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 20,
  },
  modalGradientBorder: {
    borderRadius: 16,
    padding: 2,
    overflow: "hidden",
  },
  modalContent: {
    backgroundColor: "#161310",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
    textAlign: "center",
  },
  modalMessage: {
    fontFamily: fonts.serif,
    fontSize: 15,
    color: "#f0e6d2",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    opacity: 0.8,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(200, 170, 110, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelText: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "800",
    color: "rgba(200, 170, 110, 0.8)",
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalConfirmText: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: "900",
    color: "#1a1510",
  },
});
