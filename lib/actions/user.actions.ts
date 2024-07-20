'use server'

import { connectToDatabase } from "../database"
import User from "../database/models/user.model";
import UserData from "../database/models/userData.model";

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