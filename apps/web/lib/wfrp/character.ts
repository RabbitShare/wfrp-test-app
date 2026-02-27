import {
  CharacteristicKey,
  CharacteristicValues,
  BASE_CHARACTERISTICS,
} from "./characteristics";
import { Species } from "./species";
import { Career } from "./careers";

export type CharacterStatus = {
  id: string;
  value: string;
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
  status: CharacterStatus[];
  characteristics: CharacteristicValues;
  skills: CharacterSkill[];
  talents: CharacterTalent[];
  xp: number;
  spentXp: number;
  wounds: number;
  fate: number;
  fortune: number;
  resilience: number;
  resolve: number;
  currentWounds: number;
  createdAt: string;
  updatedAt: string;
}

export const createEmptyCharacter = (): Omit<
  Character,
  "id" | "createdAt" | "updatedAt"
> => ({
  name: "",
  speciesId: "",
  careerId: "",
  status: [],
  characteristics: { ...BASE_CHARACTERISTICS },
  skills: [],
  talents: [],
  xp: 0,
  spentXp: 0,
  wounds: 0,
  fate: 3,
  fortune: 3,
  resilience: 0,
  resolve: 0,
  currentWounds: 0,
});

export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const calculateWounds = (
  characteristics: CharacteristicValues,
): number => {
  const tb = Math.floor((characteristics.t + characteristics.s) / 2);
  const wpb = Math.floor(characteristics.wp / 10);
  return tb + wpb + 8;
};

export const calculateResilience = (
  characteristics: CharacteristicValues,
): number => {
  return Math.floor(characteristics.t / 10) + 1;
};

export const calculateResolve = (
  characteristics: CharacteristicValues,
): number => {
  return Math.floor(characteristics.wp / 10) + 1;
};

export const rollCharacteristic = (): number => {
  const rolls: number[] = [
    Math.floor(Math.random() * 10) + 1,
    Math.floor(Math.random() * 10) + 1,
    Math.floor(Math.random() * 10) + 1,
    Math.floor(Math.random() * 10) + 1,
  ];
  rolls.sort((a, b) => a - b);
  const result = rolls[1]! + rolls[2]! + rolls[3]! + 20;
  return result;
};

export const rollForCharacteristic = (modifier: number = 0): number => {
  const base = rollCharacteristic();
  return base + modifier;
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
