import Image from 'next/image'
import React from 'react'

const HomePage = () => {
    return (
        <section className='w-full h-screen'>
            <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] rounded-lg' />
                <p className='font-semibold text-white text-[13px]'>Rami (Amature)</p>
                <p className='font-semibold text-white text-[13px]'>{`->`}</p>
            </div>
            <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                <div className='w-1/2 bg-slate-800 flex flex-col justify-center items-center rounded-lg h-[53px] sm:h-[75px] gap-[3px]'>
                    <p className='font-bold text-white text-[13px] sm:text-[22px]'>Points: 88,460 / 10,000</p>
                    <div className='w-11/12 flex flex-row items-center'>
                        <div className='h-[5px] sm:h-[10px] w-8/12 rounded-l-lg bg-orange-600' />
                        <div className='h-[5px] sm:h-[10px] w-4/12 rounded-r-lg bg-orange-300' />
                    </div>
                </div>
                <div className='w-1/2 bg-slate-800 flex flex-col justify-center items-center rounded-lg h-[53px] sm:h-[75px]'>
                    <p className='font-bold text-white text-[16px] sm:text-[22px]'>Team Overall: 3.4</p>
                    <div className='flex flex-row items-center justify-center gap-1 w-full'>
                        <Image src={'/icons/star-yellow.svg'} alt='star' height={100} width={100} className='h-[20px] sm:h-[30px] w-[20px] sm:w-[30px]'  />
                        <Image src={'/icons/star-yellow.svg'} alt='star' height={100} width={100} className='h-[20px] sm:h-[30px] w-[20px] sm:w-[30px]'  />
                        <Image src={'/icons/star-yellow.svg'} alt='star' height={100} width={100} className='h-[20px] sm:h-[30px] w-[20px] sm:w-[30px]'  />
                        <Image src={'/icons/star-yellow.svg'} alt='star' height={100} width={100} className='h-[20px] sm:h-[30px] w-[20px] sm:w-[30px]'  />
                        <Image src={'/icons/star-yellow.svg'} alt='star' height={100} width={100} className='h-[20px] sm:h-[30px] w-[20px] sm:w-[30px]'  />
                    </div>
                </div>
            </div>
            <div className='flex-1'>
                
            </div>
        </section>
    )
}

export default HomePage