'use server'

import { connectToDatabase } from "../database";
import Friendship from "../database/models/friendship.model";
import User from "../database/models/user.model";

const populateRequests = (query: any) => {
    return query
        .populate({ path: 'Requester', model: User, select: "_id username photo" })
        .populate({ path: 'Receiver', model: User, select: "_id username photo" })
}

export async function findUsersByUsernames(query: string) {
    await connectToDatabase();

    try {
        const users = await User.find({ username: new RegExp(query, 'i') }).limit(10);

        const usersWithFriendshipStatus = await Promise.all(users.map(async (user) => {
            const existingRequest = await Friendship.findOne({
                $or: [
                    { Requester: '6699bfa1ba8348c3228f89ab', Receiver: user._id },
                    { Requester: user._id, Receiver: '6699bfa1ba8348c3228f89ab' }
                ],
            });

            return {
                id: user._id,
                username: user.username,
                photo: user.photo,
                hasRequest: !!existingRequest
            };
        }));

        return JSON.parse(JSON.stringify(usersWithFriendshipStatus))
    } catch (error) {
        console.log(error)
    }
}

export async function sendFriendRequest(requesterId: string, receiverId: string) {
    try {
        await connectToDatabase();

        const existingRequest = await Friendship.findOne({
            requester: requesterId,
            receiver: receiverId
        });

        if (existingRequest) {
            throw new Error('Request Exists')
        }

        const newRequest = new Friendship({
            Requester: requesterId,
            Receiver: receiverId,
            status: false
        });

        await newRequest.save();
    } catch (error) {
        console.log(error);
    }
}

export async function getFriendRequests(userId: string) {
    try {
        await connectToDatabase();

        const requests = await populateRequests(Friendship.find({ Receiver: userId, status: false }))

        return JSON.parse(JSON.stringify(requests))
    } catch (error) {
        console.log(error)
    }
}

export async function getFriends(userId: string) {
    try {
        await connectToDatabase();

        const friends = await populateRequests(Friendship.find({
            $or: [
                { Requester: userId, status: true },
                { Receiver: userId, status: true }
            ]
        }))

        const friendsList = friends.map((friend: any) => {
            return friend.Requester._id.toString() === userId
                ? friend.Receiver
                : friend.Requester;
        });

        return JSON.parse(JSON.stringify(friendsList))
    } catch (error) {
        console.log(error)
    }
}

export async function acceptFriendRequest(requestId: string) {
    try {
        await connectToDatabase();

        const request = await Friendship.findByIdAndUpdate(requestId, { '$set': { status: true } })

        return JSON.parse(JSON.stringify(request))
    } catch (error) {
        console.log(error)
    }
}

export async function deleteFriendRequest(requestId: string) {
    try {
        await connectToDatabase();

        await Friendship.findByIdAndDelete(requestId)

        return;
    } catch (error) {
        console.log(error)
    }
}