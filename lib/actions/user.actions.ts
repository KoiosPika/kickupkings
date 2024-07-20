'use server'

import { positions } from "@/constants";
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