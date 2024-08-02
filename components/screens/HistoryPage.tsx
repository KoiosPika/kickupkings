'use client'

import { getMatchesByUserID } from '@/lib/actions/match.actions'
import { getUserByUserID } from '@/lib/actions/user.actions'
import { IMatch } from '@/lib/database/models/match.model'
import { IUserData } from '@/lib/database/models/userData.model'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { timeAgo } from '@/lib/utils'
import { useInView } from "react-intersection-observer"

let page = 0;

const HistoryPage = ({ id }: { id: string }) => {
    const [user, setUser] = useState<IUserData>()
    const [matches, setMatches] = useState<IMatch[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(false)
    const { ref, inView } = useInView()
    const [showSpinner, setShowSpinner] = useState(true)

    useEffect(() => {
        const getUser = async () => {
            const userData = await getUserByUserID('6699bfa1ba8348c3228f89ab')
            setUser(userData)
        }

        const getMatches = async () => {
            const userMatches = await getMatchesByUserID(id, page)
            setMatches(userMatches);
        }

        getUser();
        getMatches();
    }, [id])

    useEffect(() => {

        async function getMatches() {
            const userMatches = await getMatchesByUserID(id, page + 1)
            if (userMatches.length === 0) {
                setShowSpinner(false);
            }

            setMatches((prevMatches) => [...prevMatches, ...userMatches]);

            page++;
        }

        if (inView) {
            getMatches();
        }

    }, [inView])

    const handleRefresh = async () => {

        if (refreshing) {
            return;
        }

        page = 0;
        setShowSpinner(true);

        setRefreshing(true);
        const userMatches = await getMatchesByUserID(id, 0)
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
                <a href='/' className='py-2 px-3 rounded-md text-white font-bold'>
                    <Image src={'/icons/back.svg'} alt='back' height={10} width={10} />
                </a>
                <Image src={'/PFP.jpg'} alt='user' height={50} width={50} className='bg-slate-500 h-[30px] w-[30px] rounded-lg' />
                <p className='font-semibold text-white text-[13px]'>{user?.User.username} ({user?.Rank})</p>
            </div>
            <div className='flex w-full'>
                <div className='flex flex-row items-center gap-2 ml-auto mr-4 px-2 py-[2px] rounded-lg' onClick={handleRefresh}>
                    <Image src={'/icons/refresh.svg'} alt='refresh' height={15} width={15} />
                    <p className='text-white font-semibold'>{refreshing ? 'Refreshing...' : 'Refresh'}</p>
                </div>
            </div>
            <ScrollArea className='flex flex-col gap-1 sm:gap-4 my-2 h-[90%] mb-auto'>
                {matches && matches.map((match: IMatch, index: number) => {
                    const now = new Date();
                    const isAvailableToWatch = now < new Date(match.availableToWatch);
                    return (
                        <div key={index} className='text-white font-semibold p-2 rounded-lg flex flex-row items-center gap-1 sm:gap-5'>
                            {match.Player._id === '6699bfa1ba8348c3228f89ab' ? (<p className='text-green-500 text-[18px]'>↑</p>) : (<p className='text-red-500 text-[18px]'>↓</p>)}
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
                            <div className='ml-3 flex flex-row items-center px-2 py-1 rounded-lg w-[120px] overflow-hidden'>
                                <Image src={'/PFP.jpg'} alt='user' height={50} width={50} className='bg-slate-500 h-[28px] w-[28px] sm:h-[48px] sm:w-[48px] rounded-lg' />
                                {match.Player.toString() !== '6699bfa1ba8348c3228f89ab' ? (
                                    <p className='text-[15px] sm:text-[30px] text-center ml-[6px] rounded-sm'>{match.Opponent.username}5ty76</p>
                                ) : (
                                    <p className='text-[15px] sm:text-[30px] text-center ml-[6px] rounded-sm'>{match.Player.username}</p>
                                )}
                            </div>
                            <p className='text-[14px] text-slate-400 ml-2'>{timeAgo(match.createdAt)}</p>
                            {isAvailableToWatch ? (
                                <a
                                    href={`/play/${match._id}`}
                                    className={`mr-1 px-2 text-[14px] sm:text-[24px] py-[2px] rounded-lg ml-auto shadow-md ${match.type === 'Rank'
                                        ? 'shadow-orange-500 border-b-[3px] sm:border-b-[6px] border-orange-800 bg-orange-600'
                                        : match.type === 'Friendly'
                                            ? 'shadow-purple-500 border-b-[3px] sm:border-b-[6px] border-purple-800 bg-purple-600'
                                            : 'shadow-blue-500 border-b-[3px] sm:border-b-[6px] border-blue-800 bg-blue-600'
                                        }`}
                                >
                                    Watch
                                </a>
                            ) : (
                                <p
                                    className={`mr-1 px-2 text-[14px] sm:text-[24px] py-[2px] rounded-lg ml-auto shadow-md ${match.type === 'Rank'
                                        ? 'shadow-orange-500 border-b-[3px] sm:border-b-[6px] border-orange-800 bg-orange-600'
                                        : match.type === 'Friendly'
                                            ? 'shadow-purple-500 border-b-[3px] sm:border-b-[6px] border-purple-800 bg-purple-600'
                                            : 'shadow-blue-500 border-b-[3px] sm:border-b-[6px] border-blue-800 bg-blue-600'
                                        }`}
                                >
                                    {match.type === 'Rank' ? 'Rank' : match.type === 'Friendly' ? 'Friendly' : 'Classic'}
                                </p>
                            )}
                        </div>)
                })}
                {showSpinner && <section className="flex justify-center items-center w-full">
                    <div ref={ref}>
                        <Image
                            src="/icons/spinner.svg"
                            alt="spinner"
                            width={20}
                            height={20}
                            className="animate-spin"
                        />
                    </div>
                </section>}
            </ScrollArea>
        </section>
    )
}

export default HistoryPage