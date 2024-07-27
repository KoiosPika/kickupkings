import React, { useState } from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from '../ui/alert-dialog'
import Image from 'next/image'
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '../ui/drawer'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Flags } from '@/constants/Flags'
import { changeCountry } from '@/lib/actions/user.actions'

const UserDialog = ({ user }: { user: any }) => {

    const [search, setSearch] = useState('');
    const [filteredFlags, setFilteredFlags] = useState(Flags);
    const [selectedCountry, setSelectedCountry] = useState<any>(null);

    const handleSearchChange = (event: any) => {
        const value = event.target.value.toLowerCase();
        setSearch(value);
        setFilteredFlags(Flags.filter(flag => flag.name.toLowerCase().includes(value)));
    };

    const handleCountrySelect = (flag: any) => {
        setSelectedCountry(flag);
    };

    const handleChangeCountry = async () => {
        await changeCountry('6699bfa1ba8348c3228f89ab', selectedCountry.src)
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                    <Image src={'/PFP.jpg'} alt='user' height={50} width={50} className='bg-slate-500 h-[30px] w-[30px] rounded-lg' />
                    <p className='font-semibold text-white text-[13px]'>{user?.username} ({user?.Rank})</p>
                    <p className='font-semibold text-white text-[13px]'>{`->`}</p>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-slate-800 px-2 border-0 rounded-lg flex flex-col justify-center items-center'>
                <div className='w-10/12 flex flex-orw items-center mt-6'>
                    <Image src={'/PFP.jpg'} alt='user' height={50} width={50} className='bg-slate-500 h-[100px] w-[100px] rounded-lg' />
                    <div className='flex flex-col ml-3 gap-2'>
                        <div className='flex flex-row items-center gap-2'>
                            <p className='font-semibold text-white text-[15px]'>{user?.username}</p>
                            <Drawer>
                                <DrawerTrigger>
                                    <Image src={`/flags/${user?.country}.svg`} alt='flag' height={20} width={20} className='rounded-full bg-white h-[25px] w-[25px]' />
                                </DrawerTrigger>
                                <DrawerContent className='h-[90%] bg-gradient-to-b from-slate-900 to-slate-700'>
                                    <DrawerHeader className='text-white font-semibold text-[18px]'>Find your country</DrawerHeader>
                                    <div className='w-full flex py-2 justify-center items-center'>
                                        <Input className='w-11/12 bg-slate-700 text-white' placeholder='Find country' value={search} onChange={handleSearchChange} />
                                    </div>
                                    <ScrollArea className='h-full'>
                                        <div className='w-full px-2 py-3 grid grid-cols-3 gap-2'>
                                            {filteredFlags.map((flag) => (
                                                <div key={flag.src} className={`bg-slate-900 border-2 ${selectedCountry?.src === flag.src ? 'border-green-500' : 'border-white'} flex flex-col justify-center items-center gap-2 py-2 rounded-md`}
                                                    onClick={() => handleCountrySelect(flag)}>
                                                    <Image src={`/flags/${flag.src}.svg`} alt={flag.name} height={50} width={50} className='rounded-full' />
                                                    <p className='text-white line-clamp-1 px-2'>{flag.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                    <div className='bg-transparent' onClick={handleChangeCountry}>
                                        <p className={`w-full py-2 ${selectedCountry ? 'bg-green-600' : 'bg-gray-500 cursor-not-allowed'} text-white font-semibold text-center`}>Set As Country</p>
                                    </div>
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
                            {user.form.split('').map((result: any, index: number) => (
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
    )
}

export default UserDialog