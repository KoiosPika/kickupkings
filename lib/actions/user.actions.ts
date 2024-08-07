'use server'

import { Ranks, positions } from "@/constants";
import { connectToDatabase } from "../database"
import User from "../database/models/user.model";
import UserData, { IUserData } from "../database/models/userData.model";
import { formations } from "@/constants/Formations";
import { calculateGoalkeeperChance, simulateAttack } from "../utils";
import Match, { IMatch } from "../database/models/match.model";
import { Predictions } from "@/constants/Earnings";
import { populateMatch } from "./match.actions";
import { Flags } from "@/constants/Flags";
import { Icons } from "@/constants/Icons";

const populateUsers = (query: any) => {
    return query
        .populate({ path: 'User', model: User, select: "_id username bio photo chatId" })
}

export async function createUser(id: string, chatId: string) {
    try {
        await connectToDatabase();

        const username = generateRandomUsername();

        const user = await User.create({
            telegramID: id,
            chatId,
            username,
            photo: 'galaxy_male_1'
        })

        const userData = await UserData.create({
            User: user._id,
            icons: [
                { name: 'galaxy_male_1', theme: 'galaxy', type: 'male' },
                { name: 'galaxy_male_2', theme: 'galaxy', type: 'male' },
                { name: 'galaxy_female_1', theme: 'galaxy', type: 'female' },
                { name: 'galaxy_female_2', theme: 'galaxy', type: 'female' }
            ]
        })

        return JSON.parse(JSON.stringify(userData));
    } catch (error) {
        console.log(error)
    }
}

export async function findUserForLogin(telegramId: string) {
    try {
        await connectToDatabase();

        const user = await User.findOne({ telegramID: telegramId })

        return JSON.parse(JSON.stringify(user))

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
            id: user.User._id,
            chatId: user.User.chatId,
            formation: user.formation,
            coins: user.coins,
            diamonds: user.diamonds,
            points: user.points,
            draws: user.draws,
            played: user.played,
            won: user.won,
            lost: user.lost,
            scored: user.scored,
            conceded: user.conceded,
            Rank: user.Rank,
            username: user.User.username,
            photo: user.User.photo,
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
                const updatedPlayer1 = await UserData.findOneAndUpdate({ User: player1ID }, { '$inc': { played: 1, won: 1, points, coins, diamonds, scored: score1, conceded: score2 } }, { new: true })

                const newRank = Ranks.find(rank => updatedPlayer1.points <= rank.maxPoints) || Ranks[Ranks.length - 1];

                if (newRank.rank !== updatedPlayer1.Rank) {
                    await UserData.findOneAndUpdate(
                        { User: player1ID },
                        { Rank: newRank.rank }
                    );
                }

                await UserData.findOneAndUpdate({ User: player2ID }, { '$inc': { played: 1, lost: 1, scored: score2, conceded: score1 } })
            } else if (finalOutcome === 'Opponent Wins!') {
                const updatedPlayer1 = await UserData.findOneAndUpdate({ User: player1ID }, { '$inc': { played: 1, lost: 1, points: (rankData?.basePoints || 0) * -1, scored: score1, conceded: score2 } }, { new: true })
                const newRank = Ranks.find(rank => updatedPlayer1.points <= rank.maxPoints) || Ranks[Ranks.length - 1];

                if (newRank.rank !== updatedPlayer1.Rank) {
                    await UserData.findOneAndUpdate(
                        { User: player1ID },
                        { Rank: newRank.rank }
                    );
                }
                await UserData.findOneAndUpdate({ User: player2ID }, { '$inc': { played: 1, won: 1, scored: score2, conceded: score1 } })
            }
        } else if (type === 'Classic') {
            if (finalOutcome === 'Player Wins!') {
                await UserData.findOneAndUpdate({ User: player1ID }, { '$inc': { played: 1, won: 1, coins, scored: score1, conceded: score2 } })

                await UserData.findOneAndUpdate({ User: player2ID }, { '$inc': { played: 1, lost: 1, scored: score2, conceded: score1 } })

            } else if (finalOutcome === 'Opponent Wins!') {
                await UserData.findOneAndUpdate({ User: player1ID }, { '$inc': { played: 1, lost: 1, coins: coins / 3, scored: score1, conceded: score2 } })

                await UserData.findOneAndUpdate({ User: player2ID }, { '$inc': { played: 1, won: 1, scored: score2, conceded: score1 } })
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

const generateRandomPositions = (rank: number) => {
    return positions.map(position => ({
        position: position.symbol,
        level: Math.floor(Math.random() * (rank + 3 - (rank - 2)) + (rank - 2)),
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

export async function createFakeUsers(count: number, rank: number) {
    try {
        await connectToDatabase();

        for (let i = 0; i < count; i++) {
            const user = new User({
                telegramID: generateRandomTelegramID(),
                chatId: generateRandomTelegramID(),
                username: generateRandomUsername(),
                photo: '', // No photo
                type: 'Bot',
            });

            await user.save();

            const currentRank = Ranks.find(r => r.rank = rank)!; // Cycle through ranks

            const formations = [
                '3-1-2-1-3', '3-1-4-2', '3-2-3-2', '3-2-4-1', '3-3-1-3', '3-4-1-2', '3-4-2-1',
                '3-4-3', '3-5-1-1', '3-5-2', '4-1-2-1-2', '4-1-2-3', '4-1-3-2', '4-1-4-1',
                '4-2-2-2', '4-2-3-1', '4-2-4', '4-3-1-2', '4-3-2-1', '4-3-3', '4-4-1-1', '4-4-2',
                '4-5-1', '5-1-2-1-1', '5-1-3-1', '5-2-1-2', '5-2-2-1', '5-2-3', '5-3-2', '5-4-1'
            ];

            const flags = ['ae', 'af', 'al', 'am', 'ao', 'ar', 'at', 'au', 'az', 'ba', 'bd', 'be', 'bg', 'bh', 'bo', 'br', 'ca',
                'cd', 'cg', 'ch', 'ci', 'cl', 'cm', 'cn', 'co', 'cr', 'cz', 'de', 'dk', 'dz', 'ec', 'eg', 'es-ct', 'es', 'eu',
                'fr', 'gb-eng', 'gb-sct', 'gh', 'hr', 'hu', 'ie', 'in', 'iq', 'ir', 'it', 'jm', 'jp', 'ke', 'kr', 'kw', 'lb',
                'ma', 'mx', 'my', 'ng', 'nl', 'no', 'nz', 'pe', 'ph', 'pl', 'pr', 'pt', 'qa', 'ro', 'rs', 'ru', 'sa', 'se', 'si',
                'sk', 'sn', 'sv', 'tn', 'tr', 'ua', 'us', 'uy', 'uz', 've', 'vn', 'za', 'zw']

            const userData = new UserData({
                User: user._id,
                formation: formations[Math.floor(Math.random() * formations.length)],
                coins: Math.floor(Math.random() * 10001), // Coins between 0 and 10000
                diamonds: Math.floor(Math.random() * 1001), // Diamonds between 0 and 1000
                points: Math.floor(Math.random() * (currentRank.maxPoints + 1)), // Points between 0 and maxPoints
                played: Math.floor(Math.random() * 101), // Played between 0 and 100
                won: Math.floor(Math.random() * 51), // Won between 0 and 50
                lost: Math.floor(Math.random() * 51), // Lost between 0 and 50
                Rank: currentRank.rank,
                teamOverall: 0, // This will be calculated after
                country: flags[Math.floor(Math.random() * flags.length)],
                positions: generateRandomPositions(rank),
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

export async function buyIcon(userId: string, iconName: any) {
    try {
        await connectToDatabase();

        const user = await populateUsers(UserData.findOne({ User: userId }))

        const localIcon = Icons.find(i => i.name == iconName)!

        if (user.diamonds < localIcon.price) {
            throw new Error('Insuffient Funds')
        }

        user.diamonds -= localIcon.price;

        let newIcon = {
            name: localIcon.name,
            theme: localIcon.theme,
            type: localIcon.type
        }

        user.icons.push(newIcon)

        await user.save();

        return JSON.parse(JSON.stringify(user));

    } catch (error) {
        console.log(error);
    }
}

export async function changeIcon(userId: string, iconName: string) {
    try {
        await connectToDatabase();

        await User.findByIdAndUpdate(userId, { '$set': { photo: iconName } })

        const user = await populateUsers(UserData.findOne({ User: userId }))

        return JSON.parse(JSON.stringify(user))
    } catch (error) {
        console.log(error)
    }
}

export async function setIconPhotos() {
    try {

        console.log('Started');

        await connectToDatabase();

        const users = await User.find({}).limit(500).skip(7000);

        for (let user of users) {
            const randomIcon = Icons[Math.floor(Math.random() * Icons.length)].name;
            user.photo = randomIcon;
            await user.save();
        }

        console.log('Done')
    } catch (error) {
        console.log(error)
    }
}

export async function setGoals() {
    try {

        console.log('Started');

        await connectToDatabase();

        await UserData.updateMany({}, { '$set': { scored: 0, conceded: 0 } })

        console.log('Done')
    } catch (error) {
        console.log(error)
    }
}