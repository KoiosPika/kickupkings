import Image from 'next/image'
import React from 'react'
import { Input } from '../ui/input'

const EarnPage = () => {
  return (
    <section className='w-full h-screen'>
      <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
        <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] rounded-lg' />
        <p className='font-semibold text-white text-[13px]'>Rami (Amature)</p>
        <p className='font-semibold text-white text-[13px]'>{`->`}</p>
      </div>
      <div className='w-full flex flex-col justify-center items-center'>
        <p className='font-semibold text-white text-[20px] mt-2'>Daily Quiz</p>
        <div className='my-2 flex flex-row items-center gap-2'>
          <p className='font-semibold text-white'>Find the quiz on Telegram Channel</p>
          <Image src={'/icons/link.svg'} alt='link' height={100} width={100} className='bg-white h-[25px] w-[25px] p-1 rounded-md'/>
        </div>
        <div className='w-11/12 flex flex-row gap-2 items-center justify-center'>
          <Input className='font-bold text-center text-[16px] bg-slate-800 text-white border-2 border-white' />
          <Input className='font-bold text-center text-[16px] bg-slate-800 text-white border-2 border-white' />
          <Input className='font-bold text-center text-[16px] bg-slate-800 text-white border-2 border-white' />
          <Input className='font-bold text-center text-[16px] bg-slate-800 text-white border-2 border-white' />
          <Input className='font-bold text-center text-[16px] bg-slate-800 text-white border-2 border-white' />
          <Input className='font-bold text-center text-[16px] bg-slate-800 text-white border-2 border-white' />
          <Input className='font-bold text-center text-[16px] bg-slate-800 text-white border-2 border-white' />
        </div>
      </div>
    </section>
  )
}

export default EarnPage