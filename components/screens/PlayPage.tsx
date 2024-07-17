import Image from 'next/image'
import React from 'react'

const PlayPage = () => {
  return (
    <section className='w-full h-screen'>
      <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
        <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] rounded-lg' />
        <p className='font-semibold text-white text-[13px]'>Rami (Amature)</p>
        <p className='font-semibold text-white text-[13px]'>{`->`}</p>
      </div>
      <div className='w-full flex justify-center items-center'>
        <div className='w-11/12 flex items-center gap-1'>
          <div className='w-2/5 flex flex-col h-[60px] gap-[3px]'>
            <div className='w-full bg-slate-800 text-white text-center font-semibold rounded-tl-lg h-1/2 flex justify-center items-center'>
              <p>Form</p>
            </div>
            <div className='w-full bg-slate-800 text-white text-center font-semibold rounded-bl-lg flex flex-row items-center justify-center gap-1 h-1/2'>
              <p className='rounded-sm bg-green-500 w-1/6 text-[13px]'>W</p>
              <p className='rounded-sm bg-red-500 w-1/6 text-[13px]'>L</p>
              <p className='rounded-sm bg-green-500 w-1/6 text-[13px]'>W</p>
              <p className='rounded-sm bg-green-500 w-1/6 text-[13px]'>W</p>
              <p className='rounded-sm bg-red-500 w-1/6 text-[13px]'>L</p>
            </div>
          </div>
          <div className='w-1/5 flex flex-col h-[60px] gap-[3px]'>
            <div className='w-full bg-slate-800 text-white text-center font-semibold h-1/2 flex justify-center items-center'>
              <p>Played</p>
            </div>
            <div className='w-full bg-slate-800 text-white text-center font-semibold h-1/2 flex justify-center items-center'>
              <p>2340</p>
            </div>
          </div>
          <div className='w-1/5 flex flex-col h-[60px] gap-[3px]'>
            <div className='w-full bg-slate-800 text-white text-center font-semibold h-1/2 flex justify-center items-center'>
              <p>Won</p>
            </div>
            <div className='w-full bg-slate-800 text-white text-center font-semibold h-1/2 flex justify-center items-center'>
              <p>2220</p>
            </div>
          </div>
          <div className='w-1/5 flex flex-col h-[60px] gap-[3px]'>
            <div className='w-full bg-slate-800 text-white text-center font-semibold rounded-tr-lg h-1/2 flex justify-center items-center'>
              <p>Lost</p>
            </div>
            <div className='w-full bg-slate-800 text-white text-center font-semibold rounded-br-lg h-1/2 flex justify-center items-center'>
              <p>140</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PlayPage