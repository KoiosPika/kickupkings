import { positions } from '@/constants';
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
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
import { IUserData } from '@/lib/database/models/userData.model';
import { getUserByUserID, savePrize, upgradePosition } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';

const ShopPage = () => {

    const [selectedType, setSelectedType] = useState('Defense')
    const [height, setHeight] = useState<number>(window.innerHeight)
    const [user, setUser] = useState<IUserData>()
    const [upgrading, setUpgrading] = useState<boolean>(false)
    const drawerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [isSpinning, setIsSpinning] = useState(false);
    const [currentPrize, setCurrentPrize] = useState<any>(null);
    const [finalPrize, setFinalPrize] = useState<any>(null);

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


    useEffect(() => {
        const getUser = async () => {
            const userData = await getUserByUserID('6699bfa1ba8348c3228f89ab')
            setUser(userData)
        }

        getUser();
    }, [])

    const calculatePrice = (initialPrice: number, level: number) => {
        return Math.round(initialPrice * (1.3 ** level));
    };

    const handleUpgrade = async (position: string) => {

        if (upgrading) {
            return;
        }

        setUpgrading(true);
        const newUser = await upgradePosition('6699bfa1ba8348c3228f89ab', position);
        setUser(newUser)
        if (drawerRefs.current[position]) {
            drawerRefs.current[position]!.click(); // Close the drawer
        }
        setUpgrading(false);
    }

    const generateWeightedPrizes = () => {
        let prizes: any[] = [];
        for (let i = 0; i < 3; i++) {
            prizes = prizes.concat(
                positions.map(pos => ({
                    ...pos,
                    increment: Math.floor(Math.random() * 4) + 1
                }))
            );
        }
        for (let i = 0; i < 14; i++) {
            prizes.push({ type: 'coins', amount: Math.floor(Math.random() * (500 - 20 + 1)) + 20 });
        }
        return prizes;
    };

    const getRandomPrize = (prizes: any) => {
        const randomIndex = Math.floor(Math.random() * prizes.length);
        return prizes[randomIndex];
    };


    const handleSpinClick = async () => {
        if (isSpinning) return; // Prevent multiple spins at the same time

        setIsSpinning(true);
        setFinalPrize(null);

        const prizes = generateWeightedPrizes();
        const spinDuration = 5000; // Duration of the spin in milliseconds
        const intervalDuration = 100; // Interval duration in milliseconds
        let elapsedTime = 0;

        const spinInterval = setInterval(async () => {
            setCurrentPrize(getRandomPrize(prizes));
            elapsedTime += intervalDuration;

            if (elapsedTime >= spinDuration) {
                clearInterval(spinInterval);
                const prize = getRandomPrize(prizes);
                setFinalPrize(prize);
                setCurrentPrize(prize);
                setIsSpinning(false);

                if (prize.type === 'coins') {
                    const newUser = await savePrize('6699bfa1ba8348c3228f89ab', `coins : coins + ${prize.amount}`);
                    setUser(newUser)
                } else {
                    const newUser = await savePrize('6699bfa1ba8348c3228f89ab', `upgrade : ${prize.symbol} + ${prize.increment}`);
                    setUser(newUser)
                }

            }
        }, intervalDuration);
    };

    const handleReseting = () => {
        setCurrentPrize(null),
            setFinalPrize(null)
    }

    const handlePurchaseClick = async () => {
        // Call your backend to create a payment request
        const response = await fetch('/api/create-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: '6699bfa1ba8348c3228f89ab',
                amount: 100,
            }),
        });

        const data = await response.json();

        if (data.ok) {
            // Redirect to the Telegram payment URL
            window.location.href = data.paymentUrl;
        } else {
            console.error('Error creating payment:', data.error);
        }
    };

    if (!user) {
        return (<Image src={'/icons/spinner.svg'} alt='spinner' height={30} width={30} className='animate-spin' />)
    }

    return (
        <section className='w-full h-screen bg-gradient-to-b from-slate-900 to-gray-700'>
            <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] sm:h-[45px] w-[30px] sm:w-[45px] rounded-lg' />
                <p className='font-semibold text-white text-[13px] sm:text-[20px]'>Rami (Amature)</p>
                <p className='font-semibold text-white text-[13px] sm:text-[20px]'>{`->`}</p>
            </div>
            <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                <div className='w-1/3 bg-slate-800 flex flex-row justify-around items-center rounded-lg h-[53px] sm:h-[75px]'>
                    <div className='flex flex-row items-center gap-2'>
                        <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[25px] h-[25px] sm:w-[40px] sm:h-[40px]' />
                        <p className='font-bold text-white text-[16px] sm:text-[22px]'>{user && user?.coins}</p>
                    </div>
                </div>
                <div className='w-1/3 bg-slate-800 flex flex-row justify-around items-center rounded-lg h-[53px] sm:h-[75px]'>
                    <div className='flex flex-row items-center gap-2' onClick={handlePurchaseClick}>
                        <Image src={'/icons/diamond.svg'} alt='coin' height={100} width={100} className='w-[25px] h-[25px] sm:w-[40px] sm:h-[40px]' />
                        <p className='font-bold text-white text-[16px] sm:text-[22px]'>{user && user?.diamonds}</p>
                    </div>
                </div>
                <Drawer>
                    <DrawerTrigger className='w-1/3 bg-slate-800 flex flex-row justify-around items-center rounded-lg h-[53px] sm:h-[75px]'>
                        <div className='flex flex-row items-center gap-1'>
                            <Image src={'/icons/dice.svg'} alt='coin' height={100} width={100} className='w-[50px] h-[50px] sm:w-[70px] sm:h-[70px]' />
                            <p className='font-bold text-white text-[16px] sm:text-[22px]'>Spin</p>
                        </div>
                    </DrawerTrigger>
                    <DrawerContent className={` h-[85%] sm:h-[40%] border-t-8 border-orange-500 border-x-0 bg-slate-800`}>
                        <DrawerHeader>
                            <DrawerTitle className='text-white my-3'>Lucky Spin</DrawerTitle>
                        </DrawerHeader>
                        <div className='flex flex-col justify-center items-center gap-3'>
                            <div className='flex flex-row justify-center items-center gap-7'>
                                <div className={`p-2 rounded-md font-bold w-[60px] h-[60px] text-center text-white flex justify-center items-center text-[18px] sm:text-[25px] border-2 border-white relative rotate-[340deg]`} style={{ backgroundColor: 'green', boxShadow: `-8px -8px 10px -6px green,-8px 8px 10px -6px green,8px -8px 10px -6px green,8px 8px 10px -6px green` }}>
                                    <p>GK</p>
                                    <p className='absolute bottom-0 right-1 text-[14px]'>+1</p>
                                </div>
                                <div className='flex flex-col justify-center items-center gap-3'>
                                    <Image src={'/icons/coin.svg'} alt='coin' height={50} width={50} />
                                    <p className='bg-slate-600 text-white font-semibold px-2 rounded-full'>+ 500</p>
                                </div>
                                <div className={`p-2 rounded-md font-bold w-[60px] h-[60px] text-center text-white flex justify-center items-center text-[18px] sm:text-[25px] border-2 border-white relative rotate-[20deg]`} style={{ backgroundColor: 'red', boxShadow: `-8px -8px 10px -6px green,-8px 8px 10px -6px red,8px -8px 10px -6px red,8px 8px 10px -6px red` }}>
                                    <p>ST</p>
                                    <p className='absolute bottom-0 right-1 text-[14px]'>+2</p>
                                </div>
                            </div>
                            <p className='w-10/12 text-center text-white font-semibold'>You can win a level upgrade or coins from every spin</p>
                        </div>
                        <div className='flex justify-center items-center mt-6 relative'>
                            <div className='h-[200px] w-[200px] rounded-full bg-gradient-to-t from-green-700 to-red-500 flex justify-center items-center animate-spin' style={{ boxShadow: `-8px -8px 10px -6px red,-8px 8px 10px -6px green,8px -8px 10px -6px green,8px 8px 10px -6px red` }} />
                            {isSpinning || finalPrize ? (
                                <div className='h-[180px] w-[180px] bg-slate-700 rounded-full flex flex-col gap-2 justify-center items-center absolute z-10'>
                                    {currentPrize && (
                                        currentPrize.type === 'coins' ? (
                                            <div className='flex flex-row items-center gap-2'>
                                                <Image src={'/icons/coin.svg'} alt='coin' height={40} width={40} />
                                                <p className='text-white text-[26px] font-semibold'>{currentPrize.amount}</p>
                                            </div>
                                        ) : (
                                            <div
                                                className={`p-2 rounded-md font-bold w-[60px] h-[60px] text-center text-white flex justify-center items-center text-[18px] sm:text-[25px] border-2 border-white relative`}
                                                style={{ backgroundColor: currentPrize.color, boxShadow: `-8px -8px 10px -6px ${currentPrize.color},-8px 8px 10px -6px ${currentPrize.color},8px -8px 10px -6px ${currentPrize.color},8px 8px 10px -6px ${currentPrize.color}` }}
                                            >
                                                <p>{currentPrize.symbol}</p>
                                                <p className='absolute bottom-0 right-1 text-[14px]'>+{currentPrize.increment}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className='h-[180px] w-[180px] bg-slate-700 rounded-full flex flex-col gap-2 justify-center items-center absolute' onClick={handleSpinClick}>
                                    <p className='rounded-full text-white mr-2 text-[24px] font-semibold'>Click to Spin</p>
                                    <div className='flex flex-row justify-center items-center gap-2 bg-slate-800 px-2 py-1 rounded-full'>
                                        <p className='font-bold' style={{ color: user && user.diamonds >= 5 ? 'white' : 'red' }}>5</p>
                                        <Image src={'/icons/diamond.svg'} alt='coin' height={100} width={100} className='w-[25px] h-[25px] sm:w-[40px] sm:h-[40px]' />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='flex flex-row justify-center items-center gap-2 mt-5'>
                            <div className='flex flex-row gap-2 justify-center items-center' onClick={handleReseting}>
                                <Image src={'/icons/refresh.svg'} alt='refresh' height={25} width={25} />
                                <p className='font-semibold text-[18px] text-white'>Reset</p>
                            </div>
                        </div>
                        <DrawerClose className='absolute text-white right-4 top-4'>
                            <Image src={'/icons/x.svg'} alt='coin' height={100} width={100} className='w-[25px] h-[25px] sm:w-[40px] sm:h-[40px]' />
                        </DrawerClose>
                    </DrawerContent>
                </Drawer>
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
                        {positions.filter((position) => position.type === selectedType).map((position: any, index: number) => {
                            const userPosition = user?.positions.find((userPos: any) => userPos.position === position.symbol);
                            const price = userPosition ? calculatePrice(position.initialPrice, userPosition.level) : position.initialPrice;
                            return (
                                <Drawer key={index}>
                                    <DrawerTrigger>
                                        <div ref={el => { drawerRefs.current[position.symbol] = el; }} className='flex flex-col justify-center items-center w-full bg-slate-800 rounded-xl h-[100px] sm:h-[150px] shadow-slate-200 shadow-sm border-[1px] border-slate-300'>
                                            <div className='flex flex-row items-center w-full p-2 gap-1'>
                                                <div className={`p-2 rounded-md font-bold w-1/4 sm:w-1/3 text-center text-white h-full flex justify-center items-center text-[13px] sm:text-[25px] border-2 border-white`} style={{ backgroundColor: position.color, boxShadow: `-8px -8px 10px -6px ${position.color},-8px 8px 10px -6px ${position.color},8px -8px 10px -6px ${position.color},8px 8px 10px -6px ${position.color}` }}>
                                                    <p>{position.symbol}</p>
                                                </div>
                                                <div className='flex flex-col justify-center items-center w-3/4 sm:w-2/3 gap-1'>
                                                    <p className='text-[11px] sm:text-[18.5px] font-bold text-white'>{position.label}</p>
                                                    <div className='flex flex-row items-center gap-2 bg-slate-600 px-2 py-[2px] sm:py-[5px] rounded-lg'>
                                                        <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]' />
                                                        {user && <p className='font-semibold text-white text-[16px] sm:text-[25px]' style={{ color: user?.coins >= price ? 'white' : 'red' }}>{price}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='border-t-2 border-slate-300 w-full py-1 sm:py-2'>
                                                <p className='font-semibold text-white text-center text-[14px] sm:text-[25px]'>{userPosition ? `Level ${userPosition.level} -> Level ${userPosition.level + 1}` : 'No Level Data'}</p>
                                            </div>
                                        </div>
                                    </DrawerTrigger>
                                    <DrawerContent style={{ borderColor: position.color }} className={` h-[55%] sm:h-[40%] border-t-8 border-x-0 bg-slate-800`}>
                                        <DrawerHeader>
                                            <DrawerTitle className='text-white my-3'>Upgrade {position.label} to Level {userPosition && userPosition?.level + 1}?</DrawerTitle>
                                            <div className={`p-2 rounded-md font-bold w-1/5 place-self-center text-center text-white h-[70px] flex justify-center items-center text-[23px] border-2 border-white`} style={{ backgroundColor: position.color, boxShadow: `-8px -8px 10px -6px ${position.color},-8px 8px 10px -6px ${position.color},8px -8px 10px -6px ${position.color},8px 8px 10px -6px ${position.color}` }}>
                                                <p>{position.symbol}</p>
                                            </div>
                                        </DrawerHeader>
                                        <div className='flex flex-row items-center justify-center gap-2 bg-slate-600 px-2 py-[2px] sm:py-[5px] rounded-xl w-2/5 place-self-center'>
                                            <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[30px] h-[30px]' />
                                            {user && <p className='font-semibold text-white text-[25px]' style={{ color: user?.coins >= price ? 'white' : 'red' }}>{price}</p>}
                                        </div>
                                        <DrawerFooter className='mb-5'>
                                            <div style={{ backgroundColor: position.color }} className='w-3/4 py-2 rounded-lg text-white font-bold text-center place-self-center' onClick={() => handleUpgrade(position.symbol)}>{upgrading ? 'Upgrading...' : 'Upgrade now'}</div>
                                            <DrawerClose className='flex justify-center items-center'>
                                                <div className='bg-white text-black font-bold py-2 rounded-lg w-3/4'>Cancel</div>
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                            );
                        })}
                    </div>
                </ScrollArea>
            </div>
        </section>
    )
}

export default ShopPage