export type MetricKey = "pantry" | "wealth" | "security" | "atmosphere";

export type Metrics = Record<MetricKey, number>;

export type SwipeDirection = "left" | "right";

export type SwipeEffects = Partial<Record<MetricKey, number>>;

export type SwipeOption = {
  text: string;
  effects: SwipeEffects;
  triggerFlag?: string;
};

export type Card = {
  id: string;
  characterName: string;
  dialogue: string;
  portraitKey: string;
  leftSwipe: SwipeOption;
  rightSwipe: SwipeOption;
  prerequisites?: string[];
  isReward?: boolean;
  rewardType?: "achievement" | "collection";
  rewardIcon?: string;
};

export type FailureState = {
  metric: MetricKey;
  threshold: "empty" | "overflow";
  title: string;
  description: string;
  cardId: string;
  decisionText: string;
};

export type CollectionEntry = {
  cardId: string;
  firstEncounteredGeneration: number;
  timesEncountered: number;
  lastDecision: SwipeDirection | null;
  isNew?: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: AchievementCondition;
  unlockedAt: number | null;
  isNew?: boolean;
};

export type AchievementCondition =
  | { type: "turns_survived"; count: number }
  | { type: "generations_reached"; count: number }
  | { type: "cards_encountered"; count: number }
  | { type: "flag_triggered"; flag: string }
  | { type: "metric_danger"; metric: MetricKey }
  | { type: "all_cards_seen" };

export type GameEndingType = "defeat" | "victory";

export type TavernState =
  | "wealthy"
  | "beloved"
  | "fortified"
  | "mystical"
  | "legendary"
  | "ruined"
  | "abandoned"
  | "cursed";

export type GameStats = {
  nightsSurvived: number;
  guestsServed: number;
  secretEventsFound: number;
  criticalChoices: string[];
  playTimeSeconds: number;
  generation: number;
};

export type TitleDef = {
  id: string;
  label: string;
  icon: string;
  condition: (flags: string[], metrics: Metrics) => boolean;
};

export type GameEnding = {
  type: GameEndingType;

  failureMetric?: MetricKey;
  failureThreshold?: "empty" | "overflow";

  headline: string;
  epilogue: string;
  tavernState: TavernState;

  stats: GameStats;

  titles: { icon: string; label: string }[];

  newCardsThisRun: string[];
};
