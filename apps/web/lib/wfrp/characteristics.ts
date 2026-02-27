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

export const SPECIES_BASE_ROLLS: Record<
  string,
  Partial<Record<CharacteristicKey, number>>
> = {
  human: {
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
  dwarf: {
    ws: 30,
    bs: 20,
    s: 20,
    t: 30,
    i: 20,
    ag: 10,
    dex: 30,
    int: 20,
    wp: 40,
    fel: 10,
  },
  halfling: {
    ws: 10,
    bs: 30,
    s: 10,
    t: 20,
    i: 20,
    ag: 20,
    dex: 30,
    int: 20,
    wp: 30,
    fel: 30,
  },
  "high-elf": {
    ws: 30,
    bs: 30,
    s: 20,
    t: 20,
    i: 40,
    ag: 30,
    dex: 30,
    int: 30,
    wp: 30,
    fel: 20,
  },
  "wood-elf": {
    ws: 30,
    bs: 30,
    s: 20,
    t: 20,
    i: 30,
    ag: 30,
    dex: 30,
    int: 20,
    wp: 20,
    fel: 20,
  },
};

export const roll2d10 = (): number => {
  return (
    Math.floor(Math.random() * 10) + 1 + Math.floor(Math.random() * 10) + 1
  );
};

export const getCharacteristicValue = (roll2d10: number): number => {
  return ATTRIBUTE_TABLE[roll2d10] || 20;
};

export const rollCharacteristic = (
  speciesId: string,
  key: CharacteristicKey,
): number => {
  const baseRoll = roll2d10();
  const speciesBase = SPECIES_BASE_ROLLS[speciesId]?.[key] || 20;
  return baseRoll + speciesBase;
};

export const rollAllCharacteristics = (
  speciesId: string,
): CharacteristicValues => {
  const result: CharacteristicValues = { ...BASE_CHARACTERISTICS };
  for (const key of CHARACTERISTIC_KEYS) {
    result[key] = rollCharacteristic(speciesId, key);
  }
  return result;
};

export const getCharacteristicRating = (value: number): number => {
  return Math.floor(value / 10);
};

export const MIN_CHARACTERISTIC_VALUE = 4;
export const MAX_CHARACTERISTIC_VALUE = 18;

export const validateCharacteristic = (value: number): number => {
  return Math.max(
    MIN_CHARACTERISTIC_VALUE,
    Math.min(MAX_CHARACTERISTIC_VALUE, value),
  );
};

export const rollCharacteristicWithReroll = (
  speciesId: string,
  key: CharacteristicKey,
  allowReroll: boolean = false,
): number => {
  let value = rollCharacteristic(speciesId, key);

  if (allowReroll && value < MIN_CHARACTERISTIC_VALUE + 5) {
    const rerollValue = rollCharacteristic(speciesId, key);
    value = Math.max(value, rerollValue);
  }

  return value;
};
