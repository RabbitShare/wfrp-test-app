export type CharacteristicKey =
  | "ws"
  | "bs"
  | "s"
  | "t"
  | "i"
  | "ag"
  | "dex"
  | "int"
  | "wp"
  | "fel";

export type Characteristic = {
  key: CharacteristicKey;
  name: string;
  nameRu: string;
  shortName: string;
};

export const CHARACTERISTICS: Characteristic[] = [
  {
    key: "ws",
    name: "Weapon Skill",
    nameRu: "Боевое мастерство",
    shortName: "БМ",
  },
  { key: "bs", name: "Ballistic Skill", nameRu: "Меткость", shortName: "МТ" },
  { key: "s", name: "Strength", nameRu: "Сила", shortName: "СЛ" },
  { key: "t", name: "Toughness", nameRu: "Выносливость", shortName: "ВН" },
  { key: "i", name: "Initiative", nameRu: "Инициатива", shortName: "ИИ" },
  { key: "ag", name: "Agility", nameRu: "Ловкость", shortName: "ЛВ" },
  { key: "dex", name: "Dexterity", nameRu: "Внимательность", shortName: "ВНМ" },
  { key: "int", name: "Intelligence", nameRu: "Интеллект", shortName: "ИНТ" },
  { key: "wp", name: "Willpower", nameRu: "Сила воли", shortName: "СВ" },
  { key: "fel", name: "Fellowship", nameRu: "Красноречие", shortName: "КР" },
];

export const CHARACTERISTIC_KEYS: CharacteristicKey[] = [
  "ws",
  "bs",
  "s",
  "t",
  "i",
  "ag",
  "dex",
  "int",
  "wp",
  "fel",
];

export type CharacteristicValues = Record<CharacteristicKey, number>;

export const BASE_CHARACTERISTICS: CharacteristicValues = {
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
};

export const ATTRIBUTE_TABLE: Record<number, number> = {
  2: 9,
  3: 10,
  4: 11,
  5: 12,
  6: 13,
  7: 14,
  8: 15,
  9: 16,
  10: 17,
  11: 18,
  12: 19,
  13: 20,
  14: 21,
  15: 22,
  16: 23,
  17: 24,
  18: 25,
  19: 30,
  20: 35,
  21: 40,
  22: 45,
  23: 50,
  24: 55,
  25: 60,
  26: 65,
  27: 70,
  28: 75,
  29: 80,
  30: 85,
  31: 90,
  32: 95,
  33: 100,
  34: 105,
  35: 110,
  36: 115,
  37: 120,
  38: 125,
  39: 130,
  40: 135,
};

export const roll2d10 = (): number => {
  return (
    Math.floor(Math.random() * 10) + 1 + Math.floor(Math.random() * 10) + 1
  );
};

export const getCharacteristicValue = (roll2d10: number): number => {
  return ATTRIBUTE_TABLE[roll2d10] || 20;
};
