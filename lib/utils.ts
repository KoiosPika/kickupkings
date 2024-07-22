import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function calculatePossessionChance(formation : any, players :any) {
  let midfielders = 0;
  let totalLevel = 0;

  formation.data.forEach((line : any) => {
    if (line.type === 'Midfield') {
      line.positions.forEach((pos : any) => {
        if (pos) {
          const player = players.find((p : any) => p.position === pos);
          if (player) {
            midfielders++;
            totalLevel += player.level;
          }
        }
      });
    }
  });

  const averageLevel = midfielders > 0 ? totalLevel / midfielders : 0;

  const numberWeight = 0.5;
  const levelWeight = 0.5;

  const possessionFactor = (numberWeight * midfielders) + (levelWeight * averageLevel);
  return possessionFactor;
}

function calculateDefenseInterception(formation : any, players : any) {
  let defenders = 0;
  let totalLevel = 0;

  formation.data.forEach((line : any) => {
    if (line.type === 'Defense') {
      line.positions.forEach((pos : any) => {
        if (pos) {
          const player = players.find((p : any) => p.position === pos);
          if (player) {
            defenders++;
            totalLevel += player.level;
          }
        }
      });
    }
  });

  return { defenders, averageLevel: defenders > 0 ? totalLevel / defenders : 0 };
}

function calculateOffensivePower(formation : any, players : any) {
  let forwards = 0;
  let totalLevel = 0;

  formation.data.forEach((line : any) => {
    if (line.type === 'Forward') {
      line.positions.forEach((pos : any) => {
        if (pos) {
          const player = players.find((p : any) => p.position === pos);
          if (player) {
            forwards++;
            totalLevel += player.level;
          }
        }
      });
    }
  });

  return { forwards, totalLevel };
}

export function calculateGoalkeeperChance(goalkeeper : any, offensivePower : any) {
  const totalLevel = goalkeeper.level + offensivePower.totalLevel;
  const saveChance = goalkeeper.level / totalLevel;
  return saveChance;
}

export function simulateAttack(playerFormation : any, opponentFormation : any, players1 : any, players2 : any) {
  const possession1 = calculatePossessionChance(playerFormation, players1);
  const possession2 = calculatePossessionChance(opponentFormation, players2);

  let possessionFactor1 = possession1 / (possession1 + possession2);
  let possessionFactor2 = possession2 / (possession1 + possession2);

  const randomEvent = Math.random();
  let outcome;

  if (randomEvent < 0.05) {
    outcome = 'Foul';
  } else if (randomEvent < 0.08) {
    outcome = 'Offside';
  } else {
    if (Math.random() < possessionFactor1) {
      const defense = calculateDefenseInterception(opponentFormation, players2);
      const offensivePower = calculateOffensivePower(playerFormation, players1);
      const defenseFactor = defense.averageLevel / (defense.averageLevel + offensivePower.totalLevel);

      if (Math.random() < defenseFactor * 0.7) {
        outcome = 'Defender Interception';
      } else {
        const goalkeeper = players2.find((p : any) => p.position === 'GK');
        const saveChance = calculateGoalkeeperChance(goalkeeper, offensivePower);

        if (Math.random() < saveChance * 0.6) {
          outcome = 'Goalkeeper Save';
        } else {
          outcome = 'Goal Scored';
        }
      }
    } else {
      outcome = 'Midfield Interception';
    }
  }

  return outcome;
}