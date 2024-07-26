import { Ranks } from '@/constants'
import { getUserByUserID } from '@/lib/actions/user.actions'
import { IUserData } from '@/lib/database/models/userData.model'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '../ui/drawer'
import { Flags } from '@/constants/Flags'
import { ScrollArea } from '../ui/scroll-area'
import { Input } from '../ui/input'

const HomePage = () => {

    const [user, setUser] = useState<any>()

    useEffect(() => {
        const getUser = async () => {
            const userData = await getUserByUserID('6699bfa1ba8348c3228f89ab')
            setUser(userData)
        }

        getUser();
    }, [])

    const getRankData = (rank: any) => Ranks.find(r => r.rank === rank);
    const getPreviousRankData = (currentRank: any) => {
        const index = Ranks.findIndex(r => r.rank === currentRank);
        return index > 0 ? Ranks[index - 1] : null;
    };

    const calculateProgress = (userRank: string, userPoints: number) => {
        const currentRankData = getRankData(userRank);
        const previousRankData = getPreviousRankData(userRank);

        if (!currentRankData) return 0;

        const previousMaxPoints = previousRankData ? previousRankData.maxPoints : 0;
        const rangeInCurrentRank = currentRankData.maxPoints - previousMaxPoints;
        const pointsInCurrentRank = userPoints - previousMaxPoints;

        const progress = (pointsInCurrentRank / rangeInCurrentRank) * 100;

        return progress;
    };

    // Usage in your component
    const maxPoints = getRankData(user?.Rank || '')?.maxPoints || 0;
    const progress = calculateProgress(user?.Rank || '', user?.points || 0);

    if (!user) {
        return (<Image src={'/icons/spinner.svg'} alt='spinner' height={30} width={30} className='animate-spin' />)
    }

    let form = 'WLLWW';


    return (
        <section className='w-full h-screen bg-gradient-to-b from-slate-900 to-gray-600'>
            <AlertDialog>
                <AlertDialogTrigger>
                    <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                        <Image src={'/PFP.jpg'} alt='user' height={50} width={50} className='bg-slate-500 h-[30px] w-[30px] rounded-lg' />
                        <p className='font-semibold text-white text-[13px]'>{user?.User.username} ({user?.Rank})</p>
                        <p className='font-semibold text-white text-[13px]'>{`->`}</p>
                    </div>
                </AlertDialogTrigger>
                <AlertDialogContent className='bg-slate-800 px-2 border-0 rounded-lg flex flex-col justify-center items-center'>
                    <div className='w-10/12 flex flex-orw items-center mt-6'>
                        <Image src={'/PFP.jpg'} alt='user' height={50} width={50} className='bg-slate-500 h-[100px] w-[100px] rounded-lg' />
                        <div className='flex flex-col ml-3 gap-2'>
                            <div className='flex flex-row items-center gap-2'>
                                <p className='font-semibold text-white text-[15px]'>{user?.User.username}</p>
                                <Drawer>
                                    <DrawerTrigger>
                                        <Image src={'/flags/mx.svg'} alt='flag' height={20} width={20} className='rounded-full bg-white' />
                                    </DrawerTrigger>
                                    <DrawerContent className='h-[90%] bg-gradient-to-b from-slate-900 to-slate-700'>
                                        <DrawerHeader className='text-white font-semibold text-[18px]'>Find your country</DrawerHeader>
                                        <div className='w-full flex py-2 justify-center items-center'>
                                            <Input className='w-11/12 bg-slate-700 text-white' placeholder='Find country' />
                                        </div>
                                        <ScrollArea className='h-full'>
                                            <div className='w-full px-2 py-3 grid grid-cols-3 gap-2'>
                                                {Flags.map((flag) => (
                                                    <div key={flag.src} className='bg-slate-900 border-2 border-white flex flex-col justify-center items-center gap-2 py-2 rounded-md'>
                                                        <Image src={`/flags/${flag.src}.svg`} alt={flag.src} height={50} width={50} className='rounded-full' />
                                                        <p className='text-white line-clamp-1 px-2'>{flag.name}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                            <p className='font-semibold text-white text-[15px]'>{user?.Rank}</p>
                            <p className='font-semibold text-white text-[15px]'>Overall: {(user?.teamOverall).toFixed(2)}</p>
                        </div>
                    </div>
                    <div className='w-11/12 px-4 py-1 flex flex-row items-center gap-2 bg-slate-900 rounded-lg text-white font-semibold text-[13px]'>
                        <p>Instagram: ramimalass</p>
                    </div>
                    <div className='w-11/12 flex items-center gap-1'>
                        <div className='w-2/5 flex flex-col h-[60px] sm:h-[80px] gap-[3px]'>
                            <div className='w-full bg-slate-900 text-white text-center font-semibold rounded-tl-lg h-1/2 flex justify-center items-center'>
                                <p className='text-[16px] sm:text-[20px]'>Form</p>
                            </div>
                            <div className='w-full bg-slate-900 text-white text-center font-semibold rounded-bl-lg flex flex-row items-center justify-center gap-1 h-1/2'>
                                {form.split('').map((result: any, index: number) => (
                                    <p
                                        key={index}
                                        className={`rounded-sm w-1/6 text-[13px] sm:text-[18px] ${result === 'W' ? 'bg-green-600' : 'bg-red-600'}`}
                                    >
                                        {result}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className='w-1/5 flex flex-col h-[60px] sm:h-[80px] gap-[3px]'>
                            <div className='w-full bg-slate-900 text-white text-center font-semibold h-1/2 flex justify-center items-center'>
                                <p className='text-[16px] sm:text-[20px]'>Played</p>
                            </div>
                            <div className='w-full bg-slate-900 text-white text-center font-semibold h-1/2 flex justify-center items-center'>
                                <p className='text-[16px] sm:text-[20px]'>{user && user?.played}</p>
                            </div>
                        </div>
                        <div className='w-1/5 flex flex-col h-[60px] sm:h-[80px] gap-[3px]'>
                            <div className='w-full bg-slate-900 text-white text-center font-semibold h-1/2 flex justify-center items-center'>
                                <p className='text-[16px] sm:text-[20px]'>Won</p>
                            </div>
                            <div className='w-full bg-slate-900 text-white text-center font-semibold h-1/2 flex justify-center items-center'>
                                <p className='text-[16px] sm:text-[20px]'>{user && user?.won}</p>
                            </div>
                        </div>
                        <div className='w-1/5 flex flex-col h-[60px] sm:h-[80px] gap-[3px]'>
                            <div className='w-full bg-slate-900 text-white text-center font-semibold rounded-tr-lg h-1/2 flex justify-center items-center'>
                                <p className='text-[16px] sm:text-[20px]'>Rate</p>
                            </div>
                            <div className='w-full bg-slate-900 text-green-500 text-center font-semibold rounded-br-lg h-1/2 flex justify-center items-center'>
                                <p className='text-[16px] sm:text-[20px]'>%{user && ((user?.won / user?.played) * 100).toFixed(1)}</p>
                            </div>
                        </div>
                    </div>
                    <AlertDialogCancel className='absolute text-white right-2 top-0 bg-transparent border-0'>
                        <Image src={'/icons/x.svg'} alt='coin' height={100} width={100} className='w-[25px] h-[25px] sm:w-[40px] sm:h-[40px]' />
                    </AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>
            <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                <div className='w-1/2 bg-slate-800 flex flex-col justify-center items-center rounded-lg h-[53px] sm:h-[75px] gap-[3px]'>
                    <div className='flex flex-row items-center gap-2'>
                        <Image src={'/icons/Ballon Dor.png'} alt='dor' height={20} width={20} />
                        {user && <p className='font-bold text-white text-[13px] sm:text-[22px]'>{user?.points} / {maxPoints}</p>}
                    </div>
                    {user && <div className='w-11/12 flex flex-row items-center mt-1'>
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