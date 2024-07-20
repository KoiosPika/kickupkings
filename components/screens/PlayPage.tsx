import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { formations } from '@/constants/Formations'
import { positions } from '@/constants'
import { createUser, getUserByUserID } from '@/lib/actions/user.actions'
import { IUserData } from '@/lib/database/models/userData.model'

const colors = [
  { 'Forward': '#EE2E0C' },
  { 'Midfield': '#EE9F0C' },
  { 'Defense': '#0090DE' },
  { 'Goalkeeper': '#41B815' },
]

const PlayPage = () => {

  const [height, setHeight] = useState<number>(window.innerHeight)
  const [user, setUser] = useState<IUserData>()

  useEffect(() => {
    const updateHeights = () => {
      setHeight(window.innerHeight);
      document.documentElement.style.setProperty('--dynamic-height', `calc(${window.innerHeight}px - 420px)`);
      document.documentElement.style.setProperty('--dynamic-height-sm', `calc(${window.innerHeight}px - 630px)`);
    };

    window.addEventListener('resize', updateHeights);
    updateHeights();

    return () => window.removeEventListener('resize', updateHeights);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const userData = await getUserByUserID('6699bfa1ba8348c3228f89ab')
      setUser(userData)
    }

    getUser();
  }, [])

  const formation = {
    id: '4-1-2-1-2',
    data: [
      { positions: ['', 'LST', 'RST', ''], type: 'Forward' },
      { positions: [''], type: 'Forward' },
      { positions: ['CAM'], type: 'Midfield' },
      { positions: ['LM', '', 'RM'], type: 'Midfield' },
      { positions: ['CDM'], type: 'Midfield' },
      { positions: [''], type: 'Midfield' },
      { positions: ['LB', 'LCB', 'RCB', 'RB'], type: 'Defense' },
      { positions: [''], type: 'Goalkeeper' },
      { positions: ['GK'], type: 'Goalkeeper' }
    ]
  }

  const getColor = (type: any, position: any) => {
    if (!position) {
      return '';
    }
    const colorObj: any = colors.find((color: any) => color[type]);
    return colorObj ? colorObj[type] : '';
  };

  return (
    <section className='w-full h-screen flex flex-col'>
      <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
        <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] rounded-md' />
        <p className='font-semibold text-white text-[13px]'>Rami (Amature)</p>
        <p className='font-semibold text-white text-[13px]'>{`->`}</p>
        <div className='flex flex-row items-center gap-2 bg-slate-800 px-2 py-[2px] sm:py-[5px] rounded-md ml-auto mr-2'>
          <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]' />
          <p className='font-semibold text-white text-[16px] sm:text-[25px]'>{user && user?.coins}</p>
        </div>
      </div>
      <div className='w-full flex justify-center items-center'>
        <div className='w-11/12 flex items-center gap-1'>
          <div className='w-2/5 flex flex-col h-[60px] sm:h-[80px] gap-[3px]'>
            <div className='w-full bg-slate-800 text-white text-center font-semibold rounded-tl-lg h-1/2 flex justify-center items-center'>
              <p className='text-[16px] sm:text-[20px]'>Form</p>
            </div>
            <div className='w-full bg-slate-800 text-white text-center font-semibold rounded-bl-lg flex flex-row items-center justify-center gap-1 h-1/2'>
              <p className='rounded-sm bg-green-600 w-1/6 text-[13px] sm:text-[18px]'>W</p>
              <p className='rounded-sm bg-red-600 w-1/6   text-[13px] sm:text-[18px]'>L</p>
              <p className='rounded-sm bg-green-600 w-1/6 text-[13px] sm:text-[18px]'>W</p>
              <p className='rounded-sm bg-green-600 w-1/6 text-[13px] sm:text-[18px]'>W</p>
              <p className='rounded-sm bg-red-600 w-1/6   text-[13px] sm:text-[18px]'>L</p>
            </div>
          </div>
          <div className='w-1/5 flex flex-col h-[60px] sm:h-[80px] gap-[3px]'>
            <div className='w-full bg-slate-800 text-white text-center font-semibold h-1/2 flex justify-center items-center'>
              <p className='text-[16px] sm:text-[20px]'>Played</p>
            </div>
            <div className='w-full bg-slate-800 text-white text-center font-semibold h-1/2 flex justify-center items-center'>
              <p className='text-[16px] sm:text-[20px]'>{user && user?.played}</p>
            </div>
          </div>
          <div className='w-1/5 flex flex-col h-[60px] sm:h-[80px] gap-[3px]'>
            <div className='w-full bg-slate-800 text-white text-center font-semibold h-1/2 flex justify-center items-center'>
              <p className='text-[16px] sm:text-[20px]'>Won</p>
            </div>
            <div className='w-full bg-slate-800 text-white text-center font-semibold h-1/2 flex justify-center items-center'>
              <p className='text-[16px] sm:text-[20px]'>{user && user?.won}</p>
            </div>
          </div>
          <div className='w-1/5 flex flex-col h-[60px] sm:h-[80px] gap-[3px]'>
            <div className='w-full bg-slate-800 text-white text-center font-semibold rounded-tr-lg h-1/2 flex justify-center items-center'>
              <p className='text-[16px] sm:text-[20px]'>Lost</p>
            </div>
            <div className='w-full bg-slate-800 text-white text-center font-semibold rounded-br-lg h-1/2 flex justify-center items-center'>
              <p className='text-[16px] sm:text-[20px]'>{user && user?.lost}</p>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full flex flex-col justify-center items-center mt-2'>
        <div className='w-11/12'>
          <div className='flex flex-row items-center w-full'>
            <p className='text-white font-semibold bg-slate-800 px-3 py-1 inline-flex rounded-lg text-[16px] sm:text-[22px]'>History</p>
            <p className='text-white font-semibold bg-slate-800 px-3 py-1 inline-flex rounded-lg text-[12px] sm:text-[22px] ml-auto mt-auto'>View All {`->`}</p>
          </div>
          <div className='flex flex-col gap-1 sm:gap-4 my-2'>
            <div className='text-white font-semibold bg-slate-800 p-2 rounded-lg flex flex-row items-center gap-1 sm:gap-5'>
              <p className='h-[25px] w-[30px] sm:h-[45px] sm:w-[50px] text-[16px] sm:text-[30px] text-center bg-red-600 rounded-sm'>L</p>
              <p className='ml-2 text-[16px] sm:text-[30px]'>4-1</p>
              <div className='ml-5 flex flex-row items-center bg-slate-900 px-2 py-1 rounded-lg'>
                <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[28px] w-[28px] sm:h-[48px] sm:w-[48px] rounded-lg' />
                <p className='ml-2 max-w-[80px] sm:max-w-[200px] text-[16px] sm:text-[24px] overflow-hidden'>username</p>
              </div>
              <p className='bg-purple-700 px-2 text-[14px] sm:text-[24px] py-[2px] rounded-lg ml-auto shadow-md shadow-purple-500 border-b-[3px] sm:border-b-[6px] border-purple-800'>Rematch</p>
            </div>
            <div className='text-white font-semibold bg-slate-800 p-2 rounded-lg flex flex-row items-center gap-1 sm:gap-5'>
              <p className='h-[25px] w-[30px] sm:h-[45px] sm:w-[50px] text-[16px] sm:text-[30px] text-center bg-green-600 rounded-sm'>W</p>
              <p className='ml-2 text-[16px] sm:text-[30px]'>4-2</p>
              <div className='ml-5 flex flex-row items-center bg-slate-900 px-2 py-1 rounded-lg'>
                <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[28px] w-[28px] sm:h-[48px] sm:w-[48px] rounded-lg' />
                <p className='ml-2 max-w-[80px] sm:max-w-[200px] text-[16px] sm:text-[24px] overflow-hidden'>username</p>
              </div>
              <p className='bg-purple-700 px-2 text-[14px] sm:text-[24px] py-[2px] rounded-lg ml-auto shadow-md shadow-purple-500 border-b-[3px] sm:border-b-[6px] border-purple-800'>Rematch</p>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full flex flex-col justify-center items-center mt-2'>
        <div className='bg-blue-500 px-3 py-2 font-semibold text-white rounded-xl shadow-blue-600 shadow-lg border-b-[4px] sm:border-b-[8px] border-blue-800 flex flex-row items-center gap-1'>
          <p className='text-[18px] sm:text-[34px] mx-2'>Find Match</p>
          <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]' />
          <p className='font-semibold text-white text-[16px] sm:text-[25px]'>10</p>
        </div>
      </div>
      <div className='w-full flex flex-col h-full justify-center items-center flex-grow mt-3'>
        <div className='w-11/12 flex flex-row items-center h-full gap-2'>
          <div className='h-full w-1/2 flex flex-col justify-around rounded-md bg-slate-800 border-[1px] sm:border-4 border-white' style={{ backgroundImage: `url('/Field-dark.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {user && formations.find(f => f.id === user?.formation)?.data.map((row, rowIndex) => (
              <div key={rowIndex} className='flex justify-around'>
                {row.positions.map((position: any, posIndex) => (
                  <div key={posIndex} className='p-1 sm:px-3 sm:py-1 rounded-sm text-white font-semibold border-white' style={{ backgroundColor: getColor(row.type, row.positions[posIndex]), borderWidth: row.positions[posIndex] ? 2 : 0, boxShadow: position ? `-8px -8px 10px -4px ${getColor(row.type, row.positions[posIndex])},-8px 8px 10px -4px ${getColor(row.type, row.positions[posIndex])},8px -8px 10px -4px ${getColor(row.type, row.positions[posIndex])},8px 8px 10px -4px ${getColor(row.type, row.positions[posIndex])}` : '' }}>
                    <p className='text-[10px] sm:text-[20px]'>{position}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className='w-1/2 flex flex-col justify-around rounded-md scroll-area'>
            <ScrollArea>
              <div className='flex flex-col gap-1 w-full'>
                <div className='bg-slate-800 p-2 sm:p-4 rounded-lg'>
                  <div className='flex flex-row items-center'>
                    <p className='inline-flex py-1 px-2 text-white font-semibold rounded-md text-[16px] sm:text-[25px]'>Overall</p>
                    {/* <p className='ml-auto mr-2 text-green-500 font-bold'>Ready</p> */}
                    <p className='ml-auto mr-2 text-green-500 font-bold text-[15px] sm:text-[22px]'>2.6</p>
                  </div>
                </div>
                {positions.map((position: any) => (
                  <div key={position.symbol} className='bg-slate-800 p-2 sm:p-4 rounded-lg'>
                    <div className='flex flex-row items-center'>
                      <p style={{ backgroundColor: position.color }} className='inline-flex py-1 px-2 text-white font-semibold rounded-md text-[13px] sm:text-[25px]'>{position.symbol}</p>
                      <div className='ml-auto mr-2 text-yellow-500 font-bold flex flex-col'>
                        <p className='text-[12px] sm:text-[22px]'>Ready 7/8</p>
                        <p className='text-[10px] sm:text-[20px] ml-auto'>15m</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
      <div className='h-[260px]' />
    </section>
  )
}

export default PlayPage