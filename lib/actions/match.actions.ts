'use server'

import { connectToDatabase } from "../database"
import Match from "../database/models/match.model";
import User from "../database/models/user.model";
import UserData from "../database/models/userData.model";

export const populateMatch = (query: any) => {
    return query
        .populate({ path: 'Player', model: User, select: "_id username photo" })
        .populate({ path: 'Opponent', model: User, select: "_id username photo" })
}

export async function getMatchByID(id: string) {
    try {
        await connectToDatabase();

        const match = await populateMatch(Match.findById(id))

        const player = await UserData.findOne({ User: match.Player._id })
        const opponent = await UserData.findOne({ User: match.Opponent._id })

        if (!player || !opponent) {
            throw new Error('Player or opponent not found');
        }

        let returnedMatch = {
            ...match._doc,
            playerPhoto: player.User.photo,
            opponentPhoto: opponent.User.photo,
            playerCountry: player.country,
            opponentCountry: opponent.country
        }

        return JSON.parse(JSON.stringify(returnedMatch))
    } catch (error) {
        console.log(error)
    }
}

export async function getMatchesByUserID(id: string, page: number) {
    try {
        await connectToDatabase();

        const matches = await populateMatch(Match.find({
            $or: [{ Player: id }, { Opponent: id }]
        }).sort({ createdAt: -1 }).skip(page * 20).limit(20))

        return JSON.parse(JSON.stringify(matches))
    } catch (error) {
        console.log(error);
    }
}