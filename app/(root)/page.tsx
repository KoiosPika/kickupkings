'use client'

import EarnPage from '@/components/screens/EarnPage';
import HomePage from '@/components/screens/HomePage';
import LineupPage from '@/components/screens/LineupPage';
import PlayPage from '@/components/screens/PlayPage';
import ShopPage from '@/components/screens/ShopPage';
import BottomNavBar from '@/components/shared/BottomNavBar';
import useTelegram from '@/hooks/useTelegram';
import { IUser } from '@/lib/database/models/user.model';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { isLoggedIn, loading, telegramId, chatId, currentUser } = useTelegram();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push(`/create-account/${telegramId} - ${chatId}`);
    }
  }, [loading, isLoggedIn, router]);

  if (loading) {
    return (
      <section className='w-full h-screen flex flex-col justify-center items-center bg-gradient-to-b from-slate-800 to-gray-600'>
        <Image src={'/icons/spinner.svg'} alt='spinner' height={30} width={30} className='animate-spin' />
      </section>
    );
  }

  const renderPage = (currentUser: IUser) => {
    switch (currentPage) {
      case 'home':
        return <HomePage userId={currentUser._id} />;
      case 'shop':
        return <ShopPage userId={currentUser._id} />;
      case 'play':
        return <PlayPage userId={currentUser._id} />;
      case 'earn':
        return <EarnPage userId={currentUser._id} />;
      case 'lineup':
        return <LineupPage userId={currentUser._id} />;
      default:
        return <HomePage userId={currentUser._id} />;
    }
  };

  if (isLoggedIn) {
    return (
      <div className='h-screen w-screen max-w-[700px] flex justify-center items-center bg-gradient-to-b from-slate-900 to-gray-600'>
        {currentUser && renderPage(currentUser)}
        <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    )
  }
}

export default Page