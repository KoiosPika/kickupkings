'use server'

import { connectToDatabase } from "../database"
import Match from "../database/models/match.model";

export async function getMatchByID(id:string){
    try {
        await connectToDatabase();

        const match = await Match.findById(id)

        return JSON.parse(JSON.stringify(match))
    } catch (error) {
        console.log(error)
    }
}