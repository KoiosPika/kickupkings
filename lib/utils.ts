import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function calculatePossessionChance(formation: any, players: any) {
  let midfielders = 0;
  let totalLevel = 0;

  formation.data.forEach((line: any) => {
    if (line.type === 'Midfield') {
      line.positions.forEach((pos: any) => {
        if (pos) {
          const player = players.find((p: any) => p.position === pos);
          if (player) {
            midfielders++;
            totalLevel += player.level;
          }
        }
      });
    }
  });

  const averageLevel = midfielders > 0 ? totalLevel / midfielders : 0;

  const numberWeight = 0.6;
  const levelWeight = 0.4;

  const possessionFactor = (numberWeight * midfielders) + (levelWeight * averageLevel);
  return possessionFactor;
}

function calculateDefenseInterception(formation: any, players: any) {
  let defenders = 0;
  let totalLevel = 0;

  formation.data.forEach((line: any) => {
    if (line.type === 'Defense') {
      line.positions.forEach((pos: any) => {
        if (pos) {
          const player = players.find((p: any) => p.position === pos);
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

function calculateOffensivePower(formation: any, players: any) {
  let forwards = 0;
  let totalLevel = 0;

  formation.data.forEach((line: any) => {
    if (line.type === 'Forward') {
      line.positions.forEach((pos: any) => {
        if (pos) {
          const player = players.find((p: any) => p.position === pos);
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

export function calculateGoalkeeperChance(goalkeeper: any, offensivePower: any) {
  const totalLevel = goalkeeper.level + offensivePower.totalLevel;
  const saveChance = goalkeeper.level / totalLevel;
  return saveChance;
}

function calculateDefensiveControl(formation: any, players: any) {
  let totalLevel = 0;
  let defenderCount = 0;

  formation.data.forEach((line: any) => {
    if (line.type === 'Defense') {
      line.positions.forEach((pos: any) => {
        if (pos) {
          const player = players.find((d: any) => d.position === pos);
          if (player) {
            totalLevel += player.level;
            defenderCount++;
          }
        }
      });
    }
  });

  const averageLevel = defenderCount > 0 ? totalLevel / defenderCount : 0;

  // 60% weight on the number of defenders, 40% on their levels
  const controlFactor = (0.6 * defenderCount) + (0.4 * averageLevel);
  return controlFactor;
}

function calculateOffensivePressingPower(formation: any, players: any) {
  let totalLevel = 0;
  let attackerCount = 0;

  formation.data.forEach((line: any) => {
    if (line.type === 'Forward') {
      line.positions.forEach((pos: any) => {
        if (pos) {
          const player = players.find((a: any) => a.position === pos);
          if (player) {
            totalLevel += player.level;
            attackerCount++;
          }
        }
      });
    }
  });

  const averageLevel = attackerCount > 0 ? totalLevel / attackerCount : 0;

  // 60% weight on the number of attackers, 40% on their levels
  const pressingPower = (0.6 * attackerCount) + (0.4 * averageLevel);
  return pressingPower;
}

function handlePenalty(scenario: any, level: any): any {
  const penaltyOutcome = Math.random();
  const saveChance = 0.35 * (1 - level * 0.01); // Decreasing save chance as level increases
  const woodworkChance = 0.1;

  scenario.push({ scenario: 'Player ready to take the penalty', line: 9, wait: 4000 });
  scenario.push({ scenario: 'Player comes forward', line: 9, wait: 3000 });
  scenario.push({ scenario: 'Player shoots', line: 10, wait: 1500 });

  if (penaltyOutcome < saveChance) {

    scenario.push({ scenario: 'Penalty Missed', line: 10, wait: 4000 });
    scenario.push({ scenario: 'Goalkeeper saves the penalty', line: 9, wait: 3000 });
    return handleFollowUp(scenario, level, 'save');
  } else if (penaltyOutcome < saveChance + woodworkChance) {
    scenario.push({ scenario: 'Penalty Missed', line: 10, wait: 4000 });
    scenario.push({ scenario: 'Penalty hits the woodwork', line: 9, wait: 3000 });
    return handleFollowUp(scenario, level, 'woodwork');
  } else if (penaltyOutcome < saveChance + woodworkChance + 0.15) {
    scenario.push({ scenario: 'Penalty Missed', line: 10, wait: 4000 });
    scenario.push({ scenario: 'Penalty is off target', line: 10, wait: 3000 });
    return scenario;
  } else {
    scenario.push({ scenario: 'Penalty Scored', line: 10, wait: 4500 });
    return scenario;
  }
}

// Function to handle follow-up scenarios
function handleFollowUp(scenario: any, level: any, outcome: string): any {
  const followUpEvent = Math.random();

  if (outcome === 'save') {
    if (followUpEvent < 0.3) {
      scenario.push({ scenario: 'Goalkeeper catches the ball', line: 10, wait: 3000 });
    } else if (followUpEvent < 0.6) {
      scenario.push({ scenario: 'Defender clears the ball', line: 8, wait: 2500 });
    } else if (followUpEvent < 0.9) {
      scenario.push({ scenario: 'Forward shoots from the rebound', line: 10, wait: 1500 });
      return handleRebound(scenario, level);
    } else {
      scenario.push({ scenario: 'Ball goes out for a corner', line: 10, wait: 4500 });
      handleCorner(scenario, level + 1)
    }
  } else if (outcome === 'woodwork') {
    if (followUpEvent < 0.3) {
      scenario.push({ scenario: 'Goalkeeper catches the ball', line: 10, wait: 3000 });
    } else if (followUpEvent < 0.6) {
      scenario.push({ scenario: 'Defender clears the ball', line: 8, wait: 3000 });
    } else {
      scenario.push({ scenario: 'Forward shoots from the rebound', line: 10, wait: 1500 });
      return handleRebound(scenario, level);
    }
  }

  return scenario;
}

// Function to handle rebound scenarios
function handleRebound(scenario: any, level: any): any {
  const reboundOutcome = Math.random();
  if (reboundOutcome < 0.25) {
    scenario.push({ scenario: 'Goalkeeper saves the shot', line: 9, wait: 2500 });
    return handleFollowUp(scenario, level + 1, 'save');
  } else if (reboundOutcome < 0.4) {
    scenario.push({ scenario: 'Ball hits the woodwork', line: 9, wait: 3000 });
    return handleFollowUp(scenario, level + 1, 'woodwork');
  } else if (reboundOutcome < 0.5) {
    scenario.push({ scenario: 'Shot is off target', line: 10, wait: 4000 });
  } else if (reboundOutcome < 0.6) {
    scenario.push({ scenario: 'Goal Scored', line: 10, wait: 4500 });
  } else if (reboundOutcome < 0.7) {
    scenario.push({ scenario: 'Defender blocks the shot', line: 9, wait: 3000 });
    return handleBlock(scenario, level + 1);
  } else {
    scenario.push({ scenario: 'Ball goes out for a corner', line: 10, wait: 4500 });
    handleCorner(scenario, level + 1)
  }
  return scenario;
}

// Function to handle blocked shot scenarios
function handleBlock(scenario: any, level: any): any {
  const blockOutcome = Math.random();
  if (blockOutcome < 0.5) {
    scenario.push({ scenario: 'Ball goes out for a corner', line: 10, wait: 4500 });
    handleCorner(scenario, level + 1)
  } else if (blockOutcome < 0.7) {
    scenario.push({ scenario: 'Defender clears the ball', line: 8, wait: 3000 });
  } else {
    scenario.push({ scenario: 'Defender commits a handball', line: 9, wait: 4500 });
    scenario.push({ scenario: 'Penalty awarded', line: 9, wait: 4500 });
    return handlePenalty(scenario, level + 1);
  }
  return scenario;
}

function handleCorner(scenario: any[], level: number) {

  scenario.push({ scenario: 'Corner kick cross', line: 9, wait: 3500 });

  const cornerOutcome = Math.random();

  if (cornerOutcome < 0.4) {

    scenario.push({ scenario: 'Defender clears the ball', line: 9, wait: 3000 });

  } else if (cornerOutcome < 0.7) {
    scenario.push({ scenario: 'Forward heads the ball', line: 10, wait: 3000 });

    const headerOutcome = Math.random();
    if (headerOutcome < 0.3) {
      scenario.push({ scenario: 'Goal Scored', line: 10, wait: 4500 });
    } else if (headerOutcome < 0.6) {
      scenario.push({ scenario: 'Goalkeeper saves the header', line: 9, wait: 3500 });
      scenario = handleFollowUp(scenario, 1, 'save')
    } else if (headerOutcome < 0.8) {
      scenario.push({ scenario: 'Header is off target', line: 10, wait: 3000 });
    } else if (headerOutcome < 0.9) {
      scenario.push({ scenario: 'Defender blocks the header', line: 9, wait: 3500 });
      handleBlock(scenario, level + 1)
    } else {
      scenario.push({ scenario: 'Header hits the woodwork', line: 9, wait: 3500 });
      scenario = handleFollowUp(scenario, 1, 'woodwork')
    }
  } else {
    scenario.push({ scenario: 'Cross is too high', line: 8, wait: 3000 });
  }

  return scenario;
}

function calculateForward(scenario: any[], playerFormation: any, opponentFormation: any, players1: any, players2: any) {
  const defense = calculateDefenseInterception(opponentFormation, players2);
  const offensivePower = calculateOffensivePower(playerFormation, players1);
  const defenseFactor = defense.averageLevel / (defense.averageLevel + offensivePower.totalLevel);

  let eventChance = Math.random();

  if (eventChance < defenseFactor * 0.7) {

    scenario.push({ scenario: 'Defender Intercepts the ball', line: 9, wait: 3000 });

  } else {

    eventChance = Math.random();

    if (eventChance < 0.2) {

      scenario.push({ scenario: 'Forward is caught offside', line: 9, wait: 3000 });

    } else if (eventChance < 0.4) {

      scenario.push({ scenario: 'Defender fouls the forward', line: 9, wait: 4000 });
      scenario.push({ scenario: 'Penalty committed', line: 9, wait: 4500 });
      scenario = handlePenalty(scenario, 1);

    } else {
      // Forward gets a shot on goal
      scenario.push({ scenario: `Forward's chance`, line: 9, wait: 1500 });
      scenario.push({ scenario: 'Forward shoots', line: 10, wait: 1500 });

      const goalkeeper = players2.find((p: any) => p.position === 'GK');
      const saveChance = calculateGoalkeeperChance(goalkeeper, offensivePower);
      const eventChance = Math.random();

      if (eventChance < saveChance * 0.6) {
        scenario.push({ scenario: 'Goalkeeper saves the shot', line: 9, wait: 3500 });
        scenario = handleFollowUp(scenario, 1, 'save'); // Continue with follow-up scenarios
      } else if (eventChance < saveChance * 0.6 + 0.1) {
        scenario.push({ scenario: 'Shot is off target', line: 10, wait: 3500 });
      } else if (eventChance < saveChance * 0.6 + 0.2) {
        scenario.push({ scenario: 'Shot hits the woodwork', line: 9, wait: 3000 });
        scenario = handleFollowUp(scenario, 1, 'woodwork'); // Continue with follow-up scenarios
      } else if (eventChance < saveChance * 0.6 + 0.3) {
        scenario.push({ scenario: 'Defender blocks the shot', line: 9, wait: 3500 });
        scenario = handleBlock(scenario, 1); // Continue with follow-up scenarios
      } else {
        scenario.push({ scenario: 'Goal Scored', line: 10, wait: 4500 });
      }
    }
  }

  return scenario
}

function handleFrontLineFreeKick(scenario: any[], playerFormation: any, opponentFormation: any, players1: any, players2: any) {
  const freeKickOutcome = Math.random();
  const offensivePower = calculateOffensivePower(playerFormation, players1);

  if (freeKickOutcome < 0.3) {
    // Direct shot at goal
    scenario.push({ scenario: 'Midfielder shoots', line: 10, wait: 1500 });
    const goalkeeper = players2.find((p: any) => p.position === 'GK');
    const saveChance = calculateGoalkeeperChance(goalkeeper, offensivePower);

    const shotOutcome = Math.random();
    if (shotOutcome < saveChance) {
      scenario.push({ scenario: 'Goalkeeper saves the shot', line: 9, wait: 3500 });
      scenario = handleFollowUp(scenario, 1, 'save');
    } else if (shotOutcome < saveChance + 0.1) {
      scenario.push({ scenario: 'Shot hits the woodwork', line: 10, wait: 3500 });
      scenario = handleFollowUp(scenario, 1, 'woodwork');
    } else if (shotOutcome < saveChance + 0.15) {
      scenario.push({ scenario: 'Shot hits the wall', line: 8, wait: 3000 });
    } else if (shotOutcome < saveChance + 0.25) {
      scenario.push({ scenario: 'Shot is off target', line: 10, wait: 3500 });
    } else {
      scenario.push({ scenario: 'Goal Scored', line: 10, wait: 4500 });
    }
  } else if (freeKickOutcome < 0.6) {

    scenario.push({ scenario: `Midfielder's cross`, line: 9, wait: 3000 });
    scenario = calculateForward(scenario, playerFormation, opponentFormation, players1, players2);
  } else {

    scenario.push({ scenario: `Midfielder's pass`, line: 9, wait: 3000 });
    scenario = calculateForward(scenario, playerFormation, opponentFormation, players1, players2);
  }

  return scenario;
}

function calculateFrontLineMidfield(scenario: any[], playerFormation: any, opponentFormation: any, players1: any, players2: any) {
  const randomEvent = Math.random();
  if (randomEvent < 0.05) {
    scenario.push({ scenario: 'Midfield is fouled', line: 6, wait: 3500 });
    scenario.push({ scenario: 'Free kick awarded', line: 6, wait: 3500 });
    scenario = handleFrontLineFreeKick(scenario, playerFormation, opponentFormation, players1, players2);
  } else {
    const defense = calculateDefenseInterception(opponentFormation, players2);
    const offense = calculateOffensivePower(playerFormation, players1);
    const interceptionChance = defense.averageLevel / (defense.averageLevel + offense.totalLevel);

    if (Math.random() < interceptionChance) {
      scenario.push({ scenario: 'Midfield backline interception', line: 8, wait: 3000 });
    } else {
      scenario.push({ scenario: 'Ball passed to the forward', line: 9, wait: 3000 });
      scenario = calculateForward(scenario, playerFormation, opponentFormation, players1, players2);
    }
  }

  return scenario;
}

function handleBackLineFreeKick(scenario: any[], playerFormation: any, opponentFormation: any, players1: any, players2: any) {

  const freeKickOutcome = Math.random();
  if (freeKickOutcome < 0.3) {
    scenario.push({ scenario: 'Long ball to forward', line: 7, wait: 3000 });
    scenario = calculateForward(scenario, playerFormation, opponentFormation, players1, players2);
  } else {
    scenario.push({ scenario: 'Pass to frontline midfield', line: 6, wait: 3000 });
    scenario = calculateFrontLineMidfield(scenario, playerFormation, opponentFormation, players1, players2);
  }

  return scenario;
}

function calculateBackLineMidfield(scenario: any[], playerFormation: any, opponentFormation: any, players1: any, players2: any) {

  const possessionChance = calculatePossessionChance(playerFormation, players1);
  const defenseInterception = calculateDefenseInterception(opponentFormation, players2);
  const interceptionChance = defenseInterception.averageLevel / (defenseInterception.averageLevel + possessionChance);

  if (Math.random() < interceptionChance) {
    scenario.push({ scenario: 'Midfield frontline interception', line: 7, wait: 3000 });
  } else {
    const randomEvent = Math.random();
    if (randomEvent < 0.05) {
      scenario.push({ scenario: 'Midfield is fouled', line: 4, wait: 3500 });
      scenario.push({ scenario: 'Free kick awarded', line: 4, wait: 3500 });
      scenario = handleBackLineFreeKick(scenario, playerFormation, opponentFormation, players1, players2);
    } else {
      scenario.push({ scenario: 'Midfield has the ball', line: 6, wait: 3000 });

      calculateFrontLineMidfield(scenario, playerFormation, opponentFormation, players1, players2)
    }
  }

  return scenario;
}

function calculateDefense(scenario: any[], playerFormation: any, opponentFormation: any, players1: any, players2: any) {
  const defenseControl = calculateDefensiveControl(playerFormation, players1);
  const offensivePress = calculateOffensivePressingPower(opponentFormation, players2);

  const totalPower = defenseControl + offensivePress;
  let defenseChance = defenseControl / totalPower;
  let offenseChance = offensivePress / totalPower;

  offenseChance = Math.min(offenseChance, 0.10);
  defenseChance = 1 - offenseChance;

  const randomEvent = Math.random();

  if (randomEvent < offenseChance) {
    scenario.push({ scenario: 'Defense loses possession', line: 3, wait: 3000 });

    return scenario;

  } else {

    const passOutcome = Math.random();

    if (passOutcome < 0.33) {

      scenario.push({ scenario: 'Long ball to forward', line: 7, wait: 3000 });

      scenario = calculateForward(scenario, playerFormation, opponentFormation, players1, players2)

    } else if (passOutcome < 0.60) {

      scenario.push({ scenario: 'Pass to frontline midfield', line: 6, wait: 3000 });

      scenario = calculateFrontLineMidfield(scenario, playerFormation, opponentFormation, players1, players2)

    } else {

      scenario.push({ scenario: 'Pass to backline midfield', line: 5, wait: 3000 });

      scenario = calculateBackLineMidfield(scenario, playerFormation, opponentFormation, players1, players2)
    }
  }

  return scenario;
}

function calculateGoalkeeper(scenario: any[], playerFormation: any, opponentFormation: any, players1: any, players2: any) {
  const randomEvent = Math.random();

  if (randomEvent < 0.6) {
    scenario.push({ scenario: 'GoalKeeper plays short pass', line: 3, wait: 3000 });
    scenario = calculateDefense(scenario, playerFormation, opponentFormation, players1, players2)
  } else if (randomEvent < 0.6 + 0.1) {
    scenario.push({ scenario: 'Keeper plays through pass', line: 5, wait: 3000 });
    scenario = calculateBackLineMidfield(scenario, playerFormation, opponentFormation, players1, players2)
  } else {
    scenario.push({ scenario: 'Keeper plays long pass', line: 7, wait: 3000 });
    scenario = calculateFrontLineMidfield(scenario, playerFormation, opponentFormation, players1, players2)
  }

  return scenario;
}

export function simulateAttack(playerFormation: any, opponentFormation: any, players1: any, players2: any, lastSenario: string) {

  let scenario: any[] = [];

  if (lastSenario) {
    switch (lastSenario) {
      case 'Penalty is off target':
      case 'Shot is off target':
      case 'Header is off target':
      case 'Goalkeeper catches the ball':
        scenario.push({ scenario: 'Keeper has the ball', line: 1, wait: 2500 })
        scenario = calculateGoalkeeper(scenario, playerFormation, opponentFormation, players1, players2)
        break;

      case 'Cross is too high':
      case 'Defender clears the ball':
      case 'Defender Intercepts the ball':
      case 'Forward is caught offside':
      case 'Shot hits the wall':
      case 'Midfield backline interception':
        scenario.push({ scenario: 'Midfield has the ball', line: 5, wait: 2500 })
        scenario.push({ scenario: 'Pass to frontline midfield', line: 6, wait: 3000 });
        scenario = calculateBackLineMidfield(scenario, playerFormation, opponentFormation, players1, players2)
        break;
      case 'Midfield frontline interception':
        scenario.push({ scenario: 'Midfield has the ball', line: 6, wait: 2500 })
        scenario = calculateFrontLineMidfield(scenario, playerFormation, opponentFormation, players1, players2)
        break;
      case 'Defense loses possession':
        scenario = calculateDefense(scenario, playerFormation, opponentFormation, players1, players2)
        break;
      case 'Goal Scored':
      case 'Penalty Scored':
      case 'Match Started':
      case 'Half-time':
      case 'Awaiting Extra-time':
        scenario.push({ scenario: 'Play kicks-off', line: 5, wait: 2500 })
        scenario = calculateBackLineMidfield(scenario, playerFormation, opponentFormation, players1, players2)
        break;
      default:
        scenario = calculateDefense(scenario, playerFormation, opponentFormation, players1, players2)
        break;
    }
  }

  return scenario;
}