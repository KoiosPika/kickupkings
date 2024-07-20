'use client'

import { getUserByUserID } from '@/lib/actions/user.actions'
import { IUserData } from '@/lib/database/models/userData.model'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const HistoryPage = () => {
    const [user, setUser] = useState<IUserData>()

    useEffect(() => {
        const getUser = async () => {
          const userData = await getUserByUserID('6699bfa1ba8348c3228f89ab')
          setUser(userData)
        }
    
        getUser();
      }, [])
    return (
        <section className='w-full h-screen flex flex-col bg-slate-800'>
            <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                <a href='/' className='bg-slate-500 px-2 rounded-md text-white font-bold'>{`<`}</a>
                <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] rounded-md' />
                <p className='font-semibold text-white text-[13px]'>Rami ({user?.Rank})</p>
                <p className='font-semibold text-white text-[13px]'>{`->`}</p>
                <div className='flex flex-row items-center gap-2 bg-slate-800 px-2 py-[2px] sm:py-[5px] rounded-md ml-auto mr-2'>
                    <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]' />
                    <p className='font-semibold text-white text-[16px] sm:text-[25px]'>{user && user?.coins}</p>
                </div>
            </div>
        </section>
    )
}

export default HistoryPage