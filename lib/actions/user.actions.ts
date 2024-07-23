'use server'

import { Ranks, positions } from "@/constants";
import { connectToDatabase } from "../database"
import User from "../database/models/user.model";
import UserData, { IUserData } from "../database/models/userData.model";
import { formations } from "@/constants/Formations";
import { calculateGoalkeeperChance, simulateAttack } from "../utils";
import Match from "../database/models/match.model";
import { Predictions, Quizzes } from "@/constants/Earnings";

const populateUsers = (query: any) => {
    return query
        .populate({ path: 'User', model: User, select: "_id username" })
}

export async function createUser(id: string, username: string) {
    try {
        await connectToDatabase();

        const user = await User.create({
            telegramID: id,
            username: username,
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

export async function getUserForPlayPage(id: string) {
    try {
        await connectToDatabase();

        const user = await UserData.findOne({ User: id })

        const userMatches = await Match.find({
            $or: [{ Player: id }, { Opponent: id }]
        })
            .sort({ createdAt: -1 })
            .limit(5)

        const form = userMatches.reverse().map(match => match.winner.toString() === id ? 'W' : 'L').join('');

        console.log(userMatches)

        const recentMatches = userMatches.reverse().slice(0, 2)

        const returnObject = {
            formation: user.formation,
            coins: user.coins,
            played: user.played,
            won: user.won,
            lost: user.lost,
            Rank: user.Rank,
            positions: user.positions,
            teamOverall:user.teamOverall,
            form,
            matches: recentMatches
        }

        return JSON.parse(JSON.stringify(returnObject))

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

        user.teamOverall = calculateTeamOverall(user.positions);

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

function distributeAttacks(attacksCount: number, totalMinutes: number, splitMinute: number) {

    let minutes: number[] = [];

    while (minutes.length < attacksCount) {
        const minute = Math.floor(Math.random() * totalMinutes) + 1;
        if (!minutes.includes(minute)) {
            if (minute < splitMinute) {
                if (minutes.filter(m => m < splitMinute).length < attacksCount / 2) {
                    minutes.push(minute);
                }
            } else {
                if (minutes.filter(m => m >= splitMinute).length < attacksCount / 2) {
                    minutes.push(minute);
                }
            }
        }
    }

    return minutes.sort((a, b) => a - b);
}

function simulatePenalty(player: string) {
    return Math.random() < 0.5 ? `${player} Penalty Missed` : `${player} Penalty Scored`;
}

export async function playGame(player1ID: string, player2ID: string) {
    try {
        await connectToDatabase();

        const player1 = await UserData.findOne({ User: player1ID })

        const player2 = await UserData.findOne({ User: player2ID })

        if (!player1 || !player2) {
            throw new Error('One or both players not found.');
        }

        const formation1 = formations.find(f => f.id === '5-4-1');
        const formation2 = formations.find(f => f.id === '5-4-1');

        if (!formation1 || !formation2) {
            throw new Error('Formations not found.');
        }

        const players1 = mapUserDataToPlayers(player1, 4);
        const players2 = mapUserDataToPlayers(player2, 4);

        let results = [{ minute: 0, player: 'Match', outcome: 'Match Started' }];
        let score1 = 0;
        let score2 = 0;

        const normalTimeAttacks = 24;
        const extraTimeAttacks = 6;

        let normalTimeMinutes = distributeAttacks(normalTimeAttacks, 90, 45);
        let extraTimeMinutes = distributeAttacks(extraTimeAttacks, 30, 15).map(minute => minute + 90);

        for (let i = 0; i < normalTimeAttacks / 2; i++) {
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
        }

        console.log('result 1:', results)

        results.push({ minute: 45, player: 'Match', outcome: 'Half-time' });

        for (let i = normalTimeAttacks / 2; i < normalTimeAttacks; i++) {
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
        }

        results.push({ minute: 90, player: 'Match', outcome: score1 === score2 ? 'Awaiting Extra Time' : 'Full-time' });
        console.log('result 2:', results)

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


        console.log('result 3:', results)

        let penalties = [];
        let playerPenalties = 0;
        let opponentPenalties = 0;

        if (score1 === score2) {
            // Initial 5 penalties for each team
            for (let i = 0; i < 5; i++) {
                let penaltyOutcome = simulatePenalty('Player');
                console.log("penalty outcome for:", penaltyOutcome)
                results.push({ minute: 120, player: 'Player', outcome: penaltyOutcome });
                penalties.push({ player: 'Player', outcome: penaltyOutcome });
                if (penaltyOutcome === 'Player Penalty Scored') playerPenalties++;

                penaltyOutcome = simulatePenalty('Opponent');
                results.push({ minute: 120, player: 'Opponent', outcome: penaltyOutcome });
                penalties.push({ player: 'Opponent', outcome: penaltyOutcome });
                if (penaltyOutcome === 'Opponent Penalty Scored') opponentPenalties++;

                // Check for early win
                if ((playerPenalties > opponentPenalties + (4 - i)) || (opponentPenalties > playerPenalties + (4 - i))) {
                    break;
                }
            }

            // Sudden death if tied after 5 penalties each
            let round = 6;
            while (playerPenalties === opponentPenalties) {
                let penaltyOutcome = simulatePenalty('Player');;
                console.log("penalty outcome while:", penaltyOutcome)
                results.push({ minute: 120, player: 'Player', outcome: penaltyOutcome });
                penalties.push({ player: 'Player', outcome: penaltyOutcome });
                if (penaltyOutcome === 'Player Penalty Scored') playerPenalties++;

                penaltyOutcome = simulatePenalty('Opponent');;
                results.push({ minute: 120, player: 'Opponent', outcome: penaltyOutcome });
                penalties.push({ player: 'Opponent', outcome: penaltyOutcome });
                if (penaltyOutcome === 'Opponent Penalty Scored') opponentPenalties++;

                round++;
            }
        }

        const finalOutcomeMinute = score1 === score2 ? 120 : 90;
        const finalOutcome = score1 === score2
            ? playerPenalties > opponentPenalties
                ? 'Player Wins!'
                : 'Opponent Wins!'
            : score1 > score2
                ? 'Player Wins!'
                : 'Opponent Wins!';

        results.push({ minute: finalOutcomeMinute, player: 'Match', outcome: finalOutcome });

        if (finalOutcome === 'Player Wins!') {
            await UserData.findOneAndUpdate({ User: player1ID }, { '$inc': { played: 1, won: 1, points: 50 } })
            await UserData.findOneAndUpdate({ User: player2ID }, { '$inc': { played: 1, lost: 1 } })
            console.log('Updating Player')
        } else if (finalOutcome === 'Opponent Wins!') {
            await UserData.findOneAndUpdate({ User: player1ID }, { '$inc': { played: 1, lost: 1, points: 50 } })
            await UserData.findOneAndUpdate({ User: player2ID }, { '$inc': { played: 1, won: 1 } })
        }

        console.log(results)


        const match = new Match({
            Player: player1ID,
            Opponent: player2ID,
            attacks: results,
            status: 'finished',
            winner: finalOutcome === 'Player Wins!' ? player1ID : player2ID,
            type: 'Rank'
        });

        await match.save();

        return JSON.parse(JSON.stringify(match))

    } catch (error) {
        console.log(error)
    }
}

export async function addOrUpdateQuiz(userId: string, quizId: string, userAnswer: string) {
    const quiz = Quizzes.find(q => q.id === quizId);
    if (!quiz) {
        throw new Error('Quiz not found');
    }

    if (quiz.answer.toLowerCase() !== userAnswer.toLowerCase()) {
        throw new Error('Incorrect answer');
    }

    await connectToDatabase();

    const user = await UserData.findOne({ User: userId });

    const quizIndex = user.dailyQuizzes.findIndex((q: any) => q.quizId === quizId);

    if (quizIndex !== -1) {
        if (user.dailyQuizzes[quizIndex].answered) {
            throw new Error('Quiz already answered');
        } else {
            // Update existing quiz
            user.dailyQuizzes[quizIndex].answered = true;
        }
    } else {
        // Add new quiz
        user.dailyQuizzes.push({ quizId, answered: true });
    }

    user.coins += 100; // Add points instantly
    await user.save();
}

export async function addOrUpdatePrediction(userId: string, matchId: string, predictedTeam1Score: number, predictedTeam2Score: number) {
    const match = Predictions.find(m => m.id === matchId);
    if (!match) {
        throw new Error('Match not found');
    }

    const now = new Date();
    if (now > new Date(match.lastTimeToPredict)) {
        throw new Error('Prediction time has passed');
    }

    if (predictedTeam1Score === undefined || predictedTeam2Score === undefined) {
        throw new Error('Predicted scores are required');
    }

    const user = await UserData.findOne({ User: userId });

    const predictionIndex = user.dailyPredictions.findIndex((p: any) => p.matchId === matchId);

    if (predictionIndex !== -1) {
        // Update existing prediction
        user.dailyPredictions[predictionIndex].predictedTeam1Score = predictedTeam1Score;
        user.dailyPredictions[predictionIndex].predictedTeam2Score = predictedTeam2Score;
    } else {
        // Add new prediction
        user.dailyPredictions.push({ matchId, predictedTeam1Score, predictedTeam2Score });
    }

    await user.save();
}

export async function collectCoins(userId: string, matchId: string) {
    await connectToDatabase();

    const user = await UserData.findOne({ User: userId });

    if (!user) {
        throw new Error('User not found');
    }

    const prediction = user.dailyPredictions.find((p: any) => p.matchId === matchId);

    if (!prediction) {
        throw new Error('Prediction not found');
    }

    // Check if the prediction is correct
    const match = Predictions.find(m => m.id === matchId);
    if (!match) {
        throw new Error('Match not found');
    }

    const isCorrectPrediction = prediction.predictedTeam1Score === match.team1Score &&
        prediction.predictedTeam2Score === match.team2Score;

    if (!isCorrectPrediction) {
        throw new Error('Prediction is not correct');
    }

    // Check if the prize has already been collected
    if (prediction.collected) {
        throw new Error('Prize already collected');
    }

    // Add coins to user's balance
    user.coins += 1200;

    // Mark the prediction as collected
    prediction.collected = true;

    // Save user data
    await user.save();
}

const calculateTeamOverall = (userPositions: any) => {
    const validPositions = userPositions.filter((pos: any) => {
        const posData = positions.find((p: any) => p.symbol === pos.position);
        return posData && posData.type !== 'Staff';
    });

    if (validPositions.length === 0) {
        return 0; // or another default value if no valid positions
    }

    const totalLevels = validPositions.reduce((sum: any, pos: any) => sum + pos.level, 0);
    const averageLevel = totalLevels / validPositions.length;

    return averageLevel;
};

const generateRandomPositions = () => {
    return positions.map(position => ({
        position: position.symbol,
        level: Math.floor(Math.random() * 10), // Levels between 0 and 9
        availableTime: new Date(),
    }));
};

const generateRandomUsername = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';
    for (let i = 0; i < 8; i++) {
        username += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return username;
};

const generateRandomTelegramID = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let telegramID = '';
    for (let i = 0; i < 10; i++) {
        telegramID += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return telegramID;
};

export async function createFakeUsers(count: number) {
    try {
        await connectToDatabase();

        for (let i = 0; i < count; i++) {
            const user = new User({
                telegramID: generateRandomTelegramID(),
                username: generateRandomUsername(),
                photo: '', // No photo
            });

            await user.save();

            const rank = Ranks[i % Ranks.length]; // Cycle through ranks

            const userData = new UserData({
                User: user._id,
                formation: '4-3-3',
                coins: Math.floor(Math.random() * 10001), // Coins between 0 and 10000
                diamonds: Math.floor(Math.random() * 1001), // Diamonds between 0 and 1000
                points: Math.floor(Math.random() * (rank.maxPoints + 1)), // Points between 0 and maxPoints
                played: Math.floor(Math.random() * 101), // Played between 0 and 100
                won: Math.floor(Math.random() * 51), // Won between 0 and 50
                lost: Math.floor(Math.random() * 51), // Lost between 0 and 50
                Rank: rank.rank,
                teamOverall: 0, // This will be calculated after
                positions: generateRandomPositions(),
                dailyQuizzes: [],
                dailyPredictions: [],
            });

            userData.teamOverall = calculateTeamOverall(userData.positions);

            await userData.save();
        }

        console.log(`${count} fake users created successfully.`);
    } catch (error) {
        console.error('Error creating fake users:', error);
    }
};

export async function findMatch(id: string) {
    try {
        await connectToDatabase();

        const user = await UserData.findOne({ User: id })

        const users = await populateUsers(UserData.find({ Rank: user.Rank }))

        return JSON.parse(JSON.stringify(users[1]))
    } catch (error) {
        console.log(error)
    }
}