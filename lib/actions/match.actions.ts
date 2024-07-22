'use server'

import { connectToDatabase } from "../database"
import Match from "../database/models/match.model";

export async function getMatchByID(id: string) {
    try {
        await connectToDatabase();

        const match = await Match.findById(id)

        return JSON.parse(JSON.stringify(match))
    } catch (error) {
        console.log(error)
    }
}

export async function getMatchesByUserID(id: string) {
    try {
        await connectToDatabase();

        const matches = await Match.find({
            $or: [{ Player: id }, { Opponent: id }]
        }).sort({ createdAt: -1 })

        return JSON.parse(JSON.stringify(matches))
    } catch (error) {
        console.log(error);
    }
}