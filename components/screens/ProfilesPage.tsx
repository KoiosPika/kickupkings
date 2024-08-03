'use client'

import { Profiles } from '@/constants/Profiles'
import { getUserByUserID } from '@/lib/actions/user.actions'
import { IUserData } from '@/lib/database/models/userData.model'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { ScrollArea } from '../ui/scroll-area'

const ProfilesPage = () => {

    const [user, setUser] = useState<IUserData>()
    const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female');

    useEffect(() => {
        const getUser = async () => {
            const userData = await getUserByUserID('6699bfa1ba8348c3228f89ab')
            setUser(userData)
        }

        getUser()
    }, [])

    if (!user) {
        return (
            <section className='w-full h-screen flex flex-col justify-center items-center bg-gradient-to-b from-slate-800 to-gray-600'>
                <Image src={'/icons/spinner.svg'} alt='spinner' height={30} width={30} className='animate-spin' />
            </section>)
    }

    const filteredProfiles = Profiles.filter(profile => profile.type === selectedGender);

    return (
        <div className='w-full h-screen bg-gradient-to-b from-slate-900 to-gray-700'>
            <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                <Image src={'/PFP.jpg'} alt='user' height={50} width={50} className='bg-slate-500 h-[30px] w-[30px] rounded-lg' />
                <p className='font-semibold text-white text-[13px]'>{user?.User.username} ({user?.Rank})</p>
                <Image src={'/icons/diamond.svg'} alt='coin' height={100} width={100} className='w-[25px] h-[25px] sm:w-[40px] sm:h-[40px] ml-auto' />
                <p className='font-bold text-white text-[16px] sm:text-[22px]'>{user?.diamonds}</p>
            </div>

            <div className="flex flex-row justify-center items-center mt-4 w-full">
                <div className='w-4/5 flex flex-row bg-white rounded-md font-semibold border-[1px] border-white'>
                    <button
                        className={`w-1/2 gap-2 flex justify-center items-center px-3 py-1 bg-gradient-to-b ${selectedGender === 'male' ? 'from-blue-800 to-blue-600' : 'bg-white'} text-white rounded-l-md`}
                        onClick={() => setSelectedGender('male')}
                    >
                        <Image src={'/icons/male.svg'} alt='male' height={18} width={18}/>
                        <p>Male</p>
                    </button>
                    <button
                        className={`w-1/2 gap-2 flex justify-center items-center px-3 py-1 bg-gradient-to-b ${selectedGender === 'female' ? 'from-red-800 to-red-600' : 'bg-white'} text-white rounded-r-md`}
                        onClick={() => setSelectedGender('female')}
                    >
                        <Image src={'/icons/female.svg'} alt='male' height={16} width={16}/>
                        <p>Female</p>
                    </button>
                </div>
            </div>

            <ScrollArea className='h-[85%]'>
                <div className="mt-4 grid grid-cols-3 px-5 gap-4">
                    {filteredProfiles.map(profile => (
                        <Image
                            key={profile.id}
                            src={`https://drive.google.com/uc?export=view&id=${profile.id}`}
                            alt={profile.type}
                            width={100}
                            height={100}
                            className="rounded-lg"
                        />
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

export default ProfilesPage