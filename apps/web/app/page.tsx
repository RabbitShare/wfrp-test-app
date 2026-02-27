"use client";

import { useCharacterStore } from "@/lib/store";
import { SPECIES } from "@/lib/wfrp/species";
import { CAREERS } from "@/lib/wfrp/careers";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

export default function HomePage() {
  const { characters, addCharacter, deleteCharacter, setCurrentCharacter } =
    useCharacterStore();

  const handleNewCharacter = () => {
    addCharacter();
  };

  const getSpeciesName = (id: string) => {
    const species = SPECIES.find((s) => s.id === id);
    return species?.nameRu || species?.name || id;
  };

  const getCareerName = (id: string) => {
    const career = CAREERS.find((c) => c.id === id);
    return career?.nameRu || career?.name || id;
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-500">
            WFRP Character Builder
          </h1>
          <Link href="/create" className="w-full sm:w-auto">
            <Button
              onClick={handleNewCharacter}
              className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
            >
              Создать персонажа
            </Button>
          </Link>
        </header>

        {characters.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <p className="text-xl mb-4">Нет персонажей</p>
            <Link href="/create">
              <Button
                onClick={handleNewCharacter}
                variant="outline"
                className="border-amber-500 text-amber-500 hover:bg-amber-900/20"
              >
                Создать первого персонажа
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {characters.map((char) => (
              <Link
                key={char.id}
                href={`/character/${char.id}`}
                onClick={() => setCurrentCharacter(char.id)}
                className="block bg-stone-800 rounded-lg p-4 border border-stone-700 hover:border-amber-600/50 transition-colors cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl font-semibold text-amber-400">
                      {char.name || "Безымянный персонаж"}
                    </h2>
                    <p className="text-stone-400 text-sm sm:text-base">
                      {getSpeciesName(char.speciesId)} •{" "}
                      {getCareerName(char.careerId)}
                    </p>
                    <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 text-xs sm:text-sm text-stone-500">
                      <span>XP: {char.xp}</span>
                      <span>
                        HP: {char.currentWounds}/{char.wounds}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteCharacter(char.id);
                    }}
                    className="bg-red-900/50 hover:bg-red-900 text-sm w-full sm:w-auto"
                  >
                    Удалить
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
