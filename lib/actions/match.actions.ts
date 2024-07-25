'use server'

import { connectToDatabase } from "../database"
import Match from "../database/models/match.model";
import User from "../database/models/user.model";

export const populateMatch = (query: any) => {
    return query
        .populate({ path: 'Player', model: User, select: "_id username" })
        .populate({ path: 'Opponent', model: User, select: "_id username" })
}

export async function getMatchByID(id: string) {
    try {
        await connectToDatabase();

        const match = await populateMatch(Match.findById(id))

        return JSON.parse(JSON.stringify(match))
    } catch (error) {
        console.log(error)
    }
}

export async function getMatchesByUserID(id: string) {
    try {
        await connectToDatabase();

        const matches = await populateMatch(Match.find({
            $or: [{ Player: id }, { Opponent: id }]
        }).sort({ createdAt: -1 }))

        return JSON.parse(JSON.stringify(matches))
    } catch (error) {
        console.log(error);
    }
}