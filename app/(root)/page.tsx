'use client'

import EarnPage from '@/components/screens/EarnPage';
import HomePage from '@/components/screens/HomePage';
import LineupPage from '@/components/screens/LineupPage';
import PlayPage from '@/components/screens/PlayPage';
import ShopPage from '@/components/screens/ShopPage';
import BottomNavBar from '@/components/shared/BottomNavBar';
import React, { useState } from 'react'

const Page = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'play':
        return <PlayPage />;
      case 'earn':
        return <EarnPage />;
      case 'lineup':
        return <LineupPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className='h-screen w-screen max-w-[700px] flex justify-center items-center bg-slate-700'>
      {renderPage()}
      <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default Page