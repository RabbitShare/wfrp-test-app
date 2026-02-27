"use client";

import { useCharacterStore } from "@/lib/store";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { getSpeciesName, getCareerName } from "@/lib/services/helpers/lookup";

export default function HomePage() {
  const { characters, addCharacter, deleteCharacter, setCurrentCharacter } =
    useCharacterStore();

  const handleNewCharacter = () => {
    addCharacter();
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            WFRP Character Builder
          </h1>
          <Link href="/create" className="w-full sm:w-auto">
            <Button onClick={handleNewCharacter} className="w-full sm:w-auto">
              Создать персонажа
            </Button>
          </Link>
        </header>

        {characters.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-xl mb-4">Нет персонажей</p>
            <Link href="/create">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
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
                className="block"
              >
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-4">
                    <div className="flex-1">
                      <h2 className="text-lg sm:text-xl font-semibold text-primary">
                        {char.name || "Безымянный персонаж"}
                      </h2>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        {getSpeciesName(char.speciesId)} •{" "}
                        {getCareerName(char.careerId)}
                      </p>
                      <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 text-xs sm:text-sm text-muted-foreground">
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
                      className="w-full sm:w-auto"
                    >
                      Удалить
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
