import Image from 'next/image'
import React from 'react'

const ShopPage = () => {
  return (
    <section className='w-full h-screen'>
            <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] rounded-lg' />
                <p className='font-semibold text-white text-[13px]'>Rami (Amature)</p>
                <p className='font-semibold text-white text-[13px]'>{`->`}</p>
            </div>
            <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                <div className='w-1/2 bg-slate-500 flex flex-col justify-center items-center rounded-lg h-[53px] gap-[3px]'>
                    <p className='font-bold text-white'>Points: 2.4k / 5k</p>
                    <div className='w-11/12 flex flex-row items-center'>
                        <div className='h-[5px] w-8/12 rounded-l-lg bg-orange-500' />
                        <div className='h-[5px] w-4/12 rounded-r-lg bg-white' />
                    </div>
                </div>
                <div className='w-1/2 bg-slate-500 flex flex-col justify-center items-center rounded-lg h-[53px]'>
                    <p className='font-bold text-white'>Team Overall: 3.4</p>
                    <div className='flex flex-row items-center justify-center gap-1 w-full'>
                        <Image src={'/icons/star-yellow.svg'} alt='star' height={20} width={20} />
                        <Image src={'/icons/star-yellow.svg'} alt='star' height={20} width={20} />
                        <Image src={'/icons/star-yellow.svg'} alt='star' height={20} width={20} />
                        <Image src={'/icons/star-yellow.svg'} alt='star' height={20} width={20} />
                        <Image src={'/icons/star-yellow.svg'} alt='star' height={20} width={20} />
                    </div>
                </div>
            </div>
            <div className='flex-1'>
                hello
            </div>
        </section>
  )
}

export default ShopPage