import type {
  GameEnding,
  GameStats,
  MetricKey,
  Metrics,
  TavernState,
  TitleDef,
} from "../types/game";

export const titleDefs: TitleDef[] = [
  {
    id: "han_beyi",
    label: "Han Beyi",
    icon: "🏆",
    condition: (_f, _m) => true,
  },
  {
    id: "tuccar_dostu",
    label: "Tüccarların Dostu",
    icon: "🤝",
    condition: (flags) =>
      flags.includes("baharat_anlasmasi") && flags.includes("lonca_anlasmasi"),
  },
  {
    id: "kuzeyin_siginagi",
    label: "Kuzeyin Son Sığınağı",
    icon: "🛡️",
    condition: (flags) =>
      flags.includes("kervan_kurtuldu") && flags.includes("prenses_saklandi"),
  },
  {
    id: "simya_ustasi",
    label: "Simya Ustası",
    icon: "⚗️",
    condition: (flags) =>
      flags.includes("simyaci_kabul_edildi") && flags.includes("iksir_gecesi"),
  },
  {
    id: "ormanin_koruyucusu",
    label: "Ormanın Koruyucusu",
    icon: "🌳",
    condition: (flags) =>
      flags.includes("mese_ritueli") && flags.includes("orman_barisi"),
  },
  {
    id: "halk_kahramani",
    label: "Halk Kahramanı",
    icon: "❤️",
    condition: (_flags, metrics) => metrics.atmosphere >= 70,
  },
  {
    id: "altin_kasa",
    label: "Altın Kasa",
    icon: "💰",
    condition: (_flags, metrics) => metrics.wealth >= 70,
  },
  {
    id: "demir_yumruk",
    label: "Demir Yumruk",
    icon: "⚔️",
    condition: (_flags, metrics) => metrics.security >= 70,
  },
  {
    id: "efsane_asci",
    label: "Efsane Aşçı",
    icon: "👨‍🍳",
    condition: (flags) => flags.includes("asci_ustaligi"),
  },
  {
    id: "sarkilarin_efendisi",
    label: "Şarkıların Efendisi",
    icon: "🎵",
    condition: (flags) =>
      flags.includes("ozan_sahne_aldi") && flags.includes("ozan_efsanesi"),
  },
  {
    id: "golgelerin_dostu",
    label: "Gölgelerin Dostu",
    icon: "🌙",
    condition: (flags) =>
      flags.includes("bodrum_acildi") && flags.includes("mese_ritueli"),
  },
  {
    id: "krallik_hamisi",
    label: "Krallığın Hamisi",
    icon: "👑",
    condition: (flags) =>
      flags.includes("prenses_saklandi") &&
      flags.includes("sovalye_yeminli") &&
      flags.includes("prenses_ask"),
  },
  {
    id: "denizlerin_hancisi",
    label: "Denizlerin Hancısı",
    icon: "⚓",
    condition: (flags) =>
      flags.includes("baharat_anlasmasi") && flags.includes("kervan_ticaret"),
  },
];

export function determineTavernState(
  flags: string[],
  metrics: Metrics,
  isVictory: boolean,
): TavernState {
  if (!isVictory) {
    if (flags.includes("mese_laneti_aktif")) return "cursed";
    if (metrics.atmosphere <= 0 || metrics.pantry <= 0) return "abandoned";
    return "ruined";
  }

  const hasMystical =
    flags.includes("mese_ritueli") || flags.includes("simyaci_kabul_edildi");
  const hasMilitary =
    flags.includes("muhafiz_masasi") && metrics.security >= 65;
  const isWealthy = metrics.wealth >= 65;
  const isBeloved = metrics.atmosphere >= 65;

  const chainCount = [
    flags.includes("iksir_gecesi"),
    flags.includes("prenses_saklandi") || flags.includes("prenses_teslim"),
    flags.includes("ozan_sahne_aldi"),
    flags.includes("mese_ritueli"),
    flags.includes("lonca_anlasmasi"),
    flags.includes("kervan_kurtuldu"),
  ].filter(Boolean).length;

  if (chainCount >= 4 && isBeloved) return "legendary";
  if (hasMystical && flags.includes("bodrum_acildi")) return "mystical";
  if (hasMilitary) return "fortified";
  if (isWealthy && !isBeloved) return "wealthy";
  if (isBeloved && !isWealthy) return "beloved";
  if (isWealthy && isBeloved) return "legendary";

  return "beloved";
}

type DefeatText = { headline: string; epilogue: string };

const defeatTexts: Record<
  MetricKey,
  Record<"empty" | "overflow", DefeatText>
> = {
  pantry: {
    empty: {
      headline: "Kadim Meşe Hanı bu kışı göremedi.",
      epilogue:
        'Son buğday çuvalı da boşaldığında, mutfağın ocağında artık sadece kül vardı. Bir zamanlar yolcuların "buranın çorbası efsane" dediği han, şimdi farelerin bile uğramadığı bir harabe. Rüzgâr, boş salondan geçerken eski bir şarkının yankısını taşıyor.',
    },
    overflow: {
      headline: "Kiler çürüdü, han zehirlendi.",
      epilogue:
        'Taşan erzak fıçıları küflendi, sular bulandı, fareler cirit attı. Bir sabah ilk müşteri kapıyı açtığında burnuna gelen kokuyla geri döndü. Ardından ikincisi, üçüncüsü... Bir hafta içinde "Kadim Meşe" adı "Küflü Meşe" olarak anılmaya başladı.',
    },
  },
  wealth: {
    empty: {
      headline: "Kasadaki son bakır da tükendi.",
      epilogue:
        'Borçlar kapıdan içeri girdi, müşteriler kapıdan dışarı çıktı. Tabelayı sökmek için gelen alacaklılar, hancının arkasında bıraktığı tek şeyi buldular: masanın üstünde yarım kalmış bir hesap defteri ve "bir gün döneceğim" yazan bir not.',
    },
    overflow: {
      headline: "Altının laneti Kadim Meşe'yi yuttu.",
      epilogue:
        "Servetin kokusu önce haydutları çekti, sonra vergi memurlarını, en sonunda da kıskançlığı. Bir gece, üç farklı çete aynı anda kapıyı kırdı. Sabah olduğunda kasada tek bir altın bile kalmamıştı — ama duvarlarda kılıç izleri sonsuza dek kaldı.",
    },
  },
  security: {
    empty: {
      headline: "Düzen çöktü, kapılar kırıldı.",
      epilogue:
        'Kavgalar tezgâhı parçaladı, korku sokağa taştı. Son kavgada devrillen mum, perdeleri tutuşturdu. Alevler hanın çatısını yalarken, hancı yanan tabelaya baktı: "Kadim Meşe Hanı" yazısının son harfi de karardığında, bir dönem kapandı.',
    },
    overflow: {
      headline: "Demir yumruk hanın ruhunu ezdi.",
      epilogue:
        "Fazla sıkı düzen, hanın sıcaklığını öldürdü. Muhafızlar her masada, her köşede nöbet tutuyordu. Bir gece, son müşteri de bardağını bırakıp çıktı. Hancı, bomboş salonda tek başına otururken anladı: güvenliğin bedeli yalnızlıktı.",
    },
  },
  atmosphere: {
    empty: {
      headline: "Yolcular başka hanlara gitmeye başladı.",
      epilogue:
        'Şarkılar sustu, mumlar kısıldı, kahkahalar yerini sessizliğe bıraktı. "Kadim Meşe" adı yollardan silindi, haritalardan çıkarıldı. Bir yolcu yıllar sonra orayı bulduğunda, kapıda asılı bir tabela gördü: "Kapalı". Altında, örümcekler yeni bir ev kurmuştu.',
    },
    overflow: {
      headline: "Şöhret zehirledi, kalabalık hanı yuttu.",
      epilogue:
        "Efsanenin gürültüsü hanın taşıyabileceğinden büyüktü. Her gece tıklım tıklım, her sabah kırık bardaklar ve yıkılmış masalar. Duvarlar çatladı, zemin çöktü, Kadim Meşe kendi şöhretinin altında ezildi. Ironik olan şu ki, herkes hanı biliyordu — ama kimse artık gitmek istemiyordu.",
    },
  },
};

type VictoryText = { headline: string; epilogue: string };

const victoryTexts: Record<TavernState, VictoryText> = {
  legendary: {
    headline: "Kadim Meşe Hanı artık bir efsane.",
    epilogue:
      "Yıllar geçti. Kadim Meşe Hanı artık yalnızca bir konaklama yeri değil, tüccarların ve gezginlerin dilindeki bir efsaneydi. Krallar burada anlaşma imzaladı, ozanlar burada şarkılarını yazdı, simyacılar burada iksirlerini keşfetti. Meşe ağacının kökleri hanın temellerine sarıldı ve onu sonsuza dek korudu. Hancının adı, taşa kazındı.",
  },
  wealthy: {
    headline: "Altın çağ Kadim Meşe'de yaşandı.",
    epilogue:
      "Kasalar doldu, tüccarlar akın etti, hanın adı uzak diyarlara kadar ulaştı. Kadim Meşe, bölgenin en zengin konaklama yeri oldu. Altın süslemeli kapıları, kristal kadehleri ve ipek perdeleriyle herkesi büyüledi. Ama bazı geceler, hancı boş salonda otururken merak ediyordu: bu kadar altının arasında gerçek bir dost var mıydı?",
  },
  beloved: {
    headline: "Herkesin evi, herkesin sığınağı.",
    epilogue:
      'Kadim Meşe Hanı hiçbir zaman en zengin han olmadı. Ama kapısından giren herkes, evine döndüğünü hissetti. Fakir gezginlere sıcak çorba, yorgun askerlere yumuşak yatak, kaçak prenseslere gizli oda... Hancının en büyük serveti, insanların gülümsemesiydi. Yıllar sonra, oğlu babasının defterini açtığında ilk sayfada şunu buldu: "Bir hanın değeri kasasında değil, kalplerdedir."',
  },
  fortified: {
    headline: "Kuzeyin kalesi ayakta.",
    epilogue:
      "Kadim Meşe Hanı bir konaklama yerinden çok, bir kaleye benziyordu artık. Surları yükseldi, nöbetçileri çoğaldı, kapısından geçen her yolcu güvende olduğunu biliyordu. Haydutlar başka yollara sapıyordu, çeteler uzak duruyordu. Hancı, barışın bedelinin daimi teyakkuz olduğunu öğrenmişti — ve bu bedeli seve seve ödedi.",
  },
  mystical: {
    headline: "Meşe'nin sırları hancıyla yaşadı.",
    epilogue:
      "Bodrumdan yükselen yeşil ışık artık herkesçe biliniyordu. Kadim Meşe Hanı, simyacıların, büyücülerin ve eski bilgelerin buluşma noktası oldu. Meşe ağacının ruhu hancıyla konuşuyor, kökler kileri dolduruyordu. Bazı geceler, hanın duvarları hafifçe titriyordu — sanki meşe ağacı nefes alıyormuş gibi.",
  },
  ruined: {
    headline: "Yıkıntılardan yeni bir umut.",
    epilogue:
      'Kadim Meşe Hanı ayakta kaldı — ama zorlukla. Duvarlarında çatlaklar, çatısında delikler, ama kapısında hâlâ bir tabela: "Açık". Hancı biliyordu ki mükemmel olmak zorunda değildi. Yeter ki kapıyı açık tutsun, yeter ki ocağı söndürmesin. Bazen en güzel hikâyeler, en yıpranmış sayfalarda yazılırdı.',
  },
  abandoned: {
    headline: "Sessizlik Kadim Meşe'yi sardı.",
    epilogue:
      'Bir sabah hancı kapıyı açtığında, karşısında bomboş bir yol gördü. Ne tüccar, ne gezgin, ne ozan... Kadim Meşe Hanı unutulmuştu. Ama hancı kapıyı kapatmadı. Her gün ocağı yaktı, çorbayı pişirdi, masaları sildi. "Bir gün biri gelir" diye fısıldadı. Ve bir gün, gerçekten biri geldi.',
  },
  cursed: {
    headline: "Meşe'nin laneti hâlâ devam ediyor.",
    epilogue:
      'Bodrumdan yükselen karanlık artık hanın her köşesine sızmıştı. Duvarlardan siyah kökler fışkırıyor, geceleri fısıltılar duyuluyordu. Hancı, eski meşe ruhunu reddetmenin bedelini ağır ödedi. Yolcular hanı "Lanetli Meşe" diye anmaya başladı. Ama garip bir şekilde, bazı cesur ruhlar hâlâ kapıyı çalıyordu — karanlıkta bile ışık arayanlar vardı.',
  },
};

const secretEventFlags = [
  "simyaci_kabul_edildi",
  "iksir_gecesi",
  "simyaci_patlama_oldu",
  "simyaci_sifa_yapildi",
  "prenses_saklandi",
  "sovalye_yeminli",
  "prenses_ask",
  "prenses_taht_istiyor",
  "yasak_av_alindi",
  "orman_muhafiz_geldi",
  "kurt_saldirisi",
  "orman_barisi",
  "ozan_sahne_aldi",
  "ozan_efsanesi",
  "baharat_anlasmasi",
  "liman_korsanlari_geldi",
  "muhafiz_masasi",
  "muhafiz_baskini_yapildi",
  "muhafiz_terfisi",
  "bodrum_acildi",
  "mese_ritueli",
  "mese_laneti_aktif",
  "mese_kehaneti",
  "asci_alindi",
  "asci_yarisi",
  "asci_zehirlenme",
  "asci_ustaligi",
  "zar_gecesi",
  "cete_intikam",
  "yeralti_pazari",
  "cete_savasi",
  "kervan_kurtuldu",
  "kervan_minneti",
  "kervan_haydutlari",
  "kervan_ticaret",
  "lonca_anlasmasi",
  "lonca_baskisi",
  "lonca_dusmani_geldi",
];

export function calculateTitles(flags: string[], metrics: Metrics): string[] {
  return titleDefs
    .filter((t) => t.condition(flags, metrics))
    .map((t) => `${t.icon} ${t.label}`);
}

export function calculateEnding(
  type: "defeat" | "victory",
  flags: string[],
  metrics: Metrics,
  stats: GameStats,
  newCardsThisRun: string[],
  failureMetric?: MetricKey,
  failureThreshold?: "empty" | "overflow",
): GameEnding {
  const isVictory = type === "victory";
  const tavernState = determineTavernState(flags, metrics, isVictory);

  let headline: string;
  let epilogue: string;

  if (isVictory) {
    const vt = victoryTexts[tavernState];
    headline = vt.headline;
    epilogue = vt.epilogue;
  } else {
    const metric = failureMetric ?? "pantry";
    const threshold = failureThreshold ?? "empty";
    const dt = defeatTexts[metric][threshold];
    headline = dt.headline;
    epilogue = dt.epilogue;
  }

  const titles = isVictory ? calculateTitles(flags, metrics) : [];

  const secretEventsFound = flags.filter((f) =>
    secretEventFlags.includes(f),
  ).length;

  return {
    type,
    failureMetric,
    failureThreshold,
    headline,
    epilogue,
    tavernState,
    stats: { ...stats, secretEventsFound },
    titles,
    newCardsThisRun,
  };
}

export const tavernStateLabels: Record<TavernState, string> = {
  wealthy: "Altın Çağ Hanı",
  beloved: "Halkın Sevgili Hanı",
  fortified: "Kuzeyin Kalesi",
  mystical: "Gizemli Meşe Hanı",
  legendary: "Efsanevi Kadim Meşe",
  ruined: "Yıkıntılar Arasında",
  abandoned: "Terk Edilmiş Han",
  cursed: "Lanetli Meşe",
};

export const tavernStateColors: Record<
  TavernState,
  { primary: string; secondary: string; glow: string }
> = {
  wealthy: {
    primary: "#e8c44a",
    secondary: "#9a7a2e",
    glow: "rgba(232, 196, 74, 0.2)",
  },
  beloved: {
    primary: "#e88a6a",
    secondary: "#9a4a3e",
    glow: "rgba(232, 138, 106, 0.2)",
  },
  fortified: {
    primary: "#8aaccc",
    secondary: "#4a6a8a",
    glow: "rgba(138, 172, 204, 0.2)",
  },
  mystical: {
    primary: "#b07ae8",
    secondary: "#6a3a9a",
    glow: "rgba(176, 122, 232, 0.2)",
  },
  legendary: {
    primary: "#f0d080",
    secondary: "#c8aa6e",
    glow: "rgba(240, 208, 128, 0.3)",
  },
  ruined: {
    primary: "#8a6a4a",
    secondary: "#5a4a3a",
    glow: "rgba(138, 106, 74, 0.15)",
  },
  abandoned: {
    primary: "#6a7a8a",
    secondary: "#3a4a5a",
    glow: "rgba(106, 122, 138, 0.15)",
  },
  cursed: {
    primary: "#9a3a5a",
    secondary: "#5a1a3a",
    glow: "rgba(154, 58, 90, 0.2)",
  },
};
