import {
  setAudioModeAsync,
  createAudioPlayer,
  type AudioPlayer,
} from "expo-audio";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useGameStore } from "../store/gameStore";

let audioReady = false;

const players = {
  swipe: null as AudioPlayer | null,
  reward: null as AudioPlayer | null,
};

async function ensureAudioMode() {
  if (audioReady) return;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldRouteThroughEarpiece: false,
    });
    audioReady = true;
  } catch {}
}

export async function playSwipeSound(direction: "left" | "right") {
  await ensureAudioMode();

  if (direction === "right") {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
      () => undefined,
    );
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
        () => undefined,
      );
    }, 60);
  } else {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(
      () => undefined,
    );
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid).catch(
        () => undefined,
      );
    }, 50);
  }

  try {
    const { sfxEnabled } = useGameStore.getState();
    if (sfxEnabled) {
      if (!players.swipe) {
        players.swipe = createAudioPlayer(
          require("../assets/audio/swipe-card.mp3"),
        );
      }
      await players.swipe.seekTo(0);
      players.swipe.play();
    }
  } catch {}
}

export async function playCardAppear() {
  await ensureAudioMode();

  await Haptics.selectionAsync().catch(() => undefined);
}

export async function playFailure() {
  await ensureAudioMode();

  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
    () => undefined,
  );
  setTimeout(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
      () => undefined,
    );
  }, 300);
}

export async function playUITap() {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
    () => undefined,
  );
}

export async function playDragFeedback() {
  await Haptics.selectionAsync().catch(() => undefined);
}

export async function playUnlock(type: "achievement" | "collection") {
  await ensureAudioMode();

  if (type === "achievement") {
    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success,
    ).catch(() => undefined);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
        () => undefined,
      );
    }, 150);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
        () => undefined,
      );
    }, 280);
  } else {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
      () => undefined,
    );
    setTimeout(() => {
      Haptics.selectionAsync().catch(() => undefined);
    }, 100);
  }
  try {
    const { sfxEnabled } = useGameStore.getState();
    if (!sfxEnabled) return;
    if (!players.reward) {
      players.reward = createAudioPlayer(require("../assets/audio/reward.mp3"));
    }
    await players.reward.seekTo(0);
    players.reward.play();
  } catch {}
}

export function releaseAllSounds() {
  try {
    players.swipe?.release();
    players.reward?.release();
  } catch {}
}
