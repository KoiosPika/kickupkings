import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'

const EarnPage = () => {

  const [height, setHeight] = useState<number>(window.innerHeight)

    const updateDimensions = () => {
        setHeight(window.innerHeight);
    }

    useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);


  return (
    <div className='w-full h-screen'>
      <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
        <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] rounded-lg' />
        <p className='font-semibold text-white text-[13px]'>Rami (Amature)</p>
        <p className='font-semibold text-white text-[13px]'>{`->`}</p>
      </div>
      <ScrollArea style={{height:height - 130}}>
        <div className='w-full flex flex-col justify-center items-center'>
          <p className='font-semibold text-white text-[20px] mt-2 bg-slate-800 px-2 py-1 rounded-md'>Daily Quizes</p>
          <div className='my-2 flex flex-row items-center gap-2'>
            <p className='font-semibold text-white'>Find the quiz on Telegram Channel</p>
            <Image src={'/icons/telegram.svg'} alt='link' height={100} width={100} className='bg-white h-[30px] w-[30px] p-[2px] rounded-full' />
          </div>
          <div className='w-10/12 flex flex-row gap-2 items-center justify-center my-2 relative'>
            <Input className='font-bold text-center text-[18px] bg-[#16a34a] text-white border-2 border-white h-[50px] rounded-full' value={'Ronaldo'} />
            <Image src={'/icons/send.svg'} alt='send' height={100} width={100} className='bg-white h-[30px] w-[30px] p-[3px] rounded-full rotate-45 absolute right-2' />
          </div>
          <div className='flex flex-row items-center gap-2 bg-green-600 px-2 py-[2px] sm:py-[5px] rounded-lg'>
            <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]' />
            <p className='font-semibold text-white text-[16px] sm:text-[25px]'>1,500</p>
          </div>
          <div className='my-2 flex flex-row items-center gap-2 mt-6'>
            <p className='font-semibold text-white'>Find the quiz on X</p>
            <Image src={'/icons/x-twitter.svg'} alt='twitter' height={100} width={100} className='bg-white h-[30px] w-[30px] p-[3px] rounded-md' />
          </div>
          <div className='w-10/12 flex flex-row gap-2 items-center justify-center my-2 relative'>
            <Input className='font-bold text-center text-[18px] bg-slate-800 text-white border-2 border-white h-[50px] rounded-full' value={'Modric'} />
            <Image src={'/icons/send.svg'} alt='send' height={100} width={100} className='bg-white h-[30px] w-[30px] p-[3px] rounded-full rotate-45 absolute right-2' />
          </div>
          <div className='flex flex-row items-center gap-2 bg-slate-600 px-2 py-[2px] sm:py-[5px] rounded-lg'>
            <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]' />
            <p className='font-semibold text-white text-[16px] sm:text-[25px]'>200</p>
          </div>
        </div>
        <div className='w-full flex flex-col justify-center items-center my-3'>
          <p className='font-semibold text-white text-[20px] mt-2 bg-slate-800 px-2 py-1 rounded-md'>Daily Predictions</p>
          <div className='w-full flex flex-row justify-evenly items-center my-2'>
            <Image src={'/Arsenal.png'} alt='arsenal' height={50} width={50}/>
            <Input type='number' className='text-[16px] w-[40px] font-bold text-center'/>
            <p className='text-white font-bold'>-</p>
            <Input type='number' className='text-[16px] w-[40px] font-bold text-center'/>
            <Image src={'/Arsenal.png'} alt='arsenal' height={50} width={50}/>
          </div>
          <div className='flex flex-row items-center gap-2 bg-slate-600 px-2 py-[2px] sm:py-[5px] rounded-lg'>
            <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]' />
            <p className='font-semibold text-white text-[16px] sm:text-[25px]'>200</p>
          </div>
          <div className='w-full flex flex-row justify-evenly items-center my-2'>
            <Image src={'/Arsenal.png'} alt='arsenal' height={50} width={50}/>
            <Input type='number' className='text-[16px] w-[40px] font-bold text-center'/>
            <p className='text-white font-bold'>-</p>
            <Input type='number' className='text-[16px] w-[40px] font-bold text-center'/>
            <Image src={'/Arsenal.png'} alt='arsenal' height={50} width={50}/>
          </div>
          <div className='flex flex-row items-center gap-2 bg-green-600 px-2 py-[2px] sm:py-[5px] rounded-lg'>
            <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]' />
            <p className='font-semibold text-white text-[16px] sm:text-[25px]'>200</p>
          </div>
          <div className='w-full flex flex-row justify-evenly items-center my-2'>
            <Image src={'/Arsenal.png'} alt='arsenal' height={50} width={50}/>
            <Input type='number' className='text-[16px] w-[40px] font-bold text-center'/>
            <p className='text-white font-bold'>-</p>
            <Input type='number' className='text-[16px] w-[40px] font-bold text-center'/>
            <Image src={'/Arsenal.png'} alt='arsenal' height={50} width={50}/>
          </div>
          <div className='flex flex-row items-center gap-2 bg-slate-600 px-2 py-[2px] sm:py-[5px] rounded-lg'>
            <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]' />
            <p className='font-semibold text-white text-[16px] sm:text-[25px]'>200</p>
          </div>
        </div>

        <div className='w-full flex justify-center items-center'>
          <div className='bg-green-700 flex flex-row items-center gap-2 px-4 py-1 rounded-full'>
            <Image src={'/icons/save.svg'} alt='save' height={20} width={20}/>
            <p className='font-bold text-white'>Save Predictions</p>
          </div>
        </div>
        
      </ScrollArea>
      <div className='h-[80px] bg-slate-700 mt-auto' />
    </div>
  )
}

export default EarnPage