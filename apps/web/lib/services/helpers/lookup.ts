import { SPECIES } from "../../wfrp/species";
import { CAREERS } from "../../wfrp/careers";
import { SKILLS } from "../../wfrp/skills";
import { TALENTS } from "../../wfrp/talents";

export const getSpeciesName = (id: string): string => {
  const species = SPECIES.find((s) => s.id === id);
  return species?.nameRu || species?.name || id;
};

export const getCareerName = (id: string): string => {
  const career = CAREERS.find((c) => c.id === id);
  return career?.nameRu || career?.name || id;
};

export const getSkillName = (id: string): string => {
  const skill = SKILLS.find((s) => s.id === id);
  return skill?.nameRu || skill?.name || id;
};

export const getTalentName = (id: string): string => {
  const talent = TALENTS.find((t) => t.id === id);
  return talent?.nameRu || talent?.name || id;
};
