import { Ranks } from '@/constants'
import { getUserByUserID } from '@/lib/actions/user.actions'
import { IUserData } from '@/lib/database/models/userData.model'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const HomePage = () => {

    const [user, setUser] = useState<IUserData>()

    useEffect(() => {
        const getUser = async () => {
            const userData = await getUserByUserID('6699bfa1ba8348c3228f89ab')
            setUser(userData)
        }

        getUser();
    }, [])

    function getMaxPointsForRank(rank: string) {
        const rankObj = Ranks.find(r => r.rank === rank);
        return rankObj ? rankObj.maxPoints : 0;
    }

    const maxPoints = getMaxPointsForRank(user?.Rank || '');

    const progress = maxPoints > 0 ? ((user?.points || 0) / maxPoints) * 100 : 0;

    if (!user) {
        return (<Image src={'/icons/spinner.svg'} alt='spinner' height={30} width={30} className='animate-spin' />)
    }


    return (
        <section className='w-full h-screen'>
            <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] rounded-lg' />
                <p className='font-semibold text-white text-[13px]'>Rami ({user?.Rank})</p>
                <p className='font-semibold text-white text-[13px]'>{`->`}</p>
            </div>
            <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                <div className='w-1/2 bg-slate-800 flex flex-col justify-center items-center rounded-lg h-[53px] sm:h-[75px] gap-[3px]'>
                    {user && <p className='font-bold text-white text-[13px] sm:text-[22px]'>{user?.points} / {maxPoints}</p>}
                    {user && <div className='w-11/12 flex flex-row items-center'>
                        <div style={{ width: `${progress}%` }} className='h-[5px] sm:h-[10px] rounded-l-lg bg-orange-600' />
                        <div style={{ width: `${100 - progress}%` }} className='h-[5px] sm:h-[10px] rounded-r-lg bg-orange-300' />
                    </div>}
                </div>
                <div className='w-1/2 bg-slate-800 flex flex-row gap-2 justify-center items-center rounded-lg h-[53px] sm:h-[75px]'>
                    <p className='font-bold text-white text-[16px] sm:text-[22px]'>Team Overall:</p>
                    <p className='font-bold text-green-500'>{(user?.teamOverall).toFixed(2)}</p>
                </div>
            </div>
            <div className='w-full flex flex-col justify-center items-center'>
                <p className='mr-auto ml-5 text-white font-semibold my-1'>Football News</p>
                <div className='w-11/12 bg-slate-800 h-[110px] rounded-lg flex justify-center items-center'>
                    <p className='font-bold text-white'>AD</p>
                </div>
                <p className='mr-auto ml-5 text-white font-semibold mt-3 mb-1'>Football Products</p>
                <div className='w-11/12 bg-slate-800 h-[110px] rounded-lg flex justify-center items-center'>
                    <p className='font-bold text-white'>AD</p>
                </div>
                <p className='mr-auto ml-5 text-white font-semibold mt-3 mb-1'>Merch</p>
                <div className='w-11/12 bg-slate-800 h-[110px] rounded-lg flex justify-center items-center'>
                    <p className='font-bold text-white'>AD</p>
                </div>
            </div>
        </section>
    )
}

export default HomePage