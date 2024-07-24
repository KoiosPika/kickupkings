import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { formations } from '@/constants/Formations'
import { positions } from '@/constants'
import { createFakeUsers, createUser, findMatch, getUserByUserID, getUserForPlayPage, playGame } from '@/lib/actions/user.actions'
import { IUserData } from '@/lib/database/models/userData.model'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation'
import { IMatch } from '@/lib/database/models/match.model'


const colors = [
  { 'Forward': '#EE2E0C' },
  { 'Midfield': '#EE9F0C' },
  { 'Defense': '#0090DE' },
  { 'Goalkeeper': '#41B815' },
]

const PlayPage = () => {

  const [height, setHeight] = useState<number>(window.innerHeight)
  const [user, setUser] = useState<any>()
  const router = useRouter()
  const [waiting, setWaiting] = useState(false)
  const [searching, setSearching] = useState(false)
  const [resultUser, setResultUser] = useState<IUserData>()

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
      const userData = await getUserForPlayPage('6699bfa1ba8348c3228f89ab')

      console.log(userData)
      setUser(userData)
    }

    getUser();
  }, [])

  const getColor = (type: any, position: any) => {
    if (!position) {
      return '';
    }
    const colorObj: any = colors.find((color: any) => color[type]);
    return colorObj ? colorObj[type] : '';
  };

  const formation = user && formations.find(f => f.id === user?.formation);

  const filteredPositions = formation
    ? user?.positions.filter((userPos: any) => formation.data.some((row: any) => row.positions.includes(userPos.position)))
    : [];

  const overallAverageLevel =
    filteredPositions.reduce((sum: number, userPos: any) => sum + userPos.level, 0) / filteredPositions.length || 0;

  const handlePlaying = async (opponentId: string) => {

    if (waiting) {
      return;
    }

    setWaiting(true);
    const match = await playGame('6699bfa1ba8348c3228f89ab', opponentId)

    router.push(`/play/${match._id}`);
  }

  const handleFindingMatch = async () => {
    if (searching) {
      return;
    }

    setSearching(true);

    const searchedUser = await findMatch('6699bfa1ba8348c3228f89ab');

    setResultUser(searchedUser);

    setSearching(false);
  }

  if (!user) {
    return (<Image src={'/icons/spinner.svg'} alt='spinner' height={30} width={30} className='animate-spin' />)
  }


  return (
    <section className='w-full h-screen flex flex-col bg-gradient-to-b from-slate-800 to-gray-600'>
      <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
        <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] rounded-md' />
        <p className='font-semibold text-white text-[13px]'>Rami ({user?.Rank})</p>
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
              {user && user.form.split('').map((result: any, index: number) => (
                <p
                  key={index}
                  className={`rounded-sm w-1/6 text-[13px] sm:text-[18px] ${result === 'W' ? 'bg-green-600' : 'bg-red-600'}`}
                >
                  {result}
                </p>
              ))}
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
            <a href='/history/6699bfa1ba8348c3228f89ab' className='text-white font-semibold bg-slate-800 px-3 py-1 inline-flex rounded-lg text-[12px] sm:text-[22px] ml-auto mt-auto'>View All {`->`}</a>
          </div>
          <div className='flex flex-col gap-1 sm:gap-4 my-2'>
            {user && user.matches.map((match: IMatch, index: number) => (
              <div key={index} className='text-white font-semibold bg-slate-800 p-2 rounded-lg flex flex-row items-center gap-1 sm:gap-5'>
                {match.winner.toString() != '6699bfa1ba8348c3228f89ab' && <p className='h-[25px] w-[30px] sm:h-[45px] sm:w-[50px] text-[16px] sm:text-[30px] text-center bg-red-600 rounded-sm'>L</p>}
                {match.winner.toString() == '6699bfa1ba8348c3228f89ab' && <p className='h-[25px] w-[30px] sm:h-[45px] sm:w-[50px] text-[16px] sm:text-[30px] text-center bg-green-600 rounded-sm'>W</p>}
                <p className='ml-2 text-[16px] sm:text-[30px]'>{match.playerScore}-{match.opponentScore}</p>
                <div className='ml-5 flex flex-row items-center bg-slate-900 px-2 py-1 rounded-lg'>
                  <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[28px] w-[28px] sm:h-[48px] sm:w-[48px] rounded-lg' />
                  <p className='ml-2 max-w-[80px] sm:max-w-[200px] text-[16px] sm:text-[24px] overflow-hidden'>username</p>
                </div>
                {match.type === 'Rank' && <p className='bg-orange-600 px-2 text-[14px] sm:text-[24px] py-[2px] rounded-lg ml-auto shadow-md shadow-orange-500 border-b-[3px] sm:border-b-[6px] border-orange-800'>Rank</p>}
                {match.type === 'Friendly' && <p className='bg-purple-700 px-2 text-[14px] sm:text-[24px] py-[2px] rounded-lg ml-auto shadow-md shadow-purple-500 border-b-[3px] sm:border-b-[6px] border-purple-800'>Friendly</p>}
              </div>))}
            {(user && user.matches.length == 0) && [0, 1].map((_, index) => (
              <div key={index} className='text-white font-semibold bg-slate-800 p-2 rounded-lg flex flex-row items-center gap-1 sm:gap-5 h-[55px]'>

              </div>))}
          </div>
        </div>
      </div>
      <div className='w-full flex justify-center items-center mt-2'>
        <div className='grid grid-cols-2 gap-2 w-11/12'>
          <AlertDialog>
            <AlertDialogTrigger>
              <div className='bg-blue-500 px-3 py-2 font-semibold text-white rounded-xl shadow-blue-600 shadow-lg border-b-[4px] sm:border-b-[8px] border-blue-800 flex flex-row items-center justify-center gap-1'>
                <p className='text-[16px] sm:text-[34px] ml-1'>Find Match</p>
                <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]' />
                <p className='font-semibold text-white text-[16px] sm:text-[25px]'>10</p>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-slate-800 px-2 border-0 rounded-lg'>
              <AlertDialogHeader>
                <AlertDialogTitle className='text-white my-6'>Find Match</AlertDialogTitle>
                {resultUser && <>
                  <div className='flex flex-row items-center gap-3'>
                    <div className='w-1/2'>
                      <div className='flex flex-row justify-center items gap-3 my-2'>
                        <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[28px] w-[28px] sm:h-[48px] sm:w-[48px] rounded-lg' />
                        <p className='font-bold text-white'>username</p>
                      </div>
                      <div className='h-[250px] w-full flex flex-col justify-around rounded-md bg-slate-800 border-[1px] sm:border-4 border-white' style={{ backgroundImage: `url('/Field-dark.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        {formation?.data.map((row: any, rowIndex: number) => (
                          <div key={rowIndex} className='flex justify-around'>
                            {row.positions.map((position: any, posIndex: number) => (
                              <div key={posIndex} className='p-1 sm:px-3 sm:py-1 rounded-sm text-white font-semibold border-white' style={{ backgroundColor: getColor(row.type, row.positions[posIndex]), borderWidth: row.positions[posIndex] ? 2 : 0, boxShadow: position ? `-8px -8px 10px -4px ${getColor(row.type, row.positions[posIndex])},-8px 8px 10px -4px ${getColor(row.type, row.positions[posIndex])},8px -8px 10px -4px ${getColor(row.type, row.positions[posIndex])},8px 8px 10px -4px ${getColor(row.type, row.positions[posIndex])}` : '' }}>
                                <p className='text-[10px] sm:text-[20px]'>{position}</p>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                      <p className='bg-slate-900 text-white font-semibold my-1 rounded-full'>{user.formation}</p>
                      <p className='bg-slate-900 text-white font-semibold my-1 rounded-full'>Overall: {(user.teamOverall).toFixed(2)}</p>
                    </div>
                    <div className='w-1/2'>
                      <div className='flex flex-row justify-center items gap-3 my-2'>
                        <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[28px] w-[28px] sm:h-[48px] sm:w-[48px] rounded-lg' />
                        <p className='font-bold text-white'>{resultUser.User.username}</p>
                      </div>
                      <div className='h-[250px] w-full flex flex-col justify-around rounded-md bg-slate-800 border-[1px] sm:border-4 border-white' style={{ backgroundImage: `url('/Field-dark.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        {formations.find(f => f.id === resultUser?.formation)?.data.map((row: any, rowIndex: number) => (
                          <div key={rowIndex} className='flex justify-around'>
                            {row.positions.map((position: any, posIndex: number) => (
                              <div key={posIndex} className='p-1 sm:px-3 sm:py-1 rounded-sm text-white font-semibold border-white' style={{ backgroundColor: getColor(row.type, row.positions[posIndex]), borderWidth: row.positions[posIndex] ? 2 : 0, boxShadow: position ? `-8px -8px 10px -4px ${getColor(row.type, row.positions[posIndex])},-8px 8px 10px -4px ${getColor(row.type, row.positions[posIndex])},8px -8px 10px -4px ${getColor(row.type, row.positions[posIndex])},8px 8px 10px -4px ${getColor(row.type, row.positions[posIndex])}` : '' }}>
                                <p className='text-[10px] sm:text-[20px]'>{position}</p>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                      <p className='bg-slate-900 text-white font-semibold my-1 rounded-full'>{resultUser.formation}</p>
                      <p className='bg-slate-900 text-white font-semibold my-1 rounded-full'>Overall: {(resultUser.teamOverall).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className='w-full flex justify-center items-center'>
                    <div className='w-11/12 bg-slate-700 flex flex-row justify-center items-center py-2 rounded-full gap-6'>
                      <div className='flex flex-row items-center gap-2'>
                        <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]' />
                        <p className='font-semibold text-white'>75</p>
                      </div>
                      <div className='flex flex-row items-center gap-2'>
                        <Image src={'/icons/diamond.svg'} alt='coin' height={100} width={100} className='w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]' />
                        <p className='font-semibold text-white'>2</p>
                      </div>
                      <div className='flex flex-row items-center gap-2'>
                        <p className='font-semibold text-white'>25 Points</p>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-row items-center gap-3 w-full'>
                    <div className='w-1/2 bg-green-700 text-white font-semibold rounded-md py-1 flex flex-row items-center justify-center gap-2' onClick={() => handlePlaying(resultUser.User._id)}>
                      <p>{waiting ? 'Wait' : 'Play'}</p>
                      <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]' />
                      <p className='font-semibold text-white text-[16px] sm:text-[25px]'>10</p>
                    </div>
                    <div className='w-1/2 bg-red-700 text-white font-semibold rounded-md py-1 flex flex-row items-center justify-center gap-2'>
                      <p>Skip</p>
                      <Image src={'/icons/coin.svg'} alt='coin' height={100} width={100} className='w-[20px] h-[20px] sm:w-[35px] sm:h-[35px]' />
                      <p className='font-semibold text-white text-[16px] sm:text-[25px]'>1</p>
                    </div>
                  </div>
                </>}
                {!resultUser && <div className='py-2 px-3 bg-purple-700 w-3/4 place-self-center text-white font-bold flex flex-row items-center justify-center gap-3 text-[18px] rounded-lg' onClick={handleFindingMatch}>
                  <Image src={'/icons/search.svg'} alt='search' height={20} width={20} />
                  <p>Search For Opponents</p>
                </div>}
              </AlertDialogHeader>
              <AlertDialogCancel className='absolute text-white right-2 top-0 bg-transparent border-0'>
                <Image src={'/icons/x.svg'} alt='coin' height={100} width={100} className='w-[25px] h-[25px] sm:w-[40px] sm:h-[40px]' />
              </AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
          <div className='bg-green-700 py-2 font-semibold text-white rounded-xl shadow-green-600 shadow-lg border-b-[4px] sm:border-b-[8px] border-green-900 flex flex-row justify-center items-center gap-1'>
            <p className='text-[16px] sm:text-[34px]'>Play with friends</p>
          </div>
        </div>
      </div>
      <div className='w-full flex flex-col h-full justify-center items-center flex-grow mt-3'>
        <div className='w-11/12 flex flex-row items-center h-full gap-2'>
          <div className='h-full w-1/2 flex flex-col justify-around rounded-md bg-slate-800 border-[1px] sm:border-4 border-white' style={{ backgroundImage: `url('/Field-dark.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {formation?.data.map((row: any, rowIndex: number) => (
              <div key={rowIndex} className='flex justify-around'>
                {row.positions.map((position: any, posIndex: number) => (
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
                  <div className='flex flex-row items-center justify-center'>
                    <p className='text-yellow-400 font-bold text-[20px] sm:text-[22px]'>{user && user?.formation}</p>
                  </div>
                </div>
                <div className='bg-slate-800 p-2 sm:p-4 rounded-lg'>
                  <div className='flex flex-row items-center'>
                    <p className='inline-flex py-1 px-2 text-white font-semibold rounded-md text-[16px] sm:text-[25px]'>Overall</p>
                    {/* <p className='ml-auto mr-2 text-green-500 font-bold'>Ready</p> */}
                    <p className='ml-auto mr-2 text-green-500 font-bold text-[15px] sm:text-[22px]'>{overallAverageLevel.toFixed(2)}</p>
                  </div>
                </div>
                {positions
                  .filter(position => filteredPositions.some((userPos: any) => userPos.position === position.symbol))
                  .map((position: any) => (
                    <div key={position.symbol} className='bg-slate-800 p-2 sm:p-4 rounded-lg'>
                      <div className='flex flex-row items-center'>
                        <p style={{ backgroundColor: position.color }} className='inline-flex py-1 px-2 text-white font-semibold rounded-md text-[13px] sm:text-[25px]'>{position.symbol}</p>
                        <div className='ml-auto mr-2 text-yellow-500 font-bold flex flex-col'>
                          <p className='text-[13px] sm:text-[22px]'>{position.level}</p>
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