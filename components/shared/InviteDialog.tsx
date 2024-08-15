import React, { useEffect, useState } from 'react'
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

    const calculateTimeLeft = () => {
        const difference = +new Date('2024-08-21T12:00:00Z') - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        } else {
            timeLeft = {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer); // Cleanup the interval on component unmount
    }, []);

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
            <AlertDialogContent className='bg-gradient-to-b from-slate-800 to-slate-700 px-2 border-0 rounded-lg flex flex-col justify-center items-center'>
                <p className='mt-5 text-white text-[17px]'>Invite Friends</p>
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
                <p className='w-5/6 text-center text-white bg-gradient-to-b from-slate-600 to-slate-700 rounded-lg py-2 px-[2px] font-semibold text-[14px]'>For every weekly referral, you get 10% Prize Increment up to 30 referrals</p>
                <div className='flex flex-row items-center gap-2'>
                    <Image src={'/icons/coin.svg'} alt='coin' height={20} width={20} />
                    <p className='text-white font-semibold text-[14px]'>Current Prizes Increment</p>
                    <Image src={'/icons/diamond.svg'} alt='coin' height={20} width={20} />
                </div>
                <p className='text-white font-semibold text-center bg-gradient-to-b from-slate-600 to-slate-700 px-4 py-1 rounded-lg text-[14px]'>10% x {weekly} Weekly Referrals = {10 * weekly}%</p>
                <p className='text-white text-[14px]'>Weekly referrals resets every 2 weeks</p>
                <div className="text-white text-[14px]">
                    {timeLeft.days || timeLeft.hours || timeLeft.minutes || timeLeft.seconds ? (
                        <>
                            <p>Time until weekly referrals resets:</p>
                            <p className='text-center mt-1 bg-slate-800 py-1 rounded-lg font-semibold'>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</p>
                        </>
                    ) : (
                        <p>Reset period has started!</p>
                    )}
                </div>
                <AlertDialogCancel className='absolute text-white right-2 top-0 bg-transparent border-0'>
                    <Image src={'/icons/x.svg'} alt='coin' height={100} width={100} className='w-[25px] h-[25px] sm:w-[40px] sm:h-[40px]' />
                </AlertDialogCancel>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default InviteDialog