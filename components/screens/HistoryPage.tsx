'use client'

import { getMatchesByUserID } from '@/lib/actions/match.actions'
import { getUserByUserID } from '@/lib/actions/user.actions'
import { IMatch } from '@/lib/database/models/match.model'
import { IUserData } from '@/lib/database/models/userData.model'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { ScrollArea } from '../ui/scroll-area'

const HistoryPage = ({ id }: { id: string }) => {
    const [user, setUser] = useState<IUserData>()
    const [matches, setMatches] = useState<IMatch[]>()
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        const getUser = async () => {
            const userData = await getUserByUserID('6699bfa1ba8348c3228f89ab')
            setUser(userData)
        }

        const getMatches = async () => {
            const userMatches = await getMatchesByUserID(id)
            setMatches(userMatches);
        }

        getUser();
        getMatches();
    }, [id])

    const handleRefresh = async () => {
        if (refreshing) {
            return;
        }

        setRefreshing(true);
        const userMatches = await getMatchesByUserID(id)
        setMatches(userMatches);

        setRefreshing(false)
    }

    if (!user) {
        return (
            <section className='w-full h-screen flex flex-col justify-center items-center bg-gradient-to-b from-slate-800 to-gray-600'>
                <Image src={'/icons/spinner.svg'} alt='spinner' height={30} width={30} className='animate-spin' />
            </section>)
    }

    return (
        <section className='w-full h-screen flex flex-col bg-gradient-to-b from-slate-900 to-gray-600'>
            <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                <a href='/' className='bg-slate-500 py-2 px-3 rounded-md text-white font-bold'>
                    <Image src={'/icons/back.svg'} alt='back' height={10} width={10} />
                </a>
                <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] rounded-md' />
                <p className='font-semibold text-white text-[13px]'>{user?.User?.username} ({user?.Rank})</p>
                <p className='font-semibold text-white text-[13px]'>{`->`}</p>
            </div>
            <div className='flex w-full'>
                <div className='flex flex-row items-center gap-2 ml-auto mr-4 bg-slate-800 px-2 py-[2px] rounded-lg' onClick={handleRefresh}>
                    <Image src={'/icons/refresh.svg'} alt='refresh' height={15} width={15} />
                    <p className='text-white font-semibold'>{refreshing ? 'Refreshing...' : 'Refresh'}</p>
                </div>
            </div>
            <ScrollArea className='flex flex-col gap-1 sm:gap-4 my-2 h-[90%]'>
                {matches && matches.map((match: IMatch, index: number) => {
                    const now = new Date();
                    const isAvailableToWatch = now < new Date(match.availableToWatch);
                    return (
                        <div key={index} className='text-white font-semibold p-2 rounded-lg flex flex-row items-center gap-1 sm:gap-5'>
                            {isAvailableToWatch ? (
                                <p className='h-[25px] w-[30px] sm:h-[45px] sm:w-[50px] text-[16px] sm:text-[30px] text-center bg-gray-600 rounded-sm'>-</p>
                            ) : (
                                match.winner.toString() !== '6699bfa1ba8348c3228f89ab' ? (
                                    <p className='h-[25px] w-[30px] sm:h-[45px] sm:w-[50px] text-[16px] sm:text-[30px] text-center bg-red-600 rounded-sm'>L</p>
                                ) : (
                                    <p className='h-[25px] w-[30px] sm:h-[45px] sm:w-[50px] text-[16px] sm:text-[30px] text-center bg-green-600 rounded-sm'>W</p>
                                )
                            )}
                            {isAvailableToWatch ? (
                                <p className='ml-2 text-[16px] sm:text-[30px]'>?-?</p>
                            ) : (<p className='ml-2 text-[16px] sm:text-[30px]'>{match.playerScore}-{match.opponentScore}</p>)}
                            <div className='ml-5 flex flex-row items-center bg-slate-900 px-2 py-1 rounded-lg'>
                                <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[28px] w-[28px] sm:h-[48px] sm:w-[48px] rounded-lg' />
                                {match.Player.toString() !== '6699bfa1ba8348c3228f89ab' ? (
                                    <p className='text-[15px] sm:text-[30px] text-center ml-[6px] rounded-sm'>{match.Opponent.username}</p>
                                ) : (
                                    <p className='text-[15px] sm:text-[30px] text-center ml-[6px] rounded-sm'>{match.Player.username}</p>
                                )}
                            </div>
                            {isAvailableToWatch ? (
                                <a
                                    href={`/play/${match._id}`}
                                    className={`px-2 text-[14px] sm:text-[24px] py-[2px] rounded-lg ml-auto shadow-md ${match.type === 'Rank' ? 'shadow-orange-500 border-b-[3px] sm:border-b-[6px] border-orange-800 bg-orange-600' : 'shadow-purple-500 border-b-[3px] sm:border-b-[6px] border-purple-800 bg-purple-600'}`}
                                >
                                    Watch
                                </a>
                            ) : (
                                <p
                                    className={`px-2 text-[14px] sm:text-[24px] py-[2px] rounded-lg ml-auto shadow-md ${match.type === 'Rank' ? 'shadow-orange-500 border-b-[3px] sm:border-b-[6px] border-orange-800 bg-orange-600' : 'shadow-purple-500 border-b-[3px] sm:border-b-[6px] border-purple-800 bg-purple-600'}`}
                                >
                                    {match.type === 'Rank' ? 'Rank' : 'Friendly'}
                                </p>
                            )}
                        </div>)
                })}
            </ScrollArea>
        </section>
    )
}

export default HistoryPage