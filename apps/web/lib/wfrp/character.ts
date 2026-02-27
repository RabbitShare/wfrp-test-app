import {
  CharacteristicKey,
  CharacteristicValues,
  getCharacteristicRating,
} from "./characteristics";
import { Species, SPECIES_EXTRA_POINTS, SPECIES_BASE_FATE } from "./species";

export const MAX_SKILL_ADVANCES_PER_SKILL = 10;
export const TOTAL_CAREER_SKILL_POINTS = 40;
export const SKILLS_NEEDED_FOR_CAREER_CHANGE = 5;

export const CHARACTERISTIC_UPGRADE_COSTS: Record<number, number> = {
  0: 25,
  5: 30,
  10: 40,
  15: 50,
  20: 70,
  25: 90,
  30: 120,
  35: 150,
  40: 190,
  45: 230,
} as const;

export const SKILL_UPGRADE_COSTS: Record<number, number> = {
  0: 10,
  5: 15,
  10: 20,
  15: 30,
  20: 40,
  25: 60,
  30: 80,
  35: 110,
  40: 140,
  45: 180,
} as const;

export const getCharacteristicUpgradeCost = (currentSteps: number): number => {
  if (currentSteps < 5) return 25;
  if (currentSteps < 10) return 30;
  if (currentSteps < 15) return 40;
  if (currentSteps < 20) return 50;
  if (currentSteps < 25) return 70;
  if (currentSteps < 30) return 90;
  if (currentSteps < 35) return 120;
  if (currentSteps < 40) return 150;
  if (currentSteps < 45) return 190;
  return 230;
};

export const getSkillUpgradeCost = (currentSteps: number): number => {
  if (currentSteps < 5) return 10;
  if (currentSteps < 10) return 15;
  if (currentSteps < 15) return 20;
  if (currentSteps < 20) return 30;
  if (currentSteps < 25) return 40;
  if (currentSteps < 30) return 60;
  if (currentSteps < 35) return 80;
  if (currentSteps < 40) return 110;
  if (currentSteps < 45) return 140;
  return 180;
};

export const getTalentUpgradeCost = (currentTalentSteps: number): number => {
  return 100 + 100 * currentTalentSteps;
};

export const CAREER_CHANGE_COSTS = {
  COMPLETED: 100,
  INCOMPLETE: 200,
};

export type CharacterStatus = {
  tier: "copper" | "silver" | "gold";
  level: number;
};

export type CharacterSkill = {
  id: string;
  advances: number;
};

export type CharacterTalent = {
  id: string;
  advances: number;
};

export interface Character {
  id: string;
  name: string;
  speciesId: string;
  careerId: string;
  status: CharacterStatus;
  characteristics: CharacteristicValues;
  skills: CharacterSkill[];
  talents: CharacterTalent[];
  xp: number;
  spentXp: number;
  wounds: number;
  fate: number;
  fortune: number;
  extraPoints: number;
  resilience: number;
  resolve: number;
  currentWounds: number;
  motivation: string;
  age: number;
  height: string;
  hairColor: string;
  eyeColor: string;
  createdAt: string;
  updatedAt: string;
}

export const createEmptyCharacter = (
  species?: Species,
): Omit<Character, "id" | "createdAt" | "updatedAt"> => {
  const speciesId = species?.id || "human";
  const baseFate = SPECIES_BASE_FATE[speciesId] ?? 0;
  const extraPoints = SPECIES_EXTRA_POINTS[speciesId] ?? 0;

  return {
    name: "",
    speciesId,
    careerId: "",
    status: { tier: "copper", level: 0 },
    characteristics: {
      ws: 20,
      bs: 20,
      s: 20,
      t: 20,
      i: 20,
      ag: 20,
      dex: 20,
      int: 20,
      wp: 20,
      fel: 20,
    },
    skills: [],
    talents: [],
    xp: species?.randomizeXp || 0,
    spentXp: 0,
    wounds: 0,
    fate: baseFate,
    fortune: baseFate,
    extraPoints,
    resilience: 0,
    resolve: 0,
    currentWounds: 0,
    motivation: "",
    age: 0,
    height: "",
    hairColor: "",
    eyeColor: "",
  };
};

export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const calculateTB = (characteristics: CharacteristicValues): number => {
  return Math.floor((characteristics.s + characteristics.t) / 2);
};

export const calculateWounds = (
  characteristics: CharacteristicValues,
): number => {
  const tb = calculateTB(characteristics);
  const wpb = getCharacteristicRating(characteristics.wp);
  return tb + wpb + 8;
};

export const calculateResilience = (
  characteristics: CharacteristicValues,
): number => {
  const tb = calculateTB(characteristics);
  return tb + 1;
};

export const calculateResolve = (
  characteristics: CharacteristicValues,
): number => {
  const wpr = getCharacteristicRating(characteristics.wp);
  return wpr + 1;
};

export const getTalentMaxRank = (
  talentId: string,
  characteristics: CharacteristicValues,
): number => {
  const TALENT_RATING_LIMITS: Record<string, CharacteristicKey> = {
    "strong-willed": "wp",
    marksman: "bs",
    "warrior-born": "ws",
    "lightning-reflexes": "ag",
    "deft-fingers": "dex",
    savvy: "int",
    attractive: "fel",
    strong: "s",
    hardy: "t",
    "animal-trainer": "wp",
  };

  const relatedCharacteristic = TALENT_RATING_LIMITS[talentId];
  if (!relatedCharacteristic) {
    return 1;
  }

  const rating = getCharacteristicRating(
    characteristics[relatedCharacteristic],
  );
  return Math.max(1, rating);
};

export const canAddTalent = (
  talentId: string,
  currentRank: number,
  characteristics: CharacteristicValues,
): boolean => {
  const maxRank = getTalentMaxRank(talentId, characteristics);
  return currentRank < maxRank;
};

export const getTotalAdvances = (skills: CharacterSkill[]): number => {
  return skills.reduce((total, skill) => total + skill.advances, 0);
};

export const getSkillValue = (
  characteristic: CharacteristicKey,
  advances: number,
): number => {
  return advances * 5;
};

export const calculateInitialWealth = (status: CharacterStatus): number => {
  const { tier, level } = status;

  if (tier === "copper") {
    const pennies = (Math.floor(Math.random() * 10) + 1) * 2 + level * 2;
    return pennies;
  } else if (tier === "silver") {
    const shillings = Math.floor(Math.random() * 10) + 1;
    return shillings * 10 + level * 10;
  } else {
    const crowns = 1 + level;
    return crowns * 100;
  }
};

export const getStatusFromCareer = (careerStatus: string): CharacterStatus => {
  if (!careerStatus || careerStatus === "None") {
    return { tier: "copper", level: 0 };
  }

  const parts = careerStatus.split(" ");
  if (parts.length !== 2) {
    return { tier: "copper", level: 0 };
  }

  const tierPart = parts[0];
  if (!tierPart) {
    return { tier: "copper", level: 0 };
  }

  const tier = tierPart.toLowerCase() as "copper" | "silver" | "gold";
  const levelPart = parts[1];
  const level = levelPart ? parseInt(levelPart, 10) : 0;

  return { tier, level };
};

export const rollRandomAge = (speciesId: string): number => {
  switch (speciesId) {
    case "human":
      return 15 + Math.floor(Math.random() * 10) + 1;
    case "dwarf":
      return 15 + Math.floor(Math.random() * 100) + 10;
    case "halfling":
      return 15 + Math.floor(Math.random() * 50) + 5;
    case "high-elf":
      return 30 + Math.floor(Math.random() * 100) + 10;
    case "wood-elf":
      return 30 + Math.floor(Math.random() * 100) + 10;
    default:
      return 25;
  }
};

export const rollRandomHeight = (speciesId: string): string => {
  const rollInches = (
    baseFeet: number,
    baseInches: number,
    additionalInches: number,
  ) => {
    const inches =
      baseInches + Math.floor(Math.random() * additionalInches) + 1;
    return `${baseFeet}'${inches}"`;
  };

  switch (speciesId) {
    case "human":
      return rollInches(4, 9, 20);
    case "dwarf":
      return rollInches(4, 3, 10);
    case "halfling":
      return rollInches(3, 1, 10);
    case "high-elf":
      return rollInches(5, 11, 10);
    case "wood-elf":
      return rollInches(5, 11, 10);
    default:
      return "5'9\"";
  }
};

export const rollRandomHairColor = (speciesId: string): string => {
  const roll = Math.floor(Math.random() * 20) + 1;

  const colorsBySpecies: Record<string, Record<number, string>> = {
    human: {
      2: "Белый блонд",
      3: "Золотистый блонд",
      4: "Рыжий блонд",
      5: "Золотисто-русый",
      6: "Золотисто-русый",
      7: "Золотисто-русый",
      8: "Светло-русый",
      9: "Светло-русый",
      10: "Светло-русый",
      11: "Светло-русый",
      12: "Тёмно-русый",
      13: "Тёмно-русый",
      14: "Тёмно-русый",
      15: "Чёрный",
      16: "Чёрный",
      17: "Чёрный",
      18: "Медно-рыжий",
      19: "Рыжий",
      20: "Серый",
    },
    dwarf: {
      2: "Белый",
      3: "Серый",
      4: "Жемчужный блонд",
      5: "Золотистый",
      6: "Золотистый",
      7: "Золотистый",
      8: "Медный",
      9: "Медный",
      10: "Медный",
      11: "Бронзовый",
      12: "Бронзовый",
      13: "Тёмно-русый",
      14: "Тёмно-русый",
      15: "Русый",
      16: "Русый",
      17: "Рыжий",
      18: "Рыжевато-русый",
      19: "Чёрный",
      20: "Чёрный",
    },
    halfling: {
      2: "Серый",
      3: "Соломенный",
      4: "Кирпичный",
      5: "Медовый",
      6: "Медовый",
      7: "Медовый",
      8: "Каштановый",
      9: "Каштановый",
      10: "Каштановый",
      11: "Имбирный",
      12: "Имбирный",
      13: "Горчичный",
      14: "Миндальный",
      15: "Шоколадный",
      16: "Лакричный",
      17: "Чёрный",
      18: "Медный",
      19: "Тёмно-карий",
      20: "Карий",
    },
    "high-elf": {
      2: "Серебристый",
      3: "Белый",
      4: "Жемчужный блонд",
      5: "Блонд",
      6: "Блонд",
      7: "Блонд",
      8: "Золотистый блонд",
      9: "Золотистый блонд",
      10: "Медный блонд",
      11: "Медный",
      12: "Медный",
      13: "Рыжий блонд",
      14: "Рыжий",
      15: "Чёрный",
      16: "Серебристо-белый",
      17: "Пепельный блонд",
      18: "Медно-рыжий",
      19: "Рыжий",
      20: "Чёрный",
    },
    "wood-elf": {
      2: "Серебристо-белый",
      3: "Пепельный блонд",
      4: "Медовый блонд",
      5: "Медовый",
      6: "Медовый",
      7: "Русый",
      8: "Русый",
      9: "Русый",
      10: "Тёмно-русый",
      11: "Тёмно-русый",
      12: "Красное дерево",
      13: "Сиена",
      14: "Эбеновый",
      15: "Иссиня-чёрный",
      16: "Тёмно-карий",
      17: "Ореховый",
      18: "Мшисто-зелёный",
      19: "Оливковый",
      20: "Бурый",
    },
  };

  return colorsBySpecies[speciesId]?.[roll] ?? "Карий";
};

export const rollRandomEyeColor = (speciesId: string): string => {
  const roll = Math.floor(Math.random() * 20) + 1;

  const colorsBySpecies: Record<string, Record<number, string>> = {
    human: {
      2: "Светло-серый",
      3: "Зелёный",
      4: "Водянисто-голубой",
      5: "Голубой",
      6: "Голубой",
      7: "Голубой",
      8: "Светло-серый",
      9: "Светло-серый",
      10: "Светло-серый",
      11: "Серый",
      12: "Серый",
      13: "Карий",
      14: "Карий",
      15: "Карий",
      16: "Ореховый",
      17: "Тёмно-карий",
      18: "Ореховый",
      19: "Тёмно-карий",
      20: "Чёрный",
    },
    dwarf: {
      2: "Антрацитовый",
      3: "Свинцово-серый",
      4: "Серо-стальной",
      5: "Голубой",
      6: "Голубой",
      7: "Голубой",
      8: "Землисто-карий",
      9: "Ореховый",
      10: "Ореховый",
      11: "Тёмно-карий",
      12: "Зелёный",
      13: "Медный",
      14: "Медный",
      15: "Золотой",
      16: "Золотой",
      17: "Карий",
      18: "Ореховый",
      19: "Медный",
      20: "Зелёный",
    },
    halfling: {
      2: "Светло-серый",
      3: "Серый",
      4: "Бледно-голубой",
      5: "Голубой",
      6: "Голубой",
      7: "Голубой",
      8: "Зелёный",
      9: "Зелёный",
      10: "Зелёный",
      11: "Ореховый",
      12: "Ореховый",
      13: "Карий",
      14: "Карий",
      15: "Медный",
      16: "Медный",
      17: "Тёмно-карий",
      18: "Медный",
      19: "Тёмно-карий",
      20: "Карий",
    },
    "high-elf": {
      2: "Гагатовый",
      3: "Аметистовый",
      4: "Аквамариновый",
      5: "Сапфировый",
      6: "Сапфировый",
      7: "Бирюзовый",
      8: "Изумрудный",
      9: "Изумрудный",
      10: "Янтарный",
      11: "Золотой",
      12: "Золотой",
      13: "Медный",
      14: "Медный",
      15: "Фиалковый",
      16: "Серебристый",
      17: "Лунный",
      18: "Морской волны",
      19: "Топазовый",
      20: "Золотой",
    },
    "wood-elf": {
      2: "Бежевый",
      3: "Угольно-чёрный",
      4: "Оливковый",
      5: "Мшисто-зелёный",
      6: "Мшисто-зелёный",
      7: "Ореховый",
      8: "Ореховый",
      9: "Тёмно-карий",
      10: "Песочный",
      11: "Лесной",
      12: "Лесной",
      13: "Янтарный",
      14: "Медный",
      15: "Фиалковый",
      16: "Изумрудный",
      17: "Сапфировый",
      18: "Ореховый",
      19: "Болотный",
      20: "Янтарный",
    },
  };

  return colorsBySpecies[speciesId]?.[roll] || "Карий";
};
