import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Character,
  createEmptyCharacter,
  generateId,
  calculateWounds,
  calculateResilience,
  calculateResolve,
} from "../lib/wfrp/character";

interface CharacterStore {
  characters: Character[];
  currentCharacterId: string | null;
  addCharacter: () => Character;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  setCurrentCharacter: (id: string | null) => void;
  getCurrentCharacter: () => Character | null;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      characters: [],
      currentCharacterId: null,

      addCharacter: () => {
        const newCharacter: Character = {
          ...createEmptyCharacter(),
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          characters: [...state.characters, newCharacter],
          currentCharacterId: newCharacter.id,
        }));
        return newCharacter;
      },

      updateCharacter: (id, updates) => {
        set((state) => ({
          characters: state.characters.map((char) =>
            char.id === id
              ? {
                  ...char,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : char,
          ),
        }));
      },

      deleteCharacter: (id) => {
        set((state) => ({
          characters: state.characters.filter((char) => char.id !== id),
          currentCharacterId:
            state.currentCharacterId === id ? null : state.currentCharacterId,
        }));
      },

      setCurrentCharacter: (id) => {
        set({ currentCharacterId: id });
      },

      getCurrentCharacter: () => {
        const state = get();
        return (
          state.characters.find(
            (char) => char.id === state.currentCharacterId,
          ) || null
        );
      },
    }),
    {
      name: "wfrp-characters",
    },
  ),
);

export const finalizeCharacter = (character: Character): Character => {
  const updated = {
    ...character,
    wounds: calculateWounds(character.characteristics),
    resilience: calculateResilience(character.characteristics),
    resolve: calculateResolve(character.characteristics),
    currentWounds: calculateWounds(character.characteristics),
  };
  return updated;
};
