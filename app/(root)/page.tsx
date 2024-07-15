'use client'

import HomePage from '@/components/screens/HomePage';
import Page1 from '@/components/screens/Page1';
import Page2 from '@/components/screens/Page2';
import BottomNavBar from '@/components/shared/BottomNavBar';
import React, { useState } from 'react'

const Page = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'page1':
        return <Page1 />;
      case 'page2':
        return <Page2 />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className='h-screen w-screen max-w-[500px] flex justify-center items-center'>
      {renderPage()}
      <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default Page