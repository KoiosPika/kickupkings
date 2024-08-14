import React from 'react'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from 'next/image'

const InviteDialog = ({ userId, total, weekly }: { userId: string, total: number, weekly: number }) => {
    
    const copyLink = () => {
        const link = `https://t.me/football_titans_bot?start=${userId}`
        navigator.clipboard.writeText(link)
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <div className='flex flex-row items-center gap-2 px-2 py-[2px] sm:py-[5px] rounded-md ml-auto mr-2'>
                    <p className='bg-gradient-to-b from-purple-900 to-purple-600 px-2 rounded-lg text-white font-semibold'>+ Invite</p>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-slate-800 px-2 border-0 rounded-lg flex flex-col justify-center items-center'>
                <p className='mt-5 text-white'>Invite friends using the link below</p>
                <div className='w-5/6 bg-gradient-to-b from-slate-600 to-slate-700 rounded-l-lg rounded-r-lg'>
                    <div className='flex flex-row justify-center items-center'>
                        <p className='w-10/12 line-clamp-1 text-white px-2 rounded-l-lg font-semibold'>https://t.me/football_titans_bot/start?startapp=referral={userId}</p>
                        <Image src={'/icons/copy.svg'} alt='copy' height={20} width={20} className='bg-gradient-to-b from-purple-800 to-purple-600 w-2/12 p-4 rounded-r-lg' onClick={copyLink} />
                    </div>
                </div>
                <div className='w-5/6 flex flex-col gap-1 items-center font-semibold text-white text-[14px]'>
                    <div className='flex flex-row w-full justify-center items-center gap-1'>
                        <div className='w-1/2 text-center bg-gradient-to-b from-slate-600 to-slate-700 rounded-tl-lg py-1'>Weekly Referrals</div>
                        <div className='w-1/2 text-center bg-gradient-to-b from-slate-600 to-slate-700 rounded-tr-lg py-1'>Total Referrals</div>
                    </div>
                    <div className='flex flex-row w-full justify-center items-center gap-1'>
                        <div className='w-1/2 text-center bg-gradient-to-b from-slate-600 to-slate-700 rounded-bl-lg py-1'>{weekly}</div>
                        <div className='w-1/2 text-center bg-gradient-to-b from-slate-600 to-slate-700 rounded-br-lg py-1'>{total}</div>
                    </div>
                </div>
                <p className='w-5/6 text-center text-white bg-gradient-to-b from-slate-600 to-slate-700 rounded-lg py-2 font-semibold'>For every weekly referral, you get 5% Coin Increment up to 60 referrals</p>
                <div className='flex flex-row items-center gap-2'>
                    <Image src={'/icons/coin.svg'} alt='coin' height={20} width={20} />
                    <p className='text-white font-semibold'>Current Coin Increment</p>
                </div>
                <p className='text-white font-semibold text-center bg-gradient-to-b from-slate-600 to-slate-700 px-4 py-1 rounded-lg'>5% x {weekly} Weekly Referrals = {5 * weekly}%</p>
                <AlertDialogCancel className='absolute text-white right-2 top-0 bg-transparent border-0'>
                    <Image src={'/icons/x.svg'} alt='coin' height={100} width={100} className='w-[25px] h-[25px] sm:w-[40px] sm:h-[40px]' />
                </AlertDialogCancel>

            </AlertDialogContent>
        </AlertDialog>
    )
}

export default InviteDialog