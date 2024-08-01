'use server'

import { Ranks, positions } from "@/constants";
import { connectToDatabase } from "../database"
import User from "../database/models/user.model";
import UserData, { IUserData } from "../database/models/userData.model";
import { formations } from "@/constants/Formations";
import { calculateGoalkeeperChance, simulateAttack } from "../utils";
import Match, { IMatch } from "../database/models/match.model";
import { Predictions, Quizzes } from "@/constants/Earnings";
import { populateMatch } from "./match.actions";
import { Flags } from "@/constants/Flags";

const populateUsers = (query: any) => {
    return query
        .populate({ path: 'User', model: User, select: "_id username bio" })
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

        const user = await populateUsers(UserData.findOne({ User: id }))

        return JSON.parse(JSON.stringify(user))

    } catch (error) {
        console.log(error)
    }
}

export async function getUserForPlayPage(id: string) {
    try {
        await connectToDatabase();

        const user = await populateUsers(UserData.findOne({ User: id }))

        await Match.updateMany(
            {
                $and: [
                    { $or: [{ Player: id }, { Opponent: id }] },
                    { availableToWatch: { $lte: new Date() } }
                ]
            },
            { $set: { attacks: [] } }
        );

        const userMatches = await populateMatch(Match.find({
            $or: [{ Player: id }, { Opponent: id }],
            availableToWatch: { $lte: new Date() }
        })
            .sort({ createdAt: -1 })
            .limit(5))

        const form = userMatches.reverse().map((match: IMatch) => match.winner.toString() === id ? 'W' : 'L').join('');

        console.log(userMatches)

        const recentMatches = userMatches.reverse().slice(0, 2)

        const returnObject = {
            formation: user.formation,
            coins: user.coins,
            diamonds: user.diamonds,
            points: user.points,
            draws: user.draws,
            played: user.played,
            won: user.won,
            lost: user.lost,
            Rank: user.Rank,
            username: user.User.username,
            bio: user.User.bio,
            positions: user.positions,
            teamOverall: user.teamOverall,
            country: user.country,
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

        console.log(user);

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

        console.log(initialPrice)


        const price = Math.round(initialPrice * (1.3 ** userPosition.level));

        console.log(price)


        if (user.coins < price) {
            throw new Error('Not enough coins');
        }

        userPosition.level += 1;

        user.coins -= price;

        user.teamOverall = calculateTeamOverall(user.positions);

        await user.save();

        const newUser = await getUserForPlayPage(user.User)

        return JSON.parse(JSON.stringify(newUser));

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

        user.draws += 1

        if (user.draws === 5) {
            user.draws = 0
        }

        user.teamOverall = calculateTeamOverall(user.positions);

        await user.save();

        const newUser = await getUserForPlayPage(user.User)

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

    if (totalMinutes === 90) {
        minutes.push(1)
        minutes.push(46)
    } else {
        minutes.push(1)
    }

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
    let scenario: any[] = [];
    scenario.push({ scenario: 'Player ready to take the penalty', line: 9, wait: 4000 });
    scenario.push({ scenario: 'Player comes forward', line: 9, wait: 3000 });
    scenario.push({ scenario: 'Player shoots', line: 10, wait: 1500 });

    const PenaltyChance = Math.random();

    if (PenaltyChance < 0.25) {
        scenario.push({ scenario: 'Penalty Missed', line: 10, wait: 1500 });
    } else {
        scenario.push({ scenario: 'Penalty Scored', line: 10, wait: 1500 });
    }

    return scenario;
}

export async function playGame(player1ID: string, player2ID: string, type: string, coins: number, diamonds: number, points: number) {
    try {
        await connectToDatabase();

        const player1 = await UserData.findOne({ User: player1ID })

        const player2 = await UserData.findOne({ User: player2ID })

        if (!player1 || !player2) {
            throw new Error('One or both players not found.');
        }

        const formation1 = formations.find(f => f.id === player1.formation);
        const formation2 = formations.find(f => f.id === player2.formation);

        if (!formation1 || !formation2) {
            throw new Error('Formations not found.');
        }

        const players1 = mapUserDataToPlayers(player1, 3);
        const players2 = mapUserDataToPlayers(player2, 3);

        let results = [{ minute: 0, player: 'Match', scenario: [{ scenario: 'Match Started', line: 5, wait: 2500 }] }];
        let score1 = 0;
        let score2 = 0;

        let totalMoves = 0;
        let player = 0;

        while (true) {
            let scenario;
            let lastScenario = '';

            if (results.length > 0 && results[results.length - 1].scenario.length > 0) {
                lastScenario = results[results.length - 1].scenario[results[results.length - 1].scenario.length - 1].scenario;
            }

            if (player % 2 === 0) {
                scenario = simulateAttack(formation1, formation2, players1, players2, lastScenario);
                if (scenario[scenario.length - 1].scenario === 'Goal Scored' || scenario[scenario.length - 1].scenario === 'Penalty Scored' || scenario[scenario.length - 1].scenario === 'Freekick Scored') {
                    score1++;
                }
                results.push({ minute: 0, player: 'Player', scenario });

                totalMoves = totalMoves + scenario.length

                if (totalMoves >= 90) {
                    break;
                }

                player++;

            } else {
                scenario = simulateAttack(formation2, formation1, players2, players1, lastScenario);
                if (scenario[scenario.length - 1].scenario === 'Goal Scored' || scenario[scenario.length - 1].scenario === 'Penalty Scored' || scenario[scenario.length - 1].scenario === 'Freekick Scored') {
                    score2++;
                }
                results.push({ minute: 0, player: 'Opponent', scenario });

                totalMoves = totalMoves + scenario.length

                if (totalMoves >= 90) {
                    break;
                }

                player++;
            }
        }

        results.push({ minute: 45, player: 'Match', scenario: [{ scenario: 'Half-time', line: 5, wait: 2500 }] });

        totalMoves = 0;

        player = 1

        while (true) {
            let scenario;
            let lastScenario = '';

            if (results.length > 0 && results[results.length - 1].scenario.length > 0) {
                lastScenario = results[results.length - 1].scenario[results[results.length - 1].scenario.length - 1].scenario;
            }

            if (player % 2 === 0) {
                scenario = simulateAttack(formation1, formation2, players1, players2, lastScenario);
                if (scenario[scenario.length - 1].scenario === 'Goal Scored' || scenario[scenario.length - 1].scenario === 'Penalty Scored' || scenario[scenario.length - 1].scenario === 'Freekick Scored') {
                    score1++;
                }
                results.push({ minute: 0, player: 'Player', scenario });

                totalMoves = totalMoves + scenario.length

                if (totalMoves >= 90) {
                    break;
                }

                player++;

            } else {
                scenario = simulateAttack(formation2, formation1, players2, players1, lastScenario);
                if (scenario[scenario.length - 1].scenario === 'Goal Scored' || scenario[scenario.length - 1].scenario === 'Penalty Scored' || scenario[scenario.length - 1].scenario === 'Freekick Scored') {
                    score2++;
                }
                results.push({ minute: 0, player: 'Opponent', scenario });

                totalMoves = totalMoves + scenario.length

                if (totalMoves >= 90) {
                    break;
                }

                player++;
            }
        }

        results.push({ minute: 90, player: 'Match', scenario: score1 === score2 ? [{ scenario: 'Awaiting Extra-time', line: 5, wait: 2500 }] : [{ scenario: 'Full time', line: 5, wait: 2500 }] });

        totalMoves = 0;

        player = 0
        
        if (score1 === score2) {
            // Extra time
            while (true) {
                let scenario;
                let lastScenario = '';

                if (results.length > 0 && results[results.length - 1].scenario.length > 0) {
                    lastScenario = results[results.length - 1].scenario[results[results.length - 1].scenario.length - 1].scenario;
                }

                if (player % 2 === 0) {
                    scenario = simulateAttack(formation1, formation2, players1, players2, lastScenario);
                    if (scenario[scenario.length - 1].scenario === 'Goal Scored' || scenario[scenario.length - 1].scenario === 'Penalty Scored' || scenario[scenario.length - 1].scenario === 'Freekick Scored') {
                        score1++;
                    }
                    results.push({ minute: 0, player: 'Player', scenario });

                    totalMoves = totalMoves + scenario.length

                    if (totalMoves >= 60) {
                        break;
                    }

                    player++;

                } else {
                    scenario = simulateAttack(formation2, formation1, players2, players1, lastScenario);
                    if (scenario[scenario.length - 1].scenario === 'Goal Scored' || scenario[scenario.length - 1].scenario === 'Penalty Scored' || scenario[scenario.length - 1].scenario === 'Freekick Scored') {
                        score2++;
                    }
                    results.push({ minute: 0, player: 'Opponent', scenario });

                    totalMoves = totalMoves + scenario.length

                    if (totalMoves >= 60) {
                        break;
                    }

                    player++;
                }
            }

            results.push({ minute: 120, player: 'Match', scenario: score1 === score2 ? [{ scenario: 'Awaiting Penalties', line: 5, wait: 2500 }] : [{ scenario: 'Full time', line: 5, wait: 2500 }] });
        }

        let playerPenalties = 0;
        let opponentPenalties = 0;

        if (score1 === score2) {
            // Initial 5 penalties for each team
            for (let i = 0; i < 5; i++) {
                let scenario;
                scenario = simulatePenalty('Player');
                results.push({ minute: 120, player: 'Player', scenario: scenario });
                if (scenario[scenario.length - 1].scenario === 'Penalty Scored') playerPenalties++;

                scenario = simulatePenalty('Opponent');
                results.push({ minute: 120, player: 'Opponent', scenario: scenario });
                if (scenario[scenario.length - 1].scenario === 'Penalty Scored') opponentPenalties++;

                // Check for early win
                if ((playerPenalties > opponentPenalties + (4 - i)) || (opponentPenalties > playerPenalties + (4 - i))) {
                    break;
                }
            }

            // Sudden death if tied after 5 penalties each
            let round = 6;
            while (playerPenalties === opponentPenalties) {
                let scenario;
                scenario = simulatePenalty('Player');
                results.push({ minute: 120, player: 'Player', scenario: scenario });
                if (scenario[scenario.length - 1].scenario === 'Penalty Scored') playerPenalties++;

                scenario = simulatePenalty('Opponent');
                results.push({ minute: 120, player: 'Opponent', scenario: scenario });
                if (scenario[scenario.length - 1].scenario === 'Penalty Scored') opponentPenalties++;

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

        results.push({ minute: finalOutcomeMinute, player: 'Match', scenario: [{ scenario: finalOutcome, line: 5, wait: 3000 }] });

        if (type == 'Rank') {
            const rankData = Ranks.find(rank => rank.rank === player1.Rank);
            if (finalOutcome === 'Player Wins!') {
                const updatedPlayer1 = await UserData.findOneAndUpdate({ User: player1ID }, { '$inc': { played: 1, won: 1, points, coins, diamonds } }, { new: true })

                const newRank = Ranks.find(rank => updatedPlayer1.points <= rank.maxPoints) || Ranks[Ranks.length - 1];

                if (newRank.rank !== updatedPlayer1.Rank) {
                    await UserData.findOneAndUpdate(
                        { User: player1ID },
                        { Rank: newRank.rank }
                    );
                }

                await UserData.findOneAndUpdate({ User: player2ID }, { '$inc': { played: 1, lost: 1 } })
            } else if (finalOutcome === 'Opponent Wins!') {
                const updatedPlayer1 = await UserData.findOneAndUpdate({ User: player1ID }, { '$inc': { played: 1, lost: 1, points: (rankData?.basePoints || 0) * -1 } }, { new: true })
                const newRank = Ranks.find(rank => updatedPlayer1.points <= rank.maxPoints) || Ranks[Ranks.length - 1];

                if (newRank.rank !== updatedPlayer1.Rank) {
                    await UserData.findOneAndUpdate(
                        { User: player1ID },
                        { Rank: newRank.rank }
                    );
                }
                await UserData.findOneAndUpdate({ User: player2ID }, { '$inc': { played: 1, won: 1 } })
            }
        } else if (type === 'Classic') {
            if (finalOutcome === 'Player Wins!') {
                await UserData.findOneAndUpdate({ User: player1ID }, { '$inc': { played: 1, won: 1, coins } })

                await UserData.findOneAndUpdate({ User: player2ID }, { '$inc': { played: 1, lost: 1 } })

            } else if (finalOutcome === 'Opponent Wins!') {
                await UserData.findOneAndUpdate({ User: player1ID }, { '$inc': { played: 1, lost: 1, coins: coins / 3 } })

                await UserData.findOneAndUpdate({ User: player2ID }, { '$inc': { played: 1, won: 1 } })
            }
        }

        const match = new Match({
            Player: player1ID,
            Opponent: player2ID,
            attacks: results,
            status: 'finished',
            winner: finalOutcome === 'Player Wins!' ? player1ID : player2ID,
            playerScore: score1 + playerPenalties,
            opponentScore: score2 + opponentPenalties,
            type
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

        const user = await populateUsers(UserData.findOne({ User: id })).lean();

        if (!user) throw new Error('User not found');

        const count = await UserData.countDocuments({ Rank: user.Rank, User: { $ne: id } });

        const randomIndex = Math.floor(Math.random() * count);

        const opponent = await populateUsers(
            UserData.findOne({ Rank: user.Rank, User: { $ne: id } })
                .skip(randomIndex)
                .lean()
        );

        if (!opponent) throw new Error('Opponent not found');

        const userOverall = calculateFormationOverall(user);
        const opponentOverall = calculateFormationOverall(opponent);

        const prizes = calculatePrizes(userOverall, opponentOverall, user.Rank);

        const matchDetails = {
            player: { ...user },
            opponent: { ...opponent },
            playerOverall: userOverall,
            opponentOverall: opponentOverall,
            prizes
        }

        return JSON.parse(JSON.stringify(matchDetails))
    } catch (error) {
        console.log(error)
    }
}

export async function getFriendlyMatchInfo(playerId: string, opponentId: string) {
    try {
        await connectToDatabase();
        const user = await populateUsers(UserData.findOne({ User: playerId })).lean();

        const opponent = await populateUsers(UserData.findOne({ User: opponentId })).lean();

        const userOverall = calculateFormationOverall(user);
        const opponentOverall = calculateFormationOverall(opponent);

        const matchDetails = {
            player: { ...user },
            opponent: { ...opponent },
            playerOverall: userOverall,
            opponentOverall: opponentOverall,
        }

        return JSON.parse(JSON.stringify(matchDetails))

    } catch (error) {
        console.log(error)
    }
}

export async function addChatID() {
    try {
        await connectToDatabase();

        await User.updateMany({}, { '$set': { chatId: '707937422' } })
    } catch (error) {
        console.log(error);
    }
}

function calculateFormationOverall(userData: IUserData) {
    const userFormation = formations.find(f => f.id === userData.formation);

    if (!userFormation) {
        throw new Error('User formation not found');
    }

    // Extract the positions from the user's formation
    const formationPositions = userFormation.data.flatMap(data => data.positions).filter(pos => pos);

    // Filter user's positions based on the formation positions
    const validPositions = userData.positions.filter(userPos => formationPositions.includes(userPos.position));

    if (validPositions.length === 0) {
        return 0; // or another default value if no valid positions
    }

    // Calculate the average level of the positions
    const totalLevels = validPositions.reduce((sum, position) => sum + position.level, 0);
    const averageLevel = totalLevels / validPositions.length;

    return averageLevel;
}

function calculatePrizes(userOverall: number, opponentOverall: number, userRank: number) {
    const rankData = Ranks.find(rank => rank.rank === userRank);

    if (!rankData) {
        throw new Error('Rank data not found');
    }

    let coins = rankData.baseCoins;
    let points = rankData.basePoints;
    let diamonds = 0;

    const difference = opponentOverall - userOverall;

    if (difference >= 2) {

        coins *= 2;
        points *= 2;
        diamonds = 3;
    } else if (difference <= -2) {

        coins = Math.floor(coins / 2);
        points = Math.floor(points / 2);
    }

    return { coins, points, diamonds };
}

export async function changeCountry(userId: string, country: string) {
    try {
        await connectToDatabase();

        await UserData.findOneAndUpdate({ User: userId }, { '$set': { country } })

        return;
    } catch (error) {
        console.log(error)
    }
}

export async function editProfile(userId: string, username: string, bio: string) {
    try {
        await connectToDatabase();

        const existingUser = await User.findOne({ username });

        if (existingUser && existingUser._id.toString() !== userId) {
            throw new Error('Username is already taken.');
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { '$set': { username, bio } },
            { new: true, runValidators: true }
        );

    } catch (error) {
        if ((error as Error).message === 'Username is already taken.') {
            return 'Username is already taken.';
        }

        console.log(error);
    }
}