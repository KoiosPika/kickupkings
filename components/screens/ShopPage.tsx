import { positions } from '@/constants';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { ScrollArea } from '../ui/scroll-area';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

const ShopPage = () => {

    const [selectedType, setSelectedType] = useState('Defense')
    const [height, setHeight] = useState<number>(window.innerHeight)

    const updateDimensions = () => {
        setHeight(window.innerHeight);
    }

    useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const handleTypeChange = (type: string) => {
        setSelectedType(type);
    };

    return (
        <section className='w-full h-screen'>
            <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] sm:h-[45px] w-[30px] sm:w-[45px] rounded-lg' />
                <p className='font-semibold text-white text-[13px] sm:text-[20px]'>Rami (Amature)</p>
                <p className='font-semibold text-white text-[13px] sm:text-[20px]'>{`->`}</p>
            </div>
            <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                <div className='w-1/3 bg-slate-800 flex flex-row justify-around items-center rounded-lg h-[53px] sm:h-[75px]'>
                    <div className='flex flex-row items-center gap-2'>
                        <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[25px] h-[25px] sm:w-[40px] sm:h-[40px]' />
                        <p className='font-bold text-white text-[16px] sm:text-[22px]'>2000</p>
                    </div>
                </div>
                <div className='w-1/3 bg-slate-800 flex flex-row justify-around items-center rounded-lg h-[53px] sm:h-[75px]'>
                    <div className='flex flex-row items-center gap-2'>
                        <Image src={'/icons/diamond.svg'} alt='coin' height={100} width={100} className='w-[25px] h-[25px] sm:w-[40px] sm:h-[40px]' />
                        <p className='font-bold text-white text-[16px] sm:text-[22px]'>0</p>
                    </div>
                </div>
                <div className='w-1/3 bg-slate-800 flex flex-row justify-around items-center rounded-lg h-[53px] sm:h-[75px]'>
                    <div className='flex flex-row items-center gap-1'>
                        <Image src={'/icons/dice.svg'} alt='coin' height={100} width={100} className='w-[50px] h-[50px] sm:w-[70px] sm:h-[70px]' />
                        <p className='font-bold text-white text-[16px] sm:text-[22px]'>Spin</p>
                    </div>
                </div>
            </div>
            <div className='w-full flex flex-col justify-center items-center my-2'>
                <div className='w-11/12 bg-slate-800 flex flex-row items-center justify-evenly px-1 py-1 rounded-lg my-2'>
                    {['Defense', 'Midfield', 'Forward', 'Staff'].map((type) => (
                        <p
                            key={type}
                            className={`w-1/4 rounded-md text-center text-[12.5px] sm:text-[24px] font-bold py-[2px] sm:py-[7px] cursor-pointer text-white ${selectedType === type ? 'bg-[#09C609]' : ''
                                }`}
                            onClick={() => handleTypeChange(type)}
                        >
                            {type}
                        </p>
                    ))}
                </div>
                <ScrollArea className='w-11/12' style={{ height: height - 245 }}>
                    <div className='grid grid-cols-2 w-full gap-2 sm:gap-3'>
                        {positions
                            .filter((position) => position.type === selectedType)
                            .map((position: any, index: number) => (
                                <Drawer key={index}>
                                    <DrawerTrigger>
                                        <div className='flex flex-col justify-center items-center w-full bg-slate-800 rounded-xl h-[100px] sm:h-[150px] shadow-slate-200 shadow-sm border-[1px] border-slate-300'>
                                            <div className='flex flex-row items-center w-full p-2 gap-1'>
                                                <div className={`p-2 rounded-md font-bold w-1/4 sm:w-1/3 text-center text-white h-full flex justify-center items-center text-[13px] sm:text-[25px] border-2 border-white`} style={{ backgroundColor: position.color, boxShadow: `-8px -8px 10px -6px ${position.color},-8px 8px 10px -6px ${position.color},8px -8px 10px -6px ${position.color},8px 8px 10px -6px ${position.color}` }}>
                                                    <p>{position.symbol}</p>
                                                </div>
                                                <div className='flex flex-col justify-center items-center w-3/4 sm:w-2/3 gap-1'>
                                                    <p className='text-[11px] sm:text-[18.5px] font-bold text-white'>{position.label}</p>
                                                    <div className='flex flex-row items-center gap-2 bg-slate-600 px-2 py-[2px] sm:py-[5px] rounded-lg'>
                                                        <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]' />
                                                        <p className='font-semibold text-white text-[16px] sm:text-[25px]'>150</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='border-t-2 border-slate-300 w-full py-1 sm:py-2'>
                                                <p className='font-semibold text-white text-center text-[14px] sm:text-[25px]'>Level 0 {`->`} Level 1</p>
                                            </div>
                                        </div>
                                    </DrawerTrigger>
                                    <DrawerContent style={{ borderColor: position.color }} className={` h-[55%] sm:h-[40%] border-t-8 border-x-0 bg-slate-800`}>
                                        <DrawerHeader>
                                            <DrawerTitle className='text-white my-3'>Upgrade {position.label} to Level 3?</DrawerTitle>
                                            <div className={`p-2 rounded-md font-bold w-1/5 place-self-center text-center text-white h-[70px] flex justify-center items-center text-[23px] border-2 border-white`} style={{ backgroundColor: position.color, boxShadow: `-8px -8px 10px -6px ${position.color},-8px 8px 10px -6px ${position.color},8px -8px 10px -6px ${position.color},8px 8px 10px -6px ${position.color}` }}>
                                                <p>{position.symbol}</p>
                                            </div>
                                        </DrawerHeader>
                                        <div className='flex flex-row items-center justify-center gap-2 bg-slate-600 px-2 py-[2px] sm:py-[5px] rounded-xl w-2/5 place-self-center'>
                                            <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[30px] h-[30px]' />
                                            <p className='font-semibold text-white text-[25px]'>150</p>
                                        </div>
                                        <DrawerFooter className='mb-5'>
                                            <div style={{ backgroundColor: position.color }} className='w-3/4 py-2 rounded-lg text-white font-bold text-center place-self-center'>Upgrade now</div>
                                            <DrawerClose className='flex justify-center items-center'>
                                                <div className='bg-white text-black font-bold py-2 rounded-lg w-3/4'>Cancel</div>
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>))}
                    </div>
                </ScrollArea>
            </div>
        </section>
    )
}

export default ShopPage