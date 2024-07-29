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

  if (penaltyOutcome < saveChance) {
    scenario.push('Penalty Missed')
    scenario.push('Goalkeeper saves the penalty');
    return handleFollowUp(scenario, level, 'save');
  } else if (penaltyOutcome < saveChance + woodworkChance) {
    scenario.push('Penalty Missed')
    scenario.push('Penalty hits the woodwork');
    return handleFollowUp(scenario, level, 'woodwork');
  } else if (penaltyOutcome < saveChance + woodworkChance + 0.15) {
    scenario.push('Penalty Missed')
    scenario.push('Penalty is off target');
    return scenario;
  } else {
    scenario.push('Penalty Scored');
    return scenario;
  }
}

// Function to handle follow-up scenarios
function handleFollowUp(scenario: any, level: any, outcome: string): any {
  const followUpEvent = Math.random();

  if (outcome === 'save') {
    if (followUpEvent < 0.3) {
      scenario.push('Goalkeeper catches the ball');
    } else if (followUpEvent < 0.6) {
      scenario.push('Defender clears the ball');
    } else if (followUpEvent < 0.9) {
      scenario.push('Forward shoots from the rebound');
      return handleRebound(scenario, level);
    } else {
      scenario.push('Ball goes out for a corner');
      handleCorner(scenario, level + 1)
    }
  } else if (outcome === 'woodwork') {
    if (followUpEvent < 0.3) {
      scenario.push('Goalkeeper catches the ball');
    } else if (followUpEvent < 0.6) {
      scenario.push('Defender clears the ball');
    } else {
      scenario.push('Forward shoots from the rebound');
      return handleRebound(scenario, level);
    }
  }

  return scenario;
}

// Function to handle rebound scenarios
function handleRebound(scenario: any, level: any): any {
  const reboundOutcome = Math.random();
  if (reboundOutcome < 0.25) {
    scenario.push('Goalkeeper saves the shot');
    return handleFollowUp(scenario, level + 1, 'save');
  } else if (reboundOutcome < 0.4) {
    scenario.push('Ball hits the woodwork');
    return handleFollowUp(scenario, level + 1, 'woodwork');
  } else if (reboundOutcome < 0.5) {
    scenario.push('Shot is off target');
    scenario.push('Ball goes out for a goal kick');
  } else if (reboundOutcome < 0.6) {
    scenario.push('Goal Scored');
  } else if (reboundOutcome < 0.7) {
    scenario.push('Defender blocks the shot');
    return handleBlock(scenario, level + 1);
  } else {
    scenario.push('Ball goes out for a corner');
    handleCorner(scenario, level + 1)
  }
  return scenario;
}

// Function to handle blocked shot scenarios
function handleBlock(scenario: any, level: any): any {
  const blockOutcome = Math.random();
  if (blockOutcome < 0.5) {
    scenario.push('Ball goes out for a corner');
    handleCorner(scenario, level + 1)
  } else if (blockOutcome < 0.7) {
    scenario.push('Ball goes out for a throw-in');
  } else {
    scenario.push('Defender commits a handball');
    scenario.push('Penalty awarded');
    return handlePenalty(scenario, level + 1);
  }
  return scenario;
}

function handleCorner(scenario: any[], level: number) {

  scenario.push('Corner is taken');

  const cornerOutcome = Math.random();

  if (cornerOutcome < 0.4) {
    scenario.push('Defender clears the ball');
    // Corner defended successfully, attack ends
  } else if (cornerOutcome < 0.7) {
    scenario.push('Forward heads the ball');
    // Follow-up scenarios for a header
    const headerOutcome = Math.random();
    if (headerOutcome < 0.3) {
      scenario.push('Goal Scored');
    } else if (headerOutcome < 0.6) {
      scenario.push('Goalkeeper saves the header');
      scenario = handleFollowUp(scenario, 1, 'save')
    } else if (headerOutcome < 0.8) {
      scenario.push('Header is off target');
      scenario.push('Ball goes out for a goal kick');
    } else if (headerOutcome < 0.9) { // New scenario for block
      scenario.push('Defender blocks the header');
      handleBlock(scenario, level + 1)
    } else {
      scenario.push('Header hits the woodwork');
      scenario = handleFollowUp(scenario, 1, 'woodwork')
    }
  } else {
    scenario.push('Corner kick is too high and goes out of play');
  }

  return scenario;
}

function calculateForward(scenario: any[], playerFormation: any, opponentFormation: any, players1: any, players2: any) {
  const defense = calculateDefenseInterception(opponentFormation, players2);
  const offensivePower = calculateOffensivePower(playerFormation, players1);
  const defenseFactor = defense.averageLevel / (defense.averageLevel + offensivePower.totalLevel);

  let eventChance = Math.random();

  if (eventChance < defenseFactor * 0.7) {

    scenario.push('Defender Intercepts the ball');

  } else {

    eventChance = Math.random();

    if (eventChance < 0.2) {

      scenario.push('Forward is caught offside');

    } else if (eventChance < 0.4) {

      scenario.push('Defender fouls the forward');
      scenario.push('Penalty committed');
      scenario = handlePenalty(scenario, 1);

    } else {
      // Forward gets a shot on goal
      scenario.push('Forward has the ball')
      scenario.push('Forward shoots')

      const goalkeeper = players2.find((p: any) => p.position === 'GK');
      const saveChance = calculateGoalkeeperChance(goalkeeper, offensivePower);
      const eventChance = Math.random();

      if (eventChance < saveChance * 0.6) {
        scenario.push('Goalkeeper saves the shot');
        scenario = handleFollowUp(scenario, 1, 'save'); // Continue with follow-up scenarios
      } else if (eventChance < saveChance * 0.6 + 0.1) {
        scenario.push('Shot is off target');
      } else if (eventChance < saveChance * 0.6 + 0.2) {
        scenario.push('Shot hits the woodwork');
        scenario = handleFollowUp(scenario, 1, 'woodwork'); // Continue with follow-up scenarios
      } else if (eventChance < saveChance * 0.6 + 0.3) {
        scenario.push('Defender blocks the shot');
        scenario = handleBlock(scenario, 1); // Continue with follow-up scenarios
      } else {
        scenario.push('Goal Scored');
      }
    }
  }

  return scenario
}

function handleFronLineFreeKick(scenario: any[], playerFormation: any, opponentFormation: any, players1: any, players2: any) {
  const freeKickOutcome = Math.random();
  const offensivePower = calculateOffensivePower(playerFormation, players1);

  if (freeKickOutcome < 0.3) {
    // Direct shot at goal
    scenario.push('Midfielder takes a direct shot at goal');
    const goalkeeper = players2.find((p: any) => p.position === 'GK');
    const saveChance = calculateGoalkeeperChance(goalkeeper, offensivePower);

    const shotOutcome = Math.random();
    if (shotOutcome < saveChance) {
      scenario.push('Goalkeeper saves the shot');
      scenario = handleFollowUp(scenario, 1, 'save');
    } else if (shotOutcome < saveChance + 0.1) {
      scenario.push('Shot hits the woodwork');
      scenario = handleFollowUp(scenario, 1, 'woodwork');
    } else if (shotOutcome < saveChance + 0.15) {
      scenario.push('Shot hits the wall');
      scenario.push('Ball is cleared by the defense');
    } else if (shotOutcome < saveChance + 0.25) {
      scenario.push('Shot is off target');
      scenario.push('Ball goes out for a goal kick');
    } else {
      scenario.push('Goal Scored');
    }
  } else if (freeKickOutcome < 0.6) {
    // Cross into the box
    scenario.push('Midfielder crosses the ball into the box');
    scenario = calculateForward(scenario, playerFormation, opponentFormation, players1, players2);
  } else {
    // Pass into the box
    scenario.push('Midfielder passes the ball into the box');
    scenario = calculateForward(scenario, playerFormation, opponentFormation, players1, players2);
  }

  return scenario;
}

function calculateFrontLineMidfield(scenario: any[], playerFormation: any, opponentFormation: any, players1: any, players2: any) {
  const randomEvent = Math.random();
  if (randomEvent < 0.05) {
    scenario.push('Midfield is fouled');
    scenario.push('Free kick awarded');
    scenario = handleFronLineFreeKick(scenario, playerFormation, opponentFormation, players1, players2);
  } else {
    const defense = calculateDefenseInterception(opponentFormation, players2);
    const offense = calculateOffensivePower(playerFormation, players1);
    const interceptionChance = defense.averageLevel / (defense.averageLevel + offense.totalLevel);

    if (Math.random() < interceptionChance) {
      scenario.push('Pass intercepted by the backline midfield');
    } else {
      scenario.push('Ball passed to the forward');
      scenario = calculateForward(scenario, playerFormation, opponentFormation, players1, players2);
    }
  }

  return scenario;
}

function handleBackLineFreeKick(scenario: any[], playerFormation: any, opponentFormation: any, players1: any, players2: any) {

  const freeKickOutcome = Math.random();
  if (freeKickOutcome < 0.3) {
    scenario.push('Defense attempts a long pass to the forward');
    scenario = calculateForward(scenario, playerFormation, opponentFormation, players1, players2);
  } else {
    scenario.push('Defense plays a short pass to the front line of midfield');
    scenario = calculateFrontLineMidfield(scenario, playerFormation, opponentFormation, players1, players2);
  }

  return scenario;
}

export function simulateAttack(playerFormation: any, opponentFormation: any, players1: any, players2: any) {

  let scenario = [];

  scenario.push('Defense has the ball')

  const defenseControl = calculateDefensiveControl(playerFormation, players1);
  const offensivePress = calculateOffensivePressingPower(opponentFormation, players2);

  const totalPower = defenseControl + offensivePress;
  let defenseChance = defenseControl / totalPower;
  let offenseChance = offensivePress / totalPower;

  offenseChance = Math.min(offenseChance, 0.2);
  defenseChance = 1 - offenseChance;

  const randomEvent = Math.random();

  if (randomEvent < offenseChance) {
    scenario.push('Defense losses the ball to the opposing forward');

    return scenario;

  } else {

    const passOutcome = Math.random();

    if (passOutcome < 0.33) {

      scenario.push('Defense plays a long ball to the forward');

      scenario = calculateForward(scenario, playerFormation, opponentFormation, players1, players2)

    } else if (passOutcome < 0.60) {

      scenario.push('Defense plays a through pass to the front line of midfield');

      scenario = calculateFrontLineMidfield(scenario, playerFormation, opponentFormation, players1, players2)

    } else {

      scenario.push('Defense plays a short pass to the back line of midfield');

      const possessionChance = calculatePossessionChance(playerFormation, players1);
      const defenseInterception = calculateDefenseInterception(opponentFormation, players2);
      const interceptionChance = defenseInterception.averageLevel / (defenseInterception.averageLevel + possessionChance);

      if (Math.random() < interceptionChance) {
        scenario.push('Pass intercepted by the opposing midfield');
      } else {
        const randomEvent = Math.random();
        if (randomEvent < 0.05) {
          scenario.push('Midfield is fouled');
          scenario.push('Free kick awarded');
          scenario = handleBackLineFreeKick(scenario, playerFormation, opponentFormation, players1, players2);
        } else {
          scenario.push('Ball passed to the front line of midfield');

          calculateFrontLineMidfield(scenario, playerFormation, opponentFormation, players1, players2)
        }
      }
    }
  }

  return scenario;
}