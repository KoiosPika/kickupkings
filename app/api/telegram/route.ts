// app/api/update-diamonds/route.js
import User from '@/lib/database/models/user.model';
import UserData from '@/lib/database/models/userData.model';
import { NextResponse } from 'next/server';

export async function POST(request: any) {

    const apiKey = request.headers.get('Authorization')?.split(' ')[1];

    if (apiKey !== process.env.API_KEY) {
        return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { telegramId, amount } = await request.json();

        // Find the user by their Telegram ID
        let user = await User.findOne({ telegramID: telegramId });

        let userData = await UserData.findOne({ User: user._id })

        // Update the user's diamond count
        userData.diamonds += amount;

        // Save the user's updated information
        await userData.save();

        return NextResponse.json({ status: 'success', diamonds: user.diamonds });
    } catch (error) {
        console.error('Error updating diamonds:', error);
        return NextResponse.json({ status: 'error', message: 'Failed to update diamonds' }, { status: 500 });
    }
}
