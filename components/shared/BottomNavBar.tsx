'use client'
import Image from 'next/image';
import React from 'react';

interface BottomNavBarProps {
    currentPage: string;
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const BottomNavBar = ({ currentPage, setCurrentPage }: BottomNavBarProps) => {
    return (
        <nav className="fixed bottom-0 w-11/12 mb-1 max-w-[480px] bg-slate-600 flex justify-around items-center p-2 shadow-md rounded-lg">
            <button
                className={`text-sm w-1/6 py-1 flex flex-col justify-center items-center gap-1 ${currentPage === 'home' ? 'bg-yellow-400 rounded-xl text-black' : 'text-white'}`}
                onClick={() => setCurrentPage('home')}
            >
                <Image src={currentPage === 'home' ? '/icons/Home-black.svg' : '/icons/Home-white.svg'} alt='home' height={20} width={20} />
                <p className='text-xs font-bold'>Home</p>
            </button>
            <button
                className={`text-sm w-1/6 py-1 flex flex-col justify-center items-center gap-1 ${currentPage === 'shop' ? 'bg-yellow-400 rounded-xl text-black' : 'text-white'}`}
                onClick={() => setCurrentPage('shop')}
            >
                <Image src={currentPage === 'shop' ? '/icons/Shop-black.svg' : '/icons/Shop-white.svg'} alt='shop' height={20} width={20} />
                <p className='text-xs font-bold'>Shop</p>
            </button>
            <button
                className={`text-sm w-1/6 py-1 flex flex-col justify-center items-center gap-1 ${currentPage === 'play' ? 'bg-yellow-400 rounded-xl text-black' : 'text-white'}`}
                onClick={() => setCurrentPage('play')}
            >
                <Image src={currentPage === 'play' ? '/icons/Football-black.svg' : '/icons/Football-white.svg'} alt='play' height={20} width={20} />
                <p className='text-xs font-bold'>Play</p>
            </button>
            <button
                className={`text-sm w-1/6 py-1 flex flex-col justify-center items-center gap-1 ${currentPage === 'earn' ? 'bg-yellow-400 rounded-xl text-black' : 'text-white'}`}
                onClick={() => setCurrentPage('earn')}
            >
                <Image src={currentPage === 'earn' ? '/icons/Money-black.svg' : '/icons/Money-white.svg'} alt='earn' height={20} width={20}/>
                <p className='text-xs font-bold'>Earn</p>
            </button>
            <button
                className={`text-sm w-1/6 py-1 flex flex-col justify-center items-center gap-1 ${currentPage === 'lineup' ? 'bg-yellow-400 rounded-xl text-black' : 'text-white'}`}
                onClick={() => setCurrentPage('lineup')}
            >
                <Image src={currentPage === 'lineup' ? '/icons/Lineup-black.svg' : '/icons/Lineup-white.svg'} alt='lineup' height={20} width={20}/>
                <p className='text-xs font-bold'>Lineup</p>
            </button>
        </nav>
    );
};

const styles = {
    nav: {
        position: 'fixed',
        bottom: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        background: '#fff',
        padding: '10px 0',
        boxShadow: '0 -1px 5px rgba(0, 0, 0, 0.1)',
    },
    button: {
        background: 'none',
        border: 'none',
        color: '#000',
        fontSize: '16px',
    },
    activeButton: {
        background: 'none',
        border: 'none',
        color: '#0070f3',
        fontSize: '16px',
    },
};

export default BottomNavBar;
