import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import deckData from "../data/deck.json";
import { calculateEnding } from "../data/endings";
import type {
  Achievement,
  AchievementCondition,
  Card,
  CollectionEntry,
  GameEnding,
  FailureState,
  MetricKey,
  Metrics,
  SwipeDirection,
  SwipeEffects,
} from "../types/game";

const deck = deckData as Card[];

export const metricKeys: MetricKey[] = [
  "pantry",
  "wealth",
  "security",
  "atmosphere",
];

export const initialMetrics: Metrics = {
  pantry: 50,
  wealth: 50,
  security: 50,
  atmosphere: 50,
};

const VICTORY_TURN = 30;

const achievementDefs: Omit<Achievement, "unlockedAt">[] = [
  {
    id: "first_night",
    title: "İlk Gece",
    description: "İlk kararını verdin.",
    icon: "weather-night",
    condition: { type: "turns_survived", count: 1 },
  },
  {
    id: "survivor_10",
    title: "Dayanıklı Hancı",
    description: "10 gece hayatta kal.",
    icon: "shield-sword",
    condition: { type: "turns_survived", count: 10 },
  },
  {
    id: "survivor_25",
    title: "Efsane Hancı",
    description: "25 gece hayatta kal.",
    icon: "crown",
    condition: { type: "turns_survived", count: 25 },
  },
  {
    id: "gen_2",
    title: "Yeni Nesil",
    description: "İkinci nesle geç.",
    icon: "book-clock",
    condition: { type: "generations_reached", count: 2 },
  },
  {
    id: "gen_5",
    title: "Hanedan",
    description: "5 nesil sürdür.",
    icon: "castle",
    condition: { type: "generations_reached", count: 5 },
  },
  {
    id: "meet_5",
    title: "Tanıdık Yüzler",
    description: "5 farklı karakterle karşılaş.",
    icon: "account-group",
    condition: { type: "cards_encountered", count: 5 },
  },
  {
    id: "meet_all",
    title: "Herkesi Tanıyorum",
    description: "Tüm karakterlerle karşılaş.",
    icon: "book-open-page-variant",
    condition: { type: "all_cards_seen" },
  },
  {
    id: "alchemist_accepted",
    title: "Simya Dostu",
    description: "Simyacıya oda ver.",
    icon: "flask",
    condition: { type: "flag_triggered", flag: "simyaci_kabul_edildi" },
  },
  {
    id: "princess_hidden",
    title: "Gizli Sığınak",
    description: "Prensesi sakla.",
    icon: "shield-star",
    condition: { type: "flag_triggered", flag: "prenses_saklandi" },
  },
  {
    id: "bard_stage",
    title: "Şarkıcının Gecesi",
    description: "Ozana sahne ver.",
    icon: "music-note",
    condition: { type: "flag_triggered", flag: "ozan_sahne_aldi" },
  },
  {
    id: "basement_open",
    title: "Karanlık Bodrum",
    description: "Bodrumu aç.",
    icon: "key-variant",
    condition: { type: "flag_triggered", flag: "bodrum_acildi" },
  },
  {
    id: "danger_zone",
    title: "Bıçak Sırtı",
    description: "Bir metrik tehlike bölgesine girsin.",
    icon: "alert-decagram",
    condition: { type: "metric_danger", metric: "pantry" },
  },
];

type GameState = {
  metrics: Metrics;
  flags: string[];
  queue: Card[];
  seenIds: string[];
  generation: number;
  turn: number;
  failure: FailureState | null;
  ending: GameEnding | null;
  startTime: number;

  newCardsThisRun: string[];

  collection: CollectionEntry[];
  achievements: Achievement[];
  totalTurns: number;
  unreadAchievements: number;
  unreadCollections: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  lastLoadedAt: number;

  swipe: (direction: SwipeDirection) => void;
  continueAfterFailure: () => void;
  resetGame: () => void;
  hardReset: () => void;
  clearUnreadAchievements: () => void;
  clearUnreadCollections: () => void;
  clearNewFlags: () => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleSfx: () => void;
  dismissEnding: () => void;
  saveGame: (slotIndex: number) => Promise<void>;
  loadGame: (slotIndex: number) => Promise<boolean>;
  deleteGame: (slotIndex: number) => Promise<void>;
};

function clampMetric(value: number) {
  return Math.max(0, Math.min(100, value));
}

function applyEffects(metrics: Metrics, effects: SwipeEffects): Metrics {
  return metricKeys.reduce<Metrics>(
    (next, key) => {
      next[key] = clampMetric(metrics[key] + (effects[key] ?? 0));
      return next;
    },
    { ...metrics },
  );
}

function resolveFailure(
  metrics: Metrics,
  cardId: string,
  decisionText: string,
): FailureState | null {
  for (const key of metricKeys) {
    if (metrics[key] <= 0) {
      return {
        metric: key,
        threshold: "empty",
        cardId,
        decisionText,
        ...failureCopy[key].empty,
      };
    }
    if (metrics[key] >= 100) {
      return {
        metric: key,
        threshold: "overflow",
        cardId,
        decisionText,
        ...failureCopy[key].overflow,
      };
    }
  }
  return null;
}

function isEligible(card: Card, flags: string[]) {
  return (
    !card.prerequisites ||
    card.prerequisites.every((flag) => flags.includes(flag))
  );
}

function seedFromFlags(flags: string[], generation: number) {
  const text = `${generation}:${flags.slice().sort().join("|")}`;
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleCards(cards: Card[], flags: string[], generation: number) {
  const random = mulberry32(seedFromFlags(flags, generation));
  const copy = cards.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function buildQueue(flags: string[], generation: number) {
  return shuffleCards(
    deck.filter((card) => isEligible(card, flags)),
    flags,
    generation,
  );
}

function buildNextQueue(
  remaining: Card[],
  flags: string[],
  generation: number,
  currentCardId: string,
  seenIds: string[],
) {
  const eligibleRemaining = remaining.filter((card) => isEligible(card, flags));
  const remainingIds = new Set(eligibleRemaining.map((card) => card.id));
  const newlyEligible = deck.filter(
    (card) =>
      card.id !== currentCardId &&
      !remainingIds.has(card.id) &&
      !seenIds.includes(card.id) &&
      isEligible(card, flags),
  );
  const next = [
    ...shuffleCards(newlyEligible, flags, generation + remaining.length + 1),
    ...eligibleRemaining,
  ];
  return next.length > 0
    ? { queue: next, seenIds }
    : { queue: buildQueue(flags, generation + 1), seenIds: [] };
}

function addFlag(flags: string[], flag?: string) {
  if (!flag || flags.includes(flag)) return flags;
  return [...flags, flag];
}

function updateCollection(
  collection: CollectionEntry[],
  cardId: string,
  direction: SwipeDirection,
  generation: number,
): CollectionEntry[] {
  const existing = collection.find((e) => e.cardId === cardId);
  if (existing) {
    return collection.map((e) =>
      e.cardId === cardId
        ? {
            ...e,
            timesEncountered: e.timesEncountered + 1,
            lastDecision: direction,
          }
        : e,
    );
  }
  return [
    ...collection,
    {
      cardId,
      firstEncounteredGeneration: generation,
      timesEncountered: 1,
      lastDecision: direction,
      isNew: true,
    },
  ];
}

function checkAchievements(
  achievements: Achievement[],
  state: {
    totalTurns: number;
    generation: number;
    collection: CollectionEntry[];
    flags: string[];
    metrics: Metrics;
  },
): Achievement[] {
  return achievements.map((ach) => {
    if (ach.unlockedAt !== null) return ach;

    const c = ach.condition;
    let unlocked = false;

    switch (c.type) {
      case "turns_survived":
        unlocked = state.totalTurns >= c.count;
        break;
      case "generations_reached":
        unlocked = state.generation >= c.count;
        break;
      case "cards_encountered":
        unlocked = state.collection.length >= c.count;
        break;
      case "flag_triggered":
        unlocked = state.flags.includes(c.flag);
        break;
      case "metric_danger":
        unlocked = metricKeys.some(
          (k) => state.metrics[k] <= 15 || state.metrics[k] >= 85,
        );
        break;
      case "all_cards_seen":
        unlocked = state.collection.length >= deck.length;
        break;
    }

    return unlocked ? { ...ach, unlockedAt: state.generation, isNew: true } : ach;
  });
}

const failureCopy = {
  pantry: {
    empty: {
      title: "Erzak Tükendi",
      description:
        "Aç kalan müşteriler hanın kapısını terk etti; ocaktaki son alev de söndü.",
    },
    overflow: {
      title: "Kiler Çürüdü",
      description:
        "Taşıp dökülen erzak fareleri ve hastalığı çağırdı; han bir gecede boşaldı.",
    },
  },
  wealth: {
    empty: {
      title: "Kasa Boşaldı",
      description:
        "Borçlar kapıdan içeri, müşteriler kapıdan dışarı girdi. Hanın tabelası indirildi.",
    },
    overflow: {
      title: "Altın Laneti",
      description:
        "Servetin kokusu haydutları ve vergi memurlarını çekti; kimse huzur bulamadı.",
    },
  },
  security: {
    empty: {
      title: "Düzen Çöktü",
      description:
        "Kavgalar tezgâhı parçaladı, korku sokağa taştı. Mührü sabaha karşı vuruldu.",
    },
    overflow: {
      title: "Demir Yumruk",
      description:
        "Fazla sıkı düzen hanın ruhunu ezdi; kapıdan içeri yalnız sessizlik girdi.",
    },
  },
  atmosphere: {
    empty: {
      title: "Han Sessizleşti",
      description:
        "Şarkılar sustu, mumlar kısıldı, Kadim Meşe adı yollardan silindi.",
    },
    overflow: {
      title: "Şöhret Zehirledi",
      description:
        "Efsanenin gürültüsü hanın taşıyabileceğinden büyüktü; kalabalık hanı yuttu.",
    },
  },
} satisfies Record<
  MetricKey,
  Record<"empty" | "overflow", Pick<FailureState, "title" | "description">>
>;

export const useGameStore = create<GameState>((set, get) => ({
  metrics: initialMetrics,
  flags: [],
  queue: buildQueue([], 1),
  seenIds: [],
  generation: 1,
  turn: 1,
  failure: null,
  ending: null,
  startTime: Date.now(),
  newCardsThisRun: [],
  collection: [],
  achievements: achievementDefs.map((a) => ({ ...a, unlockedAt: null })),
  totalTurns: 0,
  unreadAchievements: 0,
  unreadCollections: 0,
  soundEnabled: true,
  musicEnabled: true,
  sfxEnabled: true,
  lastLoadedAt: 0,
  swipe: (direction) => {
    const state = get();
    const currentCard = state.queue[0];
    if (!currentCard || state.failure || state.ending) return;

    if (currentCard.isReward) {
      set({ queue: state.queue.slice(1) });
      return;
    }

    const decision =
      direction === "left" ? currentCard.leftSwipe : currentCard.rightSwipe;
    const nextFlags = addFlag(state.flags, decision.triggerFlag);
    const nextMetrics = applyEffects(state.metrics, decision.effects);
    const nextSeenIds = [...state.seenIds, currentCard.id];
    const nextDeckState = buildNextQueue(
      state.queue.slice(1),
      nextFlags,
      state.generation,
      currentCard.id,
      nextSeenIds,
    );
    const failure = resolveFailure(nextMetrics, currentCard.id, decision.text);
    const nextTotalTurns = state.totalTurns + 1;
    const nextTurn = state.turn + 1;
    const nextCollection = updateCollection(
      state.collection,
      currentCard.id,
      direction,
      state.generation,
    );

    const isNewCard = !state.collection.some(
      (e) => e.cardId === currentCard.id,
    );
    let nextNewCardsThisRun = state.newCardsThisRun;
    if (isNewCard) {
      nextNewCardsThisRun = [...state.newCardsThisRun, currentCard.id];
    }

    const achievementState = {
      totalTurns: nextTotalTurns,
      generation: state.generation,
      collection: nextCollection,
      flags: nextFlags,
      metrics: nextMetrics,
    };
    const nextAchievements = checkAchievements(
      state.achievements,
      achievementState,
    );

    const rewardCards: Card[] = [];

    let newUnreadCollections = state.unreadCollections;
    if (isNewCard) {
      newUnreadCollections += 1;
      rewardCards.push({
        id: `reward-collection-${currentCard.id}-${state.generation}-${state.turn}`,
        characterName: "YENİ KEŞİF",
        dialogue: `${currentCard.characterName} ile ilk kez karşılaştın.`,
        portraitKey: currentCard.portraitKey,
        leftSwipe: { text: "Devam Et", effects: {} },
        rightSwipe: { text: "Devam Et", effects: {} },
        isReward: true,
        rewardType: "collection",
      });
    }

    let newUnreadAchievements = state.unreadAchievements;
    for (let i = 0; i < nextAchievements.length; i++) {
      if (
        nextAchievements[i].unlockedAt !== null &&
        state.achievements[i].unlockedAt === null
      ) {
        newUnreadAchievements += 1;
        rewardCards.push({
          id: `reward-achievement-${nextAchievements[i].id}-${state.generation}-${state.turn}`,
          characterName: "BAŞARIM",
          dialogue: nextAchievements[i].title,
          portraitKey: "achievement_unlock",
          leftSwipe: { text: "Devam Et", effects: {} },
          rightSwipe: { text: "Devam Et", effects: {} },
          isReward: true,
          rewardType: "achievement",
          rewardIcon: nextAchievements[i].icon,
        });
      }
    }

    if (!failure && nextTurn > VICTORY_TURN) {
      const elapsedSeconds = Math.floor((Date.now() - state.startTime) / 1000);
      const ending = calculateEnding(
        "victory",
        nextFlags,
        nextMetrics,
        {
          nightsSurvived: nextTotalTurns,
          guestsServed: nextTotalTurns,
          secretEventsFound: 0,
          criticalChoices: nextFlags.filter((f) => !f.startsWith("reward")),
          playTimeSeconds: elapsedSeconds,
          generation: state.generation,
        },
        nextNewCardsThisRun,
      );

      set({
        metrics: nextMetrics,
        flags: nextFlags,
        queue: [...rewardCards, ...nextDeckState.queue],
        seenIds: nextDeckState.seenIds,
        turn: nextTurn,
        failure: null,
        ending,
        collection: nextCollection,
        achievements: nextAchievements,
        totalTurns: nextTotalTurns,
        unreadAchievements: newUnreadAchievements,
        unreadCollections: newUnreadCollections,
        newCardsThisRun: nextNewCardsThisRun,
      });
      return;
    }

    if (failure) {
      const elapsedSeconds = Math.floor((Date.now() - state.startTime) / 1000);
      const ending = calculateEnding(
        "defeat",
        nextFlags,
        nextMetrics,
        {
          nightsSurvived: nextTotalTurns,
          guestsServed: nextTotalTurns,
          secretEventsFound: 0,
          criticalChoices: nextFlags.filter((f) => !f.startsWith("reward")),
          playTimeSeconds: elapsedSeconds,
          generation: state.generation,
        },
        nextNewCardsThisRun,
        failure.metric,
        failure.threshold,
      );

      set({
        metrics: nextMetrics,
        flags: nextFlags,
        queue: [...rewardCards, ...nextDeckState.queue],
        seenIds: nextDeckState.seenIds,
        turn: nextTurn,
        failure,
        ending,
        collection: nextCollection,
        achievements: nextAchievements,
        totalTurns: nextTotalTurns,
        unreadAchievements: newUnreadAchievements,
        unreadCollections: newUnreadCollections,
        newCardsThisRun: nextNewCardsThisRun,
      });
      return;
    }

    set({
      metrics: nextMetrics,
      flags: nextFlags,
      queue: [...rewardCards, ...nextDeckState.queue],
      seenIds: nextDeckState.seenIds,
      turn: nextTurn,
      failure,
      collection: nextCollection,
      achievements: nextAchievements,
      totalTurns: nextTotalTurns,
      unreadAchievements: newUnreadAchievements,
      unreadCollections: newUnreadCollections,
      newCardsThisRun: nextNewCardsThisRun,
    });
  },

  continueAfterFailure: () => {
    const state = get();
    const nextGeneration = state.generation + 1;
    const nextAchievements = checkAchievements(state.achievements, {
      totalTurns: state.totalTurns,
      generation: nextGeneration,
      collection: state.collection,
      flags: state.flags,
      metrics: initialMetrics,
    });

    set({
      metrics: initialMetrics,
      queue: buildQueue(state.flags, nextGeneration),
      seenIds: [],
      generation: nextGeneration,
      turn: 1,
      failure: null,
      ending: null,
      startTime: Date.now(),
      newCardsThisRun: [],
      achievements: nextAchievements,
      totalTurns: state.totalTurns,
    });
  },

  dismissEnding: () => {
    set({ ending: null });
  },

  resetGame: () => {
    set({
      metrics: initialMetrics,
      flags: [],
      queue: buildQueue([], 1),
      seenIds: [],
      generation: 1,
      turn: 1,
      failure: null,
      ending: null,
      startTime: Date.now(),
      newCardsThisRun: [],
      totalTurns: 0,
    });
  },

  hardReset: () => {
    set({
      metrics: initialMetrics,
      flags: [],
      queue: buildQueue([], 1),
      seenIds: [],
      generation: 1,
      turn: 1,
      failure: null,
      ending: null,
      startTime: Date.now(),
      newCardsThisRun: [],
      collection: [],
      achievements: achievementDefs.map((a) => ({ ...a, unlockedAt: null })),
      totalTurns: 0,
      unreadAchievements: 0,
      unreadCollections: 0,
    });
  },

  clearUnreadAchievements: () => set({ unreadAchievements: 0 }),
  clearUnreadCollections: () => set({ unreadCollections: 0 }),
  clearNewFlags: () => set((state) => ({
    collection: state.collection.map((c) => ({ ...c, isNew: false })),
    achievements: state.achievements.map((a) => ({ ...a, isNew: false })),
  })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
  toggleSfx: () => set((state) => ({ sfxEnabled: !state.sfxEnabled })),
  saveGame: async (slotIndex: number) => {
    const state = get();
    const {
      swipe,
      continueAfterFailure,
      resetGame,
      hardReset,
      clearUnreadAchievements,
      clearUnreadCollections,
      toggleSound,
      dismissEnding,
      saveGame,
      loadGame,
      ...serializableState
    } = state;
    try {
      await AsyncStorage.setItem(
        `save_slot_${slotIndex}`,
        JSON.stringify(serializableState)
      );
    } catch (error) {
      console.error("Save error:", error);
    }
  },
  loadGame: async (slotIndex: number) => {
    try {
      const data = await AsyncStorage.getItem(`save_slot_${slotIndex}`);
      if (data) {
        set({ ...JSON.parse(data), lastLoadedAt: Date.now() });
        return true;
      }
    } catch (error) {
      console.error("Load error:", error);
    }
    return false;
  },
  deleteGame: async (slotIndex: number) => {
    try {
      await AsyncStorage.removeItem(`save_slot_${slotIndex}`);
    } catch (error) {
      console.error("Delete error:", error);
    }
  },
}));

export const selectCurrentCard = (state: GameState) => state.queue[0] ?? null;
export const selectNextCard = (state: GameState) => state.queue[1] ?? null;
export const selectCollection = (state: GameState) => state.collection;
export const selectAchievements = (state: GameState) => state.achievements;
export const selectEnding = (state: GameState) => state.ending;
export const allCards = deck;
