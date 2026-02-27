import type { Character, RollResult } from "../../domain/types";
import type {
  CharacteristicKey,
  CharacteristicValues,
} from "../../wfrp/characteristics";
import type { Species } from "../../wfrp/species";
import type { Career } from "../../wfrp/careers";
import { SKILLS } from "../../wfrp/skills";
import { TALENTS } from "../../wfrp/talents";
import {
  getCharacteristicValue,
  CHARACTERISTIC_KEYS,
} from "../../wfrp/characteristics";
import {
  calculateWounds,
  calculateResilience,
  calculateResolve,
  getStatusFromCareer,
} from "../../wfrp/character";
import { CHOOSE_CHARACTERISTICS_XP_PENALTY } from "../../domain/constants";

export const rollAllCharacteristics = (): {
  characteristics: CharacteristicValues;
  results: Record<CharacteristicKey, RollResult | null>;
} => {
  const rolled: CharacteristicValues = {} as CharacteristicValues;
  const results: Record<CharacteristicKey, RollResult | null> = {} as Record<
    CharacteristicKey,
    RollResult | null
  >;

  CHARACTERISTIC_KEYS.forEach((key) => {
    const d1 = Math.floor(Math.random() * 10) + 1;
    const d2 = Math.floor(Math.random() * 10) + 1;
    const total = d1 + d2;
    const value = getCharacteristicValue(total);
    rolled[key] = value;
    results[key] = { d1, d2, total, value };
  });

  return { characteristics: rolled, results };
};

export const applySpeciesModifiers = (
  characteristics: CharacteristicValues,
  species: Species,
): CharacteristicValues => {
  const modified = { ...characteristics };
  Object.entries(species.modifiers).forEach(([key, value]) => {
    if (value) {
      modified[key as CharacteristicKey] += value;
    }
  });
  return modified;
};

export const getAvailableXp = (
  species: Species,
  characteristicsMethod: "random" | "choose",
  baseXp: number = 0,
): number => {
  let xp = species.randomizeXp;
  if (characteristicsMethod === "choose") {
    xp -= CHOOSE_CHARACTERISTICS_XP_PENALTY;
  }
  return Math.max(0, xp) + baseXp;
};

export const getCareerSkills = (career: Career) => {
  return career.skills
    .map((id) => SKILLS.find((s) => s.id === id))
    .filter(Boolean);
};

export const getCareerTalents = (career: Career) => {
  return career.talents
    .map((id) => TALENTS.find((t) => t.id === id))
    .filter(Boolean);
};

export interface AssembleCharacterParams {
  baseCharacter: Character;
  name: string;
  species: Species;
  career: Career;
  characteristics: CharacteristicValues;
  characteristicsMethod: "random" | "choose";
}

export const assembleCharacter = (
  params: AssembleCharacterParams,
): Character => {
  const {
    baseCharacter,
    name,
    species,
    career,
    characteristics,
    characteristicsMethod,
  } = params;

  const finalCharacteristics = applySpeciesModifiers(characteristics, species);
  const wounds = calculateWounds(finalCharacteristics);
  const resilience = calculateResilience(finalCharacteristics);
  const resolve = calculateResolve(finalCharacteristics);

  return {
    ...baseCharacter,
    name: name || "Безымянный",
    speciesId: species.id,
    careerId: career.id,
    characteristics: finalCharacteristics,
    skills: getCareerSkills(career).map((s) => ({ id: s!.id, advances: 0 })),
    talents: getCareerTalents(career).map((t) => ({ id: t!.id, advances: 0 })),
    status: getStatusFromCareer(career.status),
    xp: getAvailableXp(species, characteristicsMethod, baseCharacter.xp),
    spentXp: 0,
    wounds,
    currentWounds: wounds,
    resilience,
    resolve,
  };
};
