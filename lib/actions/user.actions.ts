'use server'

import { positions } from "@/constants";
import { connectToDatabase } from "../database"
import User from "../database/models/user.model";
import UserData, { IUserData } from "../database/models/userData.model";
import { formations } from "@/constants/Formations";
import { calculateGoalkeeperChance, simulateAttack } from "../utils";
import Match from "../database/models/match.model";

export async function createUser() {
    try {
        await connectToDatabase();

        const user = await User.create({
            telegramID: '48128938472634981239862549382743',
            username: 'KoiosPika',
        })

        const userData = await UserData.create({
            User: user._id,
        })

        return userData;
    } catch (error) {
        console.log(error)
    }
}

export async function getUserByUserID(id: string) {
    try {
        await connectToDatabase();

        const user = await UserData.findOne({ User: id })

        return JSON.parse(JSON.stringify(user))

    } catch (error) {
        console.log(error)
    }
}

export async function saveFormation(id: string, formation: string) {
    try {
        await connectToDatabase();

        await UserData.findOneAndUpdate(
            { User: id },
            { '$set': { formation } }
        )

        return;
    } catch (error) {
        console.log(error)
    }
}

export async function upgradePosition(id: string, position: string) {
    try {
        await connectToDatabase();

        const user = await UserData.findOne({ User: id });

        if (!user) {
            throw new Error('User not found');
        }

        const userPosition = user.positions.find((pos: any) => pos.position === position);

        if (!userPosition) {
            throw new Error('Position not found');
        }

        const positionData = positions.find(pos => pos.symbol === position);

        if (!positionData) {
            throw new Error('Position data not found');
        }

        const initialPrice = positionData.initialPrice;


        const price = Math.round(initialPrice * (1.5 ** userPosition.level));


        if (user.coins < price) {
            throw new Error('Not enough coins');
        }

        userPosition.level += 1;

        user.coins -= price;

        await user.save();

        return JSON.parse(JSON.stringify(user));

    } catch (error) {
        console.log(error)
    }
}

export async function savePrize(id: string, prize: string) {
    try {
        await connectToDatabase();

        // Parse the prize string
        const [type, value] = prize.split(':');

        // Debug logs
        console.log(`Prize type: ${type.trim()}`);
        console.log(`Prize value: ${value.trim()}`);

        // Find the user
        const user = await UserData.findOne({ User: id });

        if (!user) {
            throw new Error('User not found');
        }

        if (type.trim() === 'coins') {
            // Extract the coin amount
            const coinAmount = parseInt(value.trim().split(' ')[2], 10);
            console.log(`Coin amount: ${coinAmount}`);

            if (!isNaN(coinAmount)) {
                user.coins += coinAmount;
            } else {
                throw new Error('Invalid coin amount');
            }
        } else if (type.trim() === 'upgrade') {
            // Extract the position and increment value
            const [position, increment] = value.trim().split(' +');
            const incrementValue = parseInt(increment, 10);

            // Debug logs
            console.log(`Position: ${position.trim()}`);
            console.log(`Increment value: ${incrementValue}`);

            if (!isNaN(incrementValue)) {
                // Find the specific position and update its level
                const userPosition = user.positions.find((pos: any) => pos.position === position.trim());

                if (userPosition) {
                    userPosition.level += incrementValue;
                }
            } else {
                throw new Error('Invalid increment value');
            }
        }

        user.diamonds -= 5;

        const newUser = await user.save();

        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.log(error);
    }
}

function mapUserDataToPlayers(userData: IUserData, increment: number) {
    return userData.positions.map(pos => ({
        position: pos.position,
        level: pos.level + increment,
        attributes: { stamina: 70, skill: 80, speed: 75 } // Example attributes
    }));
}

function distributeAttacks(attacksCount: number, totalMinutes: number) {
    let minutes: any[] = [];
    while (minutes.length < attacksCount) {
        const minute = Math.floor(Math.random() * totalMinutes) + 1;
        if (!minutes.includes(minute)) {
            minutes.push(minute);
        }
    }
    return minutes.sort((a, b) => a - b);
}

function simulatePenalty(player: any, shootingPlayer: any, defendingPlayer: any) {
    const goalkeeper = defendingPlayer.positions.find((p: any) => p.position === 'GK');
    const striker = shootingPlayer.positions.find((p: any) => p.position === 'ST' || p.position === 'CF');

    const saveChance = calculateGoalkeeperChance(goalkeeper, { totalLevel: striker.level });
    return Math.random() < saveChance * 0.6 ? `${player} Penalty Missed` : `${player} Penalty Scored`;
}

export async function playGame(player1ID: string, player2ID: string) {
    try {
        await connectToDatabase();

        const player1 = await UserData.findOne({ User: player1ID })

        const player2 = await UserData.findOne({ User: player2ID })

        const formation1 = formations.find(f => f.id === '4-3-3');
        const formation2 = formations.find(f => f.id === '4-5-1');

        const players1 = mapUserDataToPlayers(player1, 0);
        const players2 = mapUserDataToPlayers(player2, 0);

        let results = [{ minute: 0, player: 'Match', outcome: 'Match Started' }];
        let score1 = 0;
        let score2 = 0;

        const normalTimeAttacks = 14;
        const extraTimeAttacks = 6;

        let normalTimeMinutes = distributeAttacks(normalTimeAttacks, 90);
        let extraTimeMinutes = distributeAttacks(extraTimeAttacks, 30).map(minute => minute + 90);

        for (let i = 0; i < normalTimeAttacks; i++) {
            let outcome;
            if (i % 2 === 0) {
                outcome = simulateAttack(formation1, formation2, players1, players2);
                if (outcome === 'Goal Scored') {
                    score1++;
                }
                results.push({ minute: normalTimeMinutes[i], player: 'Player', outcome });
            } else {
                outcome = simulateAttack(formation2, formation1, players2, players1);
                if (outcome === 'Goal Scored') {
                    score2++;
                }
                results.push({ minute: normalTimeMinutes[i], player: 'Opponent', outcome });
            }

            if (normalTimeMinutes[i] >= 45 && !results.some(r => r.outcome === 'Half-time')) {
                results.push({ minute: 45, player: 'Match', outcome: 'Half-time' });
            }
        }

        results.push({ minute: 90, player: 'Match', outcome: score1 === score2 ? 'Awaiting Extra Time' : 'Full-time' });

        if (score1 === score2) {
            // Extra time
            for (let i = 0; i < extraTimeAttacks; i++) {
                let outcome;
                if (i % 2 === 0) {
                    outcome = simulateAttack(formation1, formation2, players1, players2);
                    if (outcome === 'Goal Scored') {
                        score1++;
                    }
                    results.push({ minute: extraTimeMinutes[i], player: 'Player', outcome });
                } else {
                    outcome = simulateAttack(formation2, formation1, players2, players1);
                    if (outcome === 'Goal Scored') {
                        score2++;
                    }
                    results.push({ minute: extraTimeMinutes[i], player: 'Opponent', outcome });
                }
            }

            results.push({ minute: 120, player: 'Match', outcome: score1 === score2 ? 'Awaiting Penalties' : 'Full-time' });
        }

        let penalties = [];
        if (score1 === score2) {
            // Penalties
            for (let i = 0; i < 5; i++) {
                let penaltyOutcome = simulatePenalty('Player', player1, player2);
                results.push({ minute: 120, player: 'Player', outcome: penaltyOutcome });
                penalties.push(penaltyOutcome);
                penaltyOutcome = simulatePenalty('Opponent', player2, player1);
                results.push({ minute: 120, player: 'Opponent', outcome: penaltyOutcome });
                penalties.push(penaltyOutcome);
            }
        }

        const finalOutcomeMinute = score1 === score2 ? 120 : 90;
        const finalOutcome = score1 === score2
            ? penalties.reduce((a, b) => (b.includes('Player') && b.includes('Scored') ? a + 1 : a), 0) >
                penalties.reduce((a, b) => (b.includes('Opponent') && b.includes('Scored') ? a + 1 : a), 0)
                ? 'Player Wins!'
                : 'Opponent Wins!'
            : score1 > score2
                ? 'Player Wins!'
                : 'Opponent Wins!';

        results.push({ minute: finalOutcomeMinute, player: 'Match', outcome: finalOutcome });


        const match = new Match({
            Player: player1._id,
            Opponent: player2._id,
            attacks: results,
            status: 'finished',
            winner: player1._id
        });

        await match.save();

        return JSON.parse(JSON.stringify(match))

    } catch (error) {
        console.log(error)
    }
}