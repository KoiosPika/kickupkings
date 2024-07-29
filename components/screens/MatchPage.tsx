'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { getMatchByID } from '@/lib/actions/match.actions';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';
import RollingNumber from '../shared/RollingNumber';
import { IMatch } from '@/lib/database/models/match.model';

type Attack = {
  minute: number;
  player: string;
  outcome: string;
  stepIndex: number;
  finalOutcome: string
};

const MatchPage = ({ id }: { id: string }) => {
  const [match, setMatch] = useState<any | null>(null);
  const [displayedScenarios, setDisplayedScenarios] = useState<{ minute: number; player: string; scenario: string }[]>([]);
  const [currentAttackIndex, setCurrentAttackIndex] = useState<number>(0);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);


  useEffect(() => {
    const getMatch = async () => {
      const matchID = id;
      if (matchID) {
        const thisMatch = await getMatchByID(matchID);
        setMatch(thisMatch);
      }
    };

    getMatch();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (match && currentAttackIndex < match.attacks.length) {
        const currentAttack = match.attacks[currentAttackIndex];

        if (currentScenarioIndex < currentAttack.scenario.length) {
          setDisplayedScenarios(prev => [
            { minute: currentAttack.minute, player: currentAttack.player, scenario: currentAttack.scenario[currentScenarioIndex] },
            ...prev  // Use spread operator to add the new scenario at the beginning
          ]);

          if (currentAttack.scenario[currentScenarioIndex] === ('Goal Scored' || 'Penalty Scored')) {
            if (currentAttack.player === 'Player') {
              setPlayerScore(prevScore => prevScore + 1);
            } else if (currentAttack.player === 'Opponent') {
              setOpponentScore(prevScore => prevScore + 1);
            }
          }

          setCurrentScenarioIndex(currentScenarioIndex + 1);
        } else {
          setCurrentAttackIndex(currentAttackIndex + 1);
          setCurrentScenarioIndex(0);
        }

        const totalScenarios = match.attacks.reduce((acc: any, attack: any) => acc + attack.scenario.length, 0);
        const processedScenarios = currentAttackIndex * match.attacks[0].scenario.length + currentScenarioIndex + 1;
        setProgress((processedScenarios / totalScenarios) * 100);
      } else {
        clearInterval(interval);
      }
    }, 2200);

    return () => clearInterval(interval);
  }, [match, currentAttackIndex, currentScenarioIndex]);

  if (!match) {
    return <p>Wait</p>
  }

  return (
    <section className='w-full h-screen flex flex-col bg-gradient-to-b from-slate-900 to-gray-600'>
      <div className='flex flex-row items-center ml-3 mt-2 gap-2'>
        <a href='/' className=' py-2 px-3 rounded-md text-white font-bold'>
          <Image src={'/icons/back.svg'} alt='back' height={10} width={10} />
        </a>
        <p className='font-bold text-white'>{match?.type} Match</p>
      </div>
      <div className='flex flex-row items-center justify-evenly my-3 h-[140px]'>
        <div className='flex flex-col justify-center items-center gap-2 w-[90px] overflow-hidden'>
          <Image src={'/PFP.jpg'} alt='user' height={50} width={50} className='bg-slate-500 h-[50px] w-[50px] rounded-md' />
          <div className='flex flex-row items-center gap-1'>
            <p className='text-white font-semibold text-[14px]'>{match?.Player.username}</p>
            <Image src={`/flags/${match.playerCountry}.svg`} alt='flag' height={20} width={20} className='bg-white h-[18px] w-[18px] rounded-full' />
          </div>
        </div>
        <div className='text-yellow-400 font-semibold h-[70px] flex flex-row items-center text-[50px]'>
          <RollingNumber number={playerScore} />
          <div className='h-[6px] bg-gradient-to-t from-yellow-400 to-yellow-500 w-[20px] rounded-md' />
          <RollingNumber number={opponentScore} />
        </div>
        <div className='flex flex-col justify-center items-center gap-2 w-[90px] overflow-hidden'>
          <Image src={'/PFP.jpg'} alt='user' height={50} width={50} className='bg-slate-500 h-[50px] w-[50px] rounded-md' />
          <div className='flex flex-row items-center gap-1'>
            <p className='text-white font-semibold text-[14px] text-start'>{match?.Opponent.username}</p>
            <Image src={`/flags/${match.opponentCountry}.svg`} alt='flag' height={20} width={20} className='bg-white h-[18px] w-[18px] rounded-full' />
          </div>
        </div>
      </div>
      <div className='w-full flex justify-center items-center'>
        <div className='progress-container w-11/12'>
          <div className='progress-bar bg-yellow-500' style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <div className='flex justify-center items-center my-4'>
        <div
          className='w-[290px] h-[190px]'
          style={{
            backgroundImage: `url('/Field-dark-v.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
      <ScrollArea className='h-[80%]'>
        <div className='flex flex-col justify-center items-center gap-3'>
          {displayedScenarios.map((scenario, index) => (
            <div className='bg-gradient-to-b from-slate-700 to-slate-800 w-5/6 text-center py-2 text-white font-semibold rounded-md shadow-md shadow-slate-800' key={index}>
              {scenario.player === 'Player' &&
                <div className='w-5/6 rounded-md flex flex-row items-center justify-center py-3 px-2'>
                  <div className='w-1/4 flex flex-col justify-center items-center gap-2'>
                    <p className='text-yellow-500 font-semibold'>{scenario.minute}{`'`}</p>
                  </div>
                  <div className='w-3/4 flex flex-col justify-center items gap-2 text-[15px]'>
                    <p>{scenario.scenario}</p>
                  </div>
                </div>}
              {scenario.player === 'Opponent' &&
                <div className='w-5/6 rounded-md flex flex-row items-center justify-center py-3 ml-auto px-2'>
                  <div className='w-3/4 flex flex-col justify-center items gap-2 text-[15px]'>
                    <p>{scenario.scenario}</p>
                  </div>
                  <div className='w-1/4 flex flex-col justify-center items-center gap-2'>

                    <p className='text-yellow-500 font-semibold'>{scenario.minute}{`'`}</p>
                  </div>
                </div>}
              {scenario.player === 'Match' &&
                <div className='text-center'>
                  {scenario.scenario}
                </div>}
            </div>
          ))}
        </div>
      </ScrollArea>
    </section >
  );
};
export default MatchPage