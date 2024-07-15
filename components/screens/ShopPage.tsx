import Image from 'next/image'
import React, { useState } from 'react'

const ShopPage = () => {

    const [selectedType, setSelectedType] = useState('Defense')

    const handleTypeChange = (type: string) => {
        setSelectedType(type);
    };

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
            <div className='w-full flex flex-col justify-center items-center my-2'>
                <p className='text-white text-[17px] font-semibold'>Welcome to shop</p>
                <div className='w-11/12 bg-slate-500 flex flex-row items-center justify-evenly px-1 py-1 rounded-lg my-2'>
                    {['Defense', 'Midfield', 'Forward', 'Staff'].map((type) => (
                        <p
                            key={type}
                            className={`w-1/4 rounded-md text-center text-[12.5px] md:text-[16px] font-semibold py-[2px] cursor-pointer text-white ${selectedType === type ? 'bg-green-500 text-white' : ''
                                }`}
                            onClick={() => handleTypeChange(type)}
                        >
                            {type}
                        </p>
                    ))}
                </div>
                <div className='grid grid-cols-2 w-11/12 gap-2'>
                    <div className='flex flex-col justify-center items-center w-full bg-slate-500 rounded-xl'>
                        <div className='flex flex-row items-center w-full p-2 gap-2'>
                            <div className='bg-green-500 p-2 rounded-md font-bold w-1/3 text-center text-white h-full flex justify-center items-center'>
                                <p>GK</p>
                            </div>
                            <div className='flex flex-col justify-center items-center w-2/3 gap-1'>
                                <p className='text-[11px] font-semibold text-white'>Goal Keeper</p>
                                <div className='flex flex-row items-center gap-2 bg-slate-600 px-2 py-[2px] rounded-lg'>
                                    <Image src={'/icons/coin.svg'} alt='coin' height={20} width={20} />
                                    <p className='font-semibold text-white'>230</p>
                                </div>
                            </div>
                        </div>
                        <div className='border-t-2 border-slate-300 w-full py-1'>
                            <p className='font-semibold text-white text-center'>Level 0 {`->`} Level 1</p>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center items-center w-full bg-slate-500 rounded-xl'>
                        <div className='flex flex-row items-center w-full p-2 gap-2'>
                            <div className='bg-blue-500 p-2 rounded-md font-bold w-1/3 text-center text-white h-full flex justify-center items-center'>
                                <p>LWB</p>
                            </div>
                            <div className='flex flex-col justify-center items-center w-2/3 gap-1'>
                                <p className='text-[11.5px] font-semibold text-white'>Left Wing Back</p>
                                <div className='flex flex-row items-center gap-2 bg-slate-600 px-2 py-[2px] rounded-lg'>
                                    <Image src={'/icons/coin.svg'} alt='coin' height={20} width={20} />
                                    <p className='font-semibold text-white'>230</p>
                                </div>
                            </div>
                        </div>
                        <div className='border-t-2 border-slate-300 w-full py-1'>
                            <p className='font-semibold text-white text-center'>Level 0 {`->`} Level 1</p>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center items-center w-full bg-slate-500 rounded-xl'>
                        <div className='flex flex-row items-center w-full p-2 gap-2'>
                            <div className='bg-blue-500 p-2 rounded-md font-bold w-1/3 text-center text-white h-full flex justify-center items-center'>
                                <p>LB</p>
                            </div>
                            <div className='flex flex-col justify-center items-center w-2/3 gap-1'>
                                <p className='text-[11.5px] font-semibold text-white'>Left Back</p>
                                <div className='flex flex-row items-center gap-2 bg-slate-600 px-2 py-[2px] rounded-lg'>
                                    <Image src={'/icons/coin.svg'} alt='coin' height={20} width={20} />
                                    <p className='font-semibold text-white'>230</p>
                                </div>
                            </div>
                        </div>
                        <div className='border-t-2 border-slate-300 w-full py-1'>
                            <p className='font-semibold text-white text-center'>Level 0 {`->`} Level 1</p>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center items-center w-full bg-slate-500 rounded-xl'>
                        <div className='flex flex-row items-center w-full p-2 gap-2'>
                            <div className='bg-blue-500 p-2 rounded-md font-bold w-1/3 text-center text-white h-full flex justify-center items-center'>
                                <p>LCB</p>
                            </div>
                            <div className='flex flex-col justify-center items-center w-2/3 gap-1'>
                                <p className='text-[11.5px] font-semibold text-white'>Left Center Back</p>
                                <div className='flex flex-row items-center gap-2 bg-slate-600 px-2 py-[2px] rounded-lg'>
                                    <Image src={'/icons/coin.svg'} alt='coin' height={20} width={20} />
                                    <p className='font-semibold text-white'>230</p>
                                </div>
                            </div>
                        </div>
                        <div className='border-t-2 border-slate-300 w-full py-1'>
                            <p className='font-semibold text-white text-center'>Level 0 {`->`} Level 1</p>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center items-center w-full bg-slate-500 rounded-xl'>
                        <div className='flex flex-row items-center w-full p-2 gap-2'>
                            <div className='bg-blue-500 p-2 rounded-md font-bold w-1/3 text-center text-white h-full flex justify-center items-center'>
                                <p>CB</p>
                            </div>
                            <div className='flex flex-col justify-center items-center w-2/3 gap-1'>
                                <p className='text-[11.5px] font-semibold text-white'>Center Back</p>
                                <div className='flex flex-row items-center gap-2 bg-slate-600 px-2 py-[2px] rounded-lg'>
                                    <Image src={'/icons/coin.svg'} alt='coin' height={20} width={20} />
                                    <p className='font-semibold text-white'>230</p>
                                </div>
                            </div>
                        </div>
                        <div className='border-t-2 border-slate-300 w-full py-1'>
                            <p className='font-semibold text-white text-center'>Level 0 {`->`} Level 1</p>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center items-center w-full bg-slate-500 rounded-xl'>
                        <div className='flex flex-row items-center w-full p-2 gap-2'>
                            <div className='bg-blue-500 p-2 rounded-md font-bold w-1/3 text-center text-white h-full flex justify-center items-center'>
                                <p>RCB</p>
                            </div>
                            <div className='flex flex-col justify-center items-center w-2/3 gap-1'>
                                <p className='text-[10.5px] font-semibold text-white'>Right Center Back</p>
                                <div className='flex flex-row items-center gap-2 bg-slate-600 px-2 py-[2px] rounded-lg'>
                                    <Image src={'/icons/coin.svg'} alt='coin' height={20} width={20} />
                                    <p className='font-semibold text-white'>230</p>
                                </div>
                            </div>
                        </div>
                        <div className='border-t-2 border-slate-300 w-full py-1'>
                            <p className='font-semibold text-white text-center'>Level 0 {`->`} Level 1</p>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center items-center w-full bg-slate-500 rounded-xl'>
                        <div className='flex flex-row items-center w-full p-2 gap-2'>
                            <div className='bg-blue-500 p-2 rounded-md font-bold w-1/3 text-center text-white h-full flex justify-center items-center'>
                                <p>RB</p>
                            </div>
                            <div className='flex flex-col justify-center items-center w-2/3 gap-1'>
                                <p className='text-[11.5px] font-semibold text-white'>Right Back</p>
                                <div className='flex flex-row items-center gap-2 bg-slate-600 px-2 py-[2px] rounded-lg'>
                                    <Image src={'/icons/coin.svg'} alt='coin' height={20} width={20} />
                                    <p className='font-semibold text-white'>230</p>
                                </div>
                            </div>
                        </div>
                        <div className='border-t-2 border-slate-300 w-full py-1'>
                            <p className='font-semibold text-white text-center'>Level 0 {`->`} Level 1</p>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center items-center w-full bg-slate-500 rounded-xl'>
                        <div className='flex flex-row items-center w-full p-2 gap-2'>
                            <div className='bg-blue-500 p-2 rounded-md font-bold w-1/3 text-center text-white h-full flex justify-center items-center'>
                                <p>RWB</p>
                            </div>
                            <div className='flex flex-col justify-center items-center w-2/3 gap-1'>
                                <p className='text-[11.5px] font-semibold text-white'>Right Wing Back</p>
                                <div className='flex flex-row items-center gap-2 bg-slate-600 px-2 py-[2px] rounded-lg'>
                                    <Image src={'/icons/coin.svg'} alt='coin' height={20} width={20} />
                                    <p className='font-semibold text-white'>230</p>
                                </div>
                            </div>
                        </div>
                        <div className='border-t-2 border-slate-300 w-full py-1'>
                            <p className='font-semibold text-white text-center'>Level 0 {`->`} Level 1</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ShopPage