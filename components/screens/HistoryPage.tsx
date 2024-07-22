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
    return (
        <section className='w-full h-screen flex flex-col bg-slate-800'>
            <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                <a href='/' className='bg-slate-500 py-2 px-3 rounded-md text-white font-bold'>
                    <Image src={'/icons/back.svg'} alt='back' height={10} width={10}/>
                </a>
                <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] rounded-md' />
                <p className='font-semibold text-white text-[13px]'>Rami ({user?.Rank})</p>
                <p className='font-semibold text-white text-[13px]'>{`->`}</p>
                <div className='flex flex-row items-center gap-2 bg-slate-800 px-2 py-[2px] sm:py-[5px] rounded-md ml-auto mr-2'>
                    <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]' />
                    <p className='font-semibold text-white text-[16px] sm:text-[25px]'>{user && user?.coins}</p>
                </div>
            </div>
            <ScrollArea className='flex flex-col gap-1 sm:gap-4 my-2 h-[95%]'>
                {matches && matches.map((match: IMatch, index: number) => (
                    <div key={index} className='text-white font-semibold bg-slate-800 p-2 rounded-lg flex flex-row items-center gap-1 sm:gap-5'>
                        {match.winner.toString() != '6699bfa1ba8348c3228f89ab' && <p className='h-[25px] w-[30px] sm:h-[45px] sm:w-[50px] text-[16px] sm:text-[30px] text-center bg-red-600 rounded-sm'>L</p>}
                        {match.winner.toString() == '6699bfa1ba8348c3228f89ab' && <p className='h-[25px] w-[30px] sm:h-[45px] sm:w-[50px] text-[16px] sm:text-[30px] text-center bg-green-600 rounded-sm'>W</p>}
                        <p className='ml-2 text-[16px] sm:text-[30px]'>4-1</p>
                        <div className='ml-5 flex flex-row items-center bg-slate-900 px-2 py-1 rounded-lg'>
                            <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[28px] w-[28px] sm:h-[48px] sm:w-[48px] rounded-lg' />
                            <p className='ml-2 max-w-[80px] sm:max-w-[200px] text-[16px] sm:text-[24px] overflow-hidden'>username</p>
                        </div>
                        {match.type === 'Rank' && <p className='bg-orange-600 px-2 text-[14px] sm:text-[24px] py-[2px] rounded-lg ml-auto shadow-md shadow-orange-500 border-b-[3px] sm:border-b-[6px] border-orange-800'>Rank</p>}
                        {match.type === 'Friendly' && <p className='bg-purple-700 px-2 text-[14px] sm:text-[24px] py-[2px] rounded-lg ml-auto shadow-md shadow-purple-500 border-b-[3px] sm:border-b-[6px] border-purple-800'>Friendly</p>}
                    </div>))}
            </ScrollArea>
        </section>
    )
}

export default HistoryPage