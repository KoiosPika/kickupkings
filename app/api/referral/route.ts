import { connectToDatabase } from '@/lib/database';
import Referral from '@/lib/database/models/referral.model';
import User from '@/lib/database/models/user.model';
import UserData from '@/lib/database/models/userData.model';
import { NextResponse } from 'next/server';

export async function POST(request: any) {

    const apiKey = request.headers.get('Authorization')?.split(' ')[1];

    if (apiKey !== process.env.API_KEY) {
        return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { telegramId, referrerId } = await request.json();

        await connectToDatabase()

        let referredUser = await User.findOne({ telegramID: telegramId });

        if (referredUser) {
            // If the referred user already has an account, do not count the referral
            console.log('Referred user already has an account. Referral not counted.');
            return;
        }

        // Find the user by their Telegram ID
        let referrerUser = await User.findOne({ telegramID: referrerId });

        if (!referrerUser) {
            throw new Error('User not found');
        }

        let existingReferral = await Referral.findOne({
            referrerTelegramId: referrerId,
            referredTelegramId: telegramId
        });

        if (!existingReferral) {
            // Create a new referral record
            await Referral.create({
                referrerTelegramId: referrerId,
                referredTelegramId: telegramId
            });

            // Update referral counts for the referrer
            await UserData.findOneAndUpdate(
                { User: referrerUser._id },
                { '$inc': { totalReferrals: 1, weeklyReferrals: 1 } }
            );

            // Notify the referrer about the successful referral
            console.log('Referral recorded and referrer rewarded.');
        } else {
            console.log('Referral already exists, not incrementing.');
        }

    } catch (error) {
        console.error('Error updating diamonds:', error);
        return NextResponse.json({ status: 'error', message: 'Failed to update diamonds' }, { status: 500 });
    }
}