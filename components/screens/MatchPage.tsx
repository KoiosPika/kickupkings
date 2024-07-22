'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import { getMatchByID } from '@/lib/actions/match.actions';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';
import ErrorBoundary from '../shared/ErrorBoundry';

type Attack = {
  minute: number;
  player: string;
  outcome: string;
};

type Match = {
  Player: string;
  Opponent: string;
  attacks: Attack[];
};

const stepsMap: { [key: string]: string[] } = {
  'Midfield Interception': [
    'Your team attacking',
    'Defender passes the ball to midfield',
    'Midfield loses the ball'
  ],
  'Goalkeeper Save': [
    'Your team attacking',
    'Defender passes the ball to midfield',
    'Midfield passes to forward',
    'Forward shoots',
    'Goalkeeper saves the shot'
  ],
  'Goal Scored': [
    'Your team attacking',
    'Defender passes the ball to midfield',
    'Midfield passes to forward',
    'Forward shoots',
    'Goal scored!'
  ],
  'Defender Interception': [
    'Your team attacking',
    'Defender passes the ball to midfield',
    'Midfield passes to forward',
    'Defender intercepts the ball'
  ],
  'Foul': [
    'Your team attacking',
    'Defender passes the ball to midfield',
    'Midfield fouled by opponent'
  ],
  'Offside': [
    'Your team attacking',
    'Defender passes the ball to midfield',
    'Forward caught offside'
  ],
  'Match Started': ['Match Started'],
  'Half-time': ['Half-time'],
  'Full-time': ['Full-time'],
  'Awaiting Extra Time': ['Awaiting Extra Time'],
  'Awaiting Penalties': ['Awaiting Penalties']
};

const MatchPage = () => {
  const searchParams = useSearchParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [displayedAttacks, setDisplayedAttacks] = useState<{ minute: number; player: string; outcome: string }[]>([]);
  const [currentSteps, setCurrentSteps] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);

  useEffect(() => {
    const getMatch = async () => {
      const matchID = searchParams.get('matchID');
      if (matchID) {
        const thisMatch = await getMatchByID(matchID);
        setMatch(thisMatch);
        setDisplayedAttacks([{ minute: 0, player: 'Match', outcome: '' }]);
        setCurrentSteps(['Match Started']);
      }
    };

    getMatch();
  }, [searchParams]);

  useEffect(() => {
    if (!match) return;

    const interval = setInterval(() => {
      if (stepIndex < currentSteps.length) {
        setDisplayedAttacks(prev => {
          const updated = [...prev];
          updated[0].outcome = currentSteps[stepIndex];

          // Check if the current step is "Goal scored!"
          if (currentSteps[stepIndex] === 'Goal scored!') {
            if (updated[0].player === 'Player') {
              setPlayerScore(prevScore => prevScore + 1);
            } else if (updated[0].player === 'Opponent') {
              setOpponentScore(prevScore => prevScore + 1);
            }
          }

          return updated;
        });
        setStepIndex(stepIndex + 1);
      } else if (currentIndex < match.attacks.length) {
        const currentAttack = match.attacks[currentIndex];
        const steps = stepsMap[currentAttack.outcome] || [currentAttack.outcome];
        setCurrentSteps(steps);
        setStepIndex(0);
        setDisplayedAttacks(prev => [
          { minute: currentAttack.minute, player: currentAttack.player, outcome: steps[0] },
          ...prev
        ]);
        setCurrentIndex(currentIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [match, currentSteps, stepIndex, currentIndex]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section className='w-full h-screen flex flex-col bg-slate-800'>
          <div className='flex flex-row items-center justify-evenly'>
            <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[50px] w-[50px] rounded-md' />
            <p className='place-self-center text-[60px] text-white font-bold'> {playerScore / 2} - {opponentScore / 2} </p>
            <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[50px] w-[50px] rounded-md' />
          </div>
          <ScrollArea className='h-[75%]'>
            <div className='flex flex-col justify-center items-center gap-3'>
              {displayedAttacks.map((attack, index) => (
                <div className='bg-slate-900 w-5/6 text-center py-2 text-white font-semibold rounded-md' key={index}>
                  {attack.player === 'Player' &&
                    <div className='w-5/6 rounded-md flex flex-row items-center justify-center py-3 px-2'>
                      <div className='w-1/4 flex flex-col justify-center items-center gap-2'>
                        <Image className='animate-spin' src={'/icons/Football-white.svg'} alt='ball' height={15} width={15} />
                        <p className='text-green-500 font-semibold'>{attack.minute}</p>
                      </div>
                      <div className='w-3/4 flex flex-col justify-center items gap-2'>
                        <p>{attack.outcome}</p>
                      </div>
                    </div>}
                  {attack.player === 'Opponent' &&
                    <div className='w-5/6 rounded-md flex flex-row items-center justify-center py-3 ml-auto px-2'>
                      <div className='w-3/4 flex flex-col justify-center items gap-2'>
                        <p>{attack.outcome}</p>
                      </div>
                      <div className='w-1/4 flex flex-col justify-center items-center gap-2'>
                        <Image className='animate-spin' src={'/icons/Football-white.svg'} alt='ball' height={15} width={15} />

                        <p className='text-green-500 font-semibold'>{attack.minute}</p>
                      </div>
                    </div>}
                  {attack.player === 'Match' &&
                    <div className='text-center'>
                      {attack.outcome}
                    </div>}
                </div>
              ))}
            </div>
          </ScrollArea>
        </section>
      </Suspense>
    </ErrorBoundary>
  );
};
export default MatchPage