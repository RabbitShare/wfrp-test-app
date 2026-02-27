# WFRP Character Creation Rules (from PDF)

## Overview

This document contains all character creation rules from the Warhammer Fantasy Roleplay 4th edition core rulebook (Russian translation). All code in `/apps/web/lib/wfrp/` must follow these rules.

---

## 1. SPECIES (Народы)

Only 5 species are available (no Gnome, no Ogre):

| ID       | Name     | NameRu      | Base Fate | Extra Points | Movement |
| -------- | -------- | ----------- | --------- | ------------ | -------- |
| human    | Human    | Человек     | 2         | 3            | 4/8/16   |
| dwarf    | Dwarf    | Гном        | 0         | 2            | 3/6/12   |
| halfling | Halfling | Полурослик  | 0         | 3            | 3/6/12   |
| high-elf | High Elf | Высший эльф | 0         | 2            | 5/10/20  |
| wood-elf | Wood Elf | Лесной эльф | 0         | 2            | 5/10/20  |

### Species Base Rolls (2d10 + base)

```
Human:     WS:20, BS:20, S:20, T:20, I:20, Ag:20, Dex:20, Int:20, WP:20, Fel:20
Dwarf:     WS:30, BS:20, S:20, T:30, I:20, Ag:10, Dex:30, Int:20, WP:40, Fel:10
Halfling:  WS:10, BS:30, S:10, T:20, I:20, Ag:20, Dex:30, Int:20, WP:30, Fel:30
High Elf:  WS:30, BS:30, S:20, T:20, I:40, Ag:30, Dex:30, Int:30, WP:30, Fel:20
Wood Elf:  WS:30, BS:30, S:20, T:20, I:30, Ag:30, Dex:30, Int:20, WP:20, Fel:20
```

### Random Species Table

Roll 1d100:

- 01-90: Human
- 91-94: Halfling
- 95-98: Dwarf
- 99: High Elf
- 00: Wood Elf

**XP Reward:** +20 XP for accepting random species

---

## 2. CHARACTERISTICS

### Rolling Method

**Formula:** 2d10 + species base modifier

Example: Human WS = 2d10 + 20

### Attribute Table (2d10 → Value)

| Roll | Value | Roll | Value | Roll | Value        |
| ---- | ----- | ---- | ----- | ---- | ------------ |
| 2    | 9     | 12   | 19    | 22   | 45           |
| 3    | 10    | 13   | 20    | 23   | 50           |
| 4    | 11    | 14   | 21    | 24   | 55           |
| 5    | 12    | 15   | 22    | 25   | 60           |
| 6    | 13    | 16   | 23    | 26   | 65           |
| 7    | 14    | 17   | 24    | 27   | 70           |
| 8    | 15    | 18   | 25    | 28   | 75           |
| 9    | 16    | 19   | 30    | 29   | 80           |
| 10   | 17    | 20   | 35    | 30   | 85           |
| 11   | 18    | 21   | 40    | 31+  | +5 per point |

### Characteristic Rating

**Formula:** floor(value / 10)

Example: WS 39 → Rating 3

### Limits

- **Minimum:** 4 (before species modifier)
- **Maximum:** 18 (before species modifier)

---

## 3. CALCULATED VALUES

### Wounds (Здоровье)

```
Wounds = TB + (WP / 10) + 8
where TB = floor((S + T) / 2)
```

### Resilience (Стойкость)

```
Resilience = floor(T / 10) + 1
```

### Resolve (Решимость)

```
Resolve = floor(WP / 10) + 1
```

### Fortune (Удача)

```
Initial Fortune = Fate
```

---

## 4. SKILLS BY SPECIES

### Human

Skills: Common Knowledge (Reikland), Leadership, Animal Care, Charm, Evaluate, Brawling, Trade, Shooting (bows), Cool, Language (Breton), Language (Wester)

### Dwarf

Skills: Entertain (Storytelling), Intimidate, Common Knowledge (Geology), Common Knowledge (Dwarfs), Common Knowledge (Metallurgy), Consume Alcohol, Trade (any), Brawling, Endurance, Cool, Language (Khazalid)

### Halfling

Skills: Gamble, Common Knowledge (Reikland), Intuition, Consume Alcohol, Sleight of Hand, Perception, Charm, Trade (Cook), Stealth (any), Dodge, Language (Mootish)

### High Elf

Skills: Entertain (Singing), Leadership, Musicianship (any), Perception, Orientation, Evaluate, Swimming, Brawling, Shooting (bows), Cool, Sailing, Language (Aeltharin)

### Wood Elf

Skills: Athletics, Entertain (Singing), Outdoor Survival, Tracking, Intimidate, Climbing, Perception, Brawling, Stealth (wilderness), Endurance, Shooting (bows), Language (Aeltharin)

---

## 5. TALENTS BY SPECIES

### Human

Talents: Fate, Quick-witted or Suave (+ 3 random talents)

### Dwarf

Talents: Grudger, Night Vision, Stone Eye, Stubborn

### Halfling

Talents: Luck, Night Vision, Resistance (Chaos), Small

### High Elf

Talents: Aetheric Attunement, Cool, Second Sight, Night Vision

### Wood Elf

Talents: Night Vision, Second Sight, Tracker, Very Resilient

---

## 6. CAREER SYSTEM

### Classes (8 total)

1. **Citizens** (Бюргеры) - City dwellers
2. **Military** (Воины) - Warriors
3. **Academics** (Книгочеи) - Scholars
4. **Peasantry** (Крестьяне) - Peasants
5. **Nobles** (Придворные) - Nobles
6. **Riverfolk** (Речники) - River workers
7. **Entertainers** (Странники) - Entertainers
8. **Rangers** (Шельмы) - Outlaws

### Career Entry Requirements

Each career has species restrictions. Check table on page 30-31 of PDF.

### Career Skills & Talents

- **8 skills** available
- **4 talents** available
- **40 skill points** to distribute
- **Max 10 points per skill**

### Requirements to Complete Career Tier

- Complete at least **5 advances in each of 8 skills**

---

## 7. STATUS SYSTEM

### Tiers

| Tier   | NameRu     | Starting Wealth          |
| ------ | ---------- | ------------------------ |
| copper | Медный     | 2d10 pennies per level   |
| silver | Серебряный | 1d10 shillings per level |
| gold   | Золотой    | 1 crown per level        |

---

## 8. XP COSTS

### Characteristic Upgrades

| Current Steps | Cost per Step |
| ------------- | ------------- |
| 0-5           | 25 XP         |
| 6-10          | 30 XP         |
| 11-15         | 40 XP         |
| 16-20         | 50 XP         |
| 21-25         | 70 XP         |
| 26-30         | 90 XP         |
| 31-35         | 120 XP        |
| 36-40         | 150 XP        |
| 41-45         | 190 XP        |
| 46-50         | 230 XP        |

### Skill Upgrades

| Current Steps | Cost per Step |
| ------------- | ------------- |
| 0-5           | 10 XP         |
| 6-10          | 15 XP         |
| 11-15         | 20 XP         |
| 16-20         | 30 XP         |
| 21-25         | 40 XP         |
| 26-30         | 60 XP         |
| 31-35         | 80 XP         |
| 36-40         | 110 XP        |
| 41-45         | 140 XP        |
| 46-50         | 180 XP        |

### Talent Upgrades

```
Cost = 100 + (100 × current_steps)
```

### Career Change

| Type            | Cost   |
| --------------- | ------ |
| Completed tier  | 100 XP |
| Incomplete tier | 200 XP |

---

## 9. RANDOM SELECTION REWARDS

| Action                                  | XP Reward |
| --------------------------------------- | --------- |
| Random species                          | +20 XP    |
| Random class/career (1 roll)            | +50 XP    |
| Random class/career (2 rolls, choose 1) | +25 XP    |
| Manual selection                        | 0 XP      |

---

## 10. TALENT RANK LIMITS

Some talents have maximum rank based on characteristic rating:

| Talent             | Characteristic | Max Rank = Rating |
| ------------------ | -------------- | ----------------- |
| Strong-willed      | WP             | WP / 10           |
| Marksman           | BS             | BS / 10           |
| Warrior-born       | WS             | WS / 10           |
| Lightning-reflexes | Ag             | Ag / 10           |
| Deft-fingers       | Dex            | Dex / 10          |
| Savvy              | Int            | Int / 10          |
| Attractive         | Fel            | Fel / 10          |
| Strong             | S              | S / 10            |
| Hardy              | T              | T / 10            |

---

## 11. PHYSICAL APPEARANCE

### Random Age by Species

| Species  | Formula    |
| -------- | ---------- |
| Human    | 15 + 1d10  |
| Dwarf    | 15 + 10d10 |
| Halfling | 15 + 5d10  |
| High Elf | 30 + 10d10 |
| Wood Elf | 30 + 10d10 |

### Random Height

| Species  | Formula       |
| -------- | ------------- |
| Human    | 4'9" + 2d10"  |
| Dwarf    | 4'3" + 1d10"  |
| Halfling | 3'1" + 1d10"  |
| Elf      | 5'11" + 1d10" |

### Hair Color

Roll 2d10, see table in PDF page 39.

### Eye Color

Roll 2d10, see table in PDF page 38-39.

---

## 12. FILE STRUCTURE

```
apps/web/lib/wfrp/
├── character.ts        # Character interface, calculations, creation
├── characteristics.ts  # Characteristics, rolling, validation
├── species.ts          # Species data, movement, random selection
├── careers.ts          # Career data, restrictions
├── skills.ts           # Skills data
├── talents.ts          # Talents data, random talent table
```

---

## 13. KEY FUNCTIONS

### Required Exports from character.ts

```typescript
// Constants
MAX_SKILL_ADVANCES_PER_SKILL = 10
TOTAL_CAREER_SKILL_POINTS = 40
SKILLS_NEEDED_FOR_CAREER_CHANGE = 5
CAREER_CHANGE_COSTS = { COMPLETED: 100, INCOMPLETE: 200 }

// Functions
createEmptyCharacter(species?: Species): Omit<Character, ...>
calculateWounds(characteristics): number
calculateResilience(characteristics): number
calculateResolve(characteristics): number
getCharacteristicUpgradeCost(currentSteps): number
getSkillUpgradeCost(currentSteps): number
getTalentUpgradeCost(currentSteps): number
getTalentMaxRank(talentId, characteristics): number
canAddTalent(talentId, currentRank, characteristics): boolean
getStatusFromCareer(careerStatus): CharacterStatus
calculateInitialWealth(status): number
rollRandomAge(speciesId): number
rollRandomHeight(speciesId): string
rollRandomHairColor(speciesId): string
rollRandomEyeColor(speciesId): string
```

### Required Exports from characteristics.ts

```typescript
// Constants
MIN_CHARACTERISTIC_VALUE = 4
MAX_CHARACTERISTIC_VALUE = 18

// Functions
roll2d10(): number
getCharacteristicValue(roll): number
rollCharacteristic(speciesId, key): number
rollAllCharacteristics(speciesId): CharacteristicValues
getCharacteristicRating(value): number
validateCharacteristic(value): number
rollCharacteristicWithReroll(speciesId, key, allowReroll): number
```

### Required Exports from species.ts

```typescript
SPECIES: Species[]
SPECIES_MOVEMENT: Record<string, { speed, step, run }>
SPECIES_EXTRA_POINTS: Record<string, number>
SPECIES_BASE_FATE: Record<string, number>

rollRandomSpecies(): Species
getSpeciesById(id): Species | undefined
```

### Required Exports from careers.ts

```typescript
CAREERS: Career[]
CAREER_CLASSES: string[]
getCareerById(id): Career | undefined
getCareersByClass(className): Career[]
getCareersBySpecies(speciesId): Career[]
getCareersByClassAndSpecies(className, speciesId): Career[]
rollRandomCareer(className, speciesId): Career
```

### Required Exports from talents.ts

```typescript
TALENTS: Talent[]
RANDOM_TALENT_TABLE: Record<number, string>

getTalentById(id): Talent | undefined
rollRandomTalent(existingTalents[]): string
```

---

## 14. CHARACTER INTERFACE

```typescript
interface Character {
  id: string;
  name: string;
  speciesId: string;
  careerId: string;
  status: { tier: "copper" | "silver" | "gold"; level: number };
  characteristics: Record<CharacteristicKey, number>;
  skills: { id: string; advances: number }[];
  talents: { id: string; advances: number }[];
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
```

---

## 15. CREATION STEPS (9 STEPS)

1. **Species** - Choose or roll random species
2. **Class & Career** - Choose or roll (with XP rewards)
3. **Characteristics** - Roll 2d10 + species base for each
4. **Skills & Talents** - From species and career
5. **Equipment** - From class and career
6. **Final Details** - Name, age, height, hair, eyes, motivation
7. **Team** - Connect with other players
8. **Bring to Life** - Add backstory
9. **Development** - Spend initial XP

---

## 16. NOTES FOR UI IMPLEMENTATION

- All random rolls must use proper dice (2d10 for characteristics)
- XP must be tracked (earned, spent, available)
- Status system must show tier and level
- Movement values must come from SPECIES_MOVEMENT
- Career restrictions must check species before showing
- Talent purchases must validate against characteristic ratings
- Skill points distribution must respect MAX 10 per skill limit
