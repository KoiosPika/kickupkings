'use client'

import { getUserByUserID } from '@/lib/actions/user.actions'
import { IUserData } from '@/lib/database/models/userData.model'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Input } from '../ui/input'
import { acceptFriendRequest, deleteFriendRequest, findUsersByUsernames, getFriendRequests, getFriends, sendFriendRequest } from '@/lib/actions/friendship.actions'
import { IUser } from '@/lib/database/models/user.model'
import { ScrollArea } from '../ui/scroll-area'

const FriendsPage = () => {

    const [user, setUser] = useState<IUserData>()
    const [activeTab, setActiveTab] = useState('friends');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loadingRequests, setLoadingRequests] = useState<any>({});
    const [friendRequests, setFriendRequests] = useState<any[]>([]);
    const [friendsList, setFriendsList] = useState<IUser[]>([]);

    useEffect(() => {

        const getUser = async () => {
            const userData = await getUserByUserID('6699bfa1ba8348c3228f89ab')
            setUser(userData)
        }

        getUser();
    }, [])

    useEffect(() => {
        if (activeTab === 'requests') {
            fetchFriendRequests();
        }
        if (activeTab === 'friends') {
            fetchFriendsList();
        }
    }, [activeTab]);

    const fetchFriendsList = async () => {
        const friends = await getFriends('6699bfa1ba8348c3228f89ab'); // Pass user ID
        setFriendsList(friends);
    };

    const fetchFriendRequests = async () => {
        const requests = await getFriendRequests('6699bfa1ba8348c3228f89ab'); // Assume user ID is passed here
        setFriendRequests(requests);
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.length >= 3) {
                findUsers(searchQuery);
            } else {
                setSearchResults([]);
            }
        }, 300); // debounce time

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const findUsers = async (query: string) => {
        const users = await findUsersByUsernames(query)
        setSearchResults(users);
    };

    const sendRequest = async (userId: string) => {
        setLoadingRequests((prev: any) => ({ ...prev, [userId]: true }));

        await sendFriendRequest('6699bfa1ba8348c3228f89ab', userId);

        setLoadingRequests((prev: any) => ({ ...prev, [userId]: false }));

        setSearchResults((prev) =>
            prev.map(user =>
                user.id === userId ? { ...user, hasRequest: true } : user
            )
        );
    }

    const handleAcceptRequest = async (requestId: string) => {
        await acceptFriendRequest(requestId);
        setFriendRequests((prev) =>
            prev.filter(request => request._id !== requestId)
        );
    };

    const handleDeleteRequest = async (requestId: string) => {
        await deleteFriendRequest(requestId);
        setFriendRequests((prev) =>
            prev.filter(request => request._id !== requestId)
        );
    };

    if (!user) {
        return (
            <section className='w-full h-screen flex flex-col justify-center items-center bg-gradient-to-b from-slate-800 to-gray-600'>
                <Image src={'/icons/spinner.svg'} alt='spinner' height={30} width={30} className='animate-spin' />
            </section>)
    }


    return (
        <section className='w-full h-screen flex flex-col bg-gradient-to-b from-slate-800 to-gray-600'>
            <div className='w-full ml-auto p-2 flex flex-row items-center gap-2'>
                <a href='/' className='bg-slate-500 py-2 px-3 rounded-md text-white font-bold'>
                    <Image src={'/icons/back.svg'} alt='back' height={10} width={10} />
                </a>
                <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] rounded-md' />
                <p className='font-semibold text-white text-[13px]'>Rami ({user?.Rank})</p>
                <p className='font-semibold text-white text-[13px]'>{`->`}</p>
            </div>
            <div className='w-full p-4'>
                <div className='w-full flex flex-row items-center gap-2'>
                    <div className='w-full flex justify-around bg-white rounded-md border-2 border-white'>
                        <button
                            className={`w-1/2 py-1 font-semibold ${activeTab === 'friends' ? 'bg-slate-900 text-white' : ' text-black'} rounded-md`}
                            onClick={() => setActiveTab('friends')}
                        >
                            Friends
                        </button>
                        <button
                            className={`w-1/2 py-1 font-semibold ${activeTab === 'requests' ? 'bg-slate-900 text-white' : ' text-black'} rounded-md`}
                            onClick={() => setActiveTab('requests')}
                        >
                            Requests
                        </button>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <div className='px-3 py-[2px] rounded-md bg-white text-[20px] font-bold'>+</div>
                        </AlertDialogTrigger>
                        <AlertDialogContent className='bg-slate-900 px-4 py-6 border-0 rounded-lg min-h-[400px] flex flex-col justify-start items-center'>
                            <AlertDialogHeader>
                                <AlertDialogTitle className='text-white mt-7 mb-3 text-xl font-semibold'>Find Players</AlertDialogTitle>
                            </AlertDialogHeader>
                            <div className='w-full flex justify-center mb-4'>
                                <Input
                                    className='w-11/12 max-w-md bg-gray-800 text-white border-2 border-gray-600 rounded-md p-2'
                                    placeholder='Search players...'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <ScrollArea className='w-11/12 flex flex-col justify-center items-center overflow-y-auto place-self-center h-[250px]'>
                                {searchResults.length > 0 ? (
                                    searchResults.map((user) => (
                                        <div key={user.id} className='w-full max-w-md bg-gray-800 rounded-md p-3 mb-2 text-white flex justify-between items-center'>
                                            <p className='text-lg font-medium'>{user.username}</p>
                                            {!user.hasRequest ? (
                                                <div
                                                    className='bg-blue-500 text-white font-semibold px-3 py-1 rounded-md'
                                                    onClick={() => sendRequest(user.id)}
                                                >
                                                    {loadingRequests[user.id] ? 'Sending...' : 'Request'}
                                                </div>
                                            ) : (
                                                <p className='text-gray-400'>Request Sent</p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-gray-400 text-center'>No players found</p>
                                )}
                            </ScrollArea>
                            <AlertDialogCancel className='absolute text-white right-4 top-4 bg-transparent border-0'>
                                <Image src='/icons/x.svg' alt='close' height={100} width={100} className='w-[25px] h-[25px] sm:w-[40px] sm:h-[40px]' />
                            </AlertDialogCancel>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className='mt-4'>
                    {activeTab === 'friends' ? (
                        <div className='w-full flex flex-col items-center overflow-y-auto'>
                            {friendsList.length > 0 ? (
                                friendsList.map(friend => (
                                    <div key={friend._id} className='w-full max-w-md bg-slate-900 rounded-md p-3 mb-2 text-white flex items-center'>
                                        <Image src={'/icons/user.svg'} alt='friend' height={20} width={20} />
                                        <p className='text-[16px] font-medium ml-3'>{friend.username}</p>
                                    </div>
                                ))
                            ) : (
                                <p className='text-gray-400'>No friends found</p>
                            )}
                        </div>
                    ) : (
                        <div className='w-full flex flex-col items-center overflow-y-auto'>
                            {friendRequests.length > 0 ? (
                                friendRequests.map(request => (
                                    <div key={request._id} className='w-full max-w-md bg-slate-900 rounded-md p-3 mb-2 text-white flex flex-row gap-3 items-center'>
                                        <Image src={'/icons/user.svg'} alt='user' height={20} width={20} />
                                        <p className='text-[16px] font-medium'>{request.Requester.username}</p>
                                        <div className='flex flex-row items-center gap-2 ml-auto'>
                                            <div className='bg-green-500 text-white py-[5.5px] px-[9px] rounded-md font-semibold' onClick={() => handleAcceptRequest(request._id)}>
                                                <Image src={'/icons/check.svg'} alt='check' height={15} width={15} />
                                            </div>
                                            <div className='bg-red-500 text-white py-1 px-2 rounded-md font-semibold' onClick={() => handleDeleteRequest(request._id)}>
                                                <Image src={'/icons/x-white.svg'} alt='check' height={15} width={15} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='text-gray-400'>No friend requests</p>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </section>
    )
}

export default FriendsPage