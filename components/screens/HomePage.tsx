import { Ranks } from '@/constants'
import { getUserForPlayPage } from '@/lib/actions/user.actions'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import UserDialog from '../shared/UserDialog'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { ScrollArea } from '../ui/scroll-area'

const shuffleArray = (array: any[]) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};

const News = [
    {
        image: '/News-1.jpg',
        link: 'https://youtu.be/wDuzVFCCuqo?si=ac9nZxXTyZ7Q-MGm'
    },
    {
        image: '/News-2.jpg',
        link: 'https://youtu.be/aCbFVeeIFlQ?si=Sxplspn62WRg8EK0'
    },
]

const Products = [
    {
        title: 'Soccer Cleats for Mens',
        store: 'XGHRIAN',
        storeLink: 'https://www.amazon.com/stores/XGHRIAN/page/7174D466-D986-4D5D-B2E3-7A1DA5680512?ref_=ast_bln',
        productLink: 'https://a.co/d/6Nd4TXS',
        image: '/AD-1.jpg'
    },
    {
        title: 'Soccer Mini Shin Guards',
        store: 'Antoyo',
        storeLink: 'https://www.amazon.com/stores/Antoyo/page/EF70433F-AEA0-45A2-8E38-106C5B0982DB?ref_=ast_bln&store_ref=bl_ast_dp_brandLogo_sto',
        productLink: 'https://a.co/d/bsEObtm',
        image: '/AD-2.jpg'
    },
    {
        title: '12 PCS Soccer Balls',
        store: 'Lenwen',
        storeLink: 'https://www.amazon.com/stores/Lenwen/page/E2DAF345-5DC5-4792-9849-4340EB9EA8C0?ref_=ast_bln',
        productLink: 'https://a.co/d/dPRZiWo',
        image: '/AD-3.jpg'
    },
]

const HomePage = () => {

    const [user, setUser] = useState<any>()
    const [height, setHeight] = useState<number>(window.innerHeight)
    const [shuffledNews, setShuffledNews] = useState<any[]>([]);
    const [shuffledProducts, setShuffledProducts] = useState<any[]>([]);

    useEffect(() => {
    const updateDimensions = () => {
      setHeight(window.innerHeight);
    };

    // Check if window is defined (i.e., we are on the client side)
    if (typeof window !== 'undefined') {
      setHeight(window.innerHeight); // Set initial height
      window.addEventListener("resize", updateDimensions);

      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

    useEffect(() => {
        setShuffledNews(shuffleArray(News));
        setShuffledProducts(shuffleArray(Products));
    }, [News, Products]);


    useEffect(() => {
        const getUser = async () => {
            const userData = await getUserForPlayPage('6699bfa1ba8348c3228f89ab')
            setUser(userData)
        }

        getUser();
    }, [])

    const getRankData = (rank: any) => Ranks.find(r => r.rank === rank);
    const getPreviousRankData = (currentRank: any) => {
        const index = Ranks.findIndex(r => r.rank === currentRank);
        return index > 0 ? Ranks[index - 1] : null;
    };

    const calculateProgress = (userRank: number, userPoints: number) => {
        const currentRankData = getRankData(userRank);
        const previousRankData = getPreviousRankData(userRank);

        if (!currentRankData) return 0;

        const previousMaxPoints = previousRankData ? previousRankData.maxPoints : 0;
        const rangeInCurrentRank = currentRankData.maxPoints - previousMaxPoints;
        const pointsInCurrentRank = userPoints - previousMaxPoints;

        const progress = (pointsInCurrentRank / rangeInCurrentRank) * 100;

        return progress;
    };

    // Usage in your component
    const maxPoints = getRankData(user?.Rank || '')?.maxPoints || 0;
    const progress = calculateProgress(user?.Rank || '', user?.points || 0);

    if (!user) {
        return (<Image src={'/icons/spinner.svg'} alt='spinner' height={30} width={30} className='animate-spin' />)
    }

    return (
        <section className='w-full h-screen bg-gradient-to-b from-slate-900 to-gray-600'>
            <UserDialog user={user} />
            <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
                <div className='w-1/2 bg-slate-800 flex flex-col justify-center items-center rounded-lg h-[53px] sm:h-[75px] gap-[3px]'>
                    <div className='flex flex-row items-center gap-2'>
                        <Image src={'/icons/Ballon Dor.png'} alt='dor' height={20} width={20} />
                        {user && <p className='font-bold text-white text-[13px] sm:text-[22px]'>{user?.points} / {maxPoints}</p>}
                    </div>
                    {user && <div className='w-11/12 flex flex-row items-center mt-1'>
                        <div style={{ width: `${progress}%` }} className='h-[5px] sm:h-[10px] rounded-l-lg bg-orange-600' />
                        <div style={{ width: `${100 - progress}%` }} className='h-[5px] sm:h-[10px] rounded-r-lg bg-orange-300' />
                    </div>}
                </div>
                <div className='w-1/2 bg-slate-800 flex flex-row gap-2 justify-center items-center rounded-lg h-[53px] sm:h-[75px]'>
                    <p className='font-bold text-white text-[16px] sm:text-[22px]'>Team Overall:</p>
                    <p className='font-bold text-green-500'>{(user?.teamOverall).toFixed(2)}</p>
                </div>
            </div>
            <ScrollArea style={{ height: height - 195 }}>
                <div className='w-full flex flex-col justify-center items-center'>
                    <p className='mr-auto ml-5 text-white font-semibold my-1'>Football News</p>
                    <Carousel className='w-11/12 rounded-lg flex justify-center items-center relative'>
                        <CarouselContent>
                            {shuffledNews.map((news: any, index) => (
                                <CarouselItem key={index} className='relative flex justify-center items-center'>
                                    <a href={news.link}>
                                        <Image src={news.image} alt='ad' height={100} width={1000} className='rounded-lg' />
                                    </a>
                                    <p className='bg-slate-600 text-white absolute top-1 left-5 px-2 text-[13px] rounded-lg'>{index + 1} / {News.length}</p>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <p className='mr-auto ml-5 text-white font-semibold mt-3 mb-1'>Football Products</p>
                    <Carousel className='w-11/12 rounded-lg flex justify-center items-center relative'>
                        <CarouselContent>
                            {shuffledProducts.map((product: any, index) => (
                                <CarouselItem key={index} className='relative flex justify-center items-center'>
                                    <Image src={product.image} alt='ad' height={100} width={1000} className='rounded-lg' />
                                    <div className='h-8/12 w-1/2 flex flex-col justify-center items-center right-3 absolute z-10 bg-slate-800 py-2 rounded-lg shadow-md shadow-slate-700 px-2'>
                                        <p className='text-white text-[15px] text-center font-bold'>{product.title}</p>
                                        <a href={product.storeLink} className='text-white bg-blue-600 w-11/12 py-1 rounded-md text-[13px] text-center font-semibold my-2 shadow-sm shadow-blue-600'>Visit {product.store} Store</a>
                                        <a href={product.storeLink} className='text-white bg-blue-600 w-11/12 py-1 rounded-md text-[13px] text-center font-semibold shadow-sm shadow-blue-600'>Find This Product</a>
                                    </div>
                                    <p className='bg-slate-600 text-white absolute top-1 left-5 px-2 text-[13px] rounded-lg'>{index + 1} / {Products.length}</p>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <p className='mr-auto ml-5 text-white font-semibold mt-3 mb-1'>Merch</p>
                    <div className='w-11/12 bg-slate-800 h-[130px] rounded-lg flex justify-center items-center'>
                        <p className='font-bold text-white'>Coming Soon</p>
                    </div>
                </div>
            </ScrollArea>
        </section>
    )
}

export default HomePage