'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { getMatchByID } from '@/lib/actions/match.actions';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';

type Attack = {
  minute: number;
  player: string;
  outcome: string;
  stepIndex: number;
  finalOutcome: string
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
  'Awaiting Penalties': ['Awaiting Penalties'],
  'Player Penalty Scored': [
    'Player ready to shoot',
    'Player comes forward',
    'Penalty scored!'
  ],
  'Player Penalty Missed': [
    'Player ready to shoot',
    'Player comes forward',
    'Penalty Missed'
  ],
  'Opponent Penalty Scored': [
    'Opponent ready to shoot',
    'Opponent comes forward',
    'Penalty scored!'
  ],
  'Opponent Penalty Missed': [
    'Opponent ready to shoot',
    'Opponent comes forward',
    'Penalty Missed'
  ]
};

const MatchPage = ({ id }: { id: string }) => {
  const [match, setMatch] = useState<Match | null>(null);
  const [displayedAttacks, setDisplayedAttacks] = useState<{ minute: number; player: string; outcome: string, stepIndex: number, finalOutcome: string }[]>([]);
  const [currentSteps, setCurrentSteps] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);

  useEffect(() => {
    const getMatch = async () => {
      const matchID = id;
      if (matchID) {
        const thisMatch = await getMatchByID(matchID);
        setMatch(thisMatch);
        setDisplayedAttacks([{ minute: 0, player: 'Match', outcome: '', stepIndex: 0, finalOutcome:'' }]);
        setCurrentSteps(['Match Started']);
      }
    };

    getMatch();
  }, [id]);

  useEffect(() => {
    if (!match) return;

    const interval = setInterval(() => {
      if (stepIndex < currentSteps.length) {
        setDisplayedAttacks(prev => {
          const updated = [...prev];
          updated[0] = { ...updated[0], outcome: currentSteps[stepIndex], stepIndex };

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
          { minute: currentAttack.minute, player: currentAttack.player, outcome: steps[0], stepIndex: 0, finalOutcome: currentAttack.outcome },
          ...prev
        ]);
        setCurrentIndex(currentIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [match, currentSteps, stepIndex, currentIndex]);

  return (
    <section className='w-full h-screen flex flex-col bg-slate-800'>
      <div className='flex flex-row items-center justify-evenly'>
        <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[50px] w-[50px] rounded-md' />
        <p className='place-self-center text-[50px] text-yellow-400 font-bold'> {playerScore} - {opponentScore} </p>
        <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[50px] w-[50px] rounded-md' />
      </div>
      <ScrollArea className='h-[80%]'>
        <div className='flex flex-col justify-center items-center gap-3'>
          {displayedAttacks.map((attack, index) => {
            const steps = stepsMap[attack.finalOutcome];
            return (
              <div className='bg-slate-900 w-5/6 text-center py-2 text-white font-semibold rounded-md' key={index}>
                {attack.player === 'Player' &&
                  <div className='w-5/6 rounded-md flex flex-row items-center justify-center py-3 px-2'>
                    <div className='w-1/4 flex flex-col justify-center items-center gap-2'>
                      {attack.stepIndex < steps.length - 1 ? (
                        <Image className='animate-spin' src={'/icons/Football-yellow.svg'} alt='ball' height={20} width={20} />
                      ) : (
                        <>
                          {attack.outcome === 'Goalkeeper saves the shot' && <Image src={'/icons/goalkeeper-red.svg'} alt='final' height={30} width={30} />}
                          {attack.outcome === 'Defender intercepts the ball' && <Image src={'/icons/shield-red.svg'} alt='final' height={35} width={35} />}
                          {attack.outcome === 'Forward caught offside' && <Image src={'/icons/offside-red.svg'} alt='final' height={35} width={35} />}
                          {attack.outcome === 'Midfield fouled by opponent' && <Image src={'/icons/whistle-red.svg'} alt='final' height={35} width={35} />}
                          {attack.outcome === 'Goal scored!' && <Image src={'/icons/Football-green.svg'} alt='final' height={25} width={25} />}
                          {attack.outcome === 'Midfield loses the ball' && <Image src={'/icons/x-red.svg'} alt='final' height={25} width={25} />}
                          {attack.outcome === 'Penalty scored!' && <Image src={'/icons/penalty-green.svg'} alt='final' height={30} width={30} />}
                          {attack.outcome === 'Penalty Missed' && <Image src={'/icons/penalty-red.svg'} alt='final' height={30} width={30} />}
                        </>
                      )}
                      <p className='text-yellow-500 font-semibold'>{attack.minute}</p>
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
                      {attack.stepIndex < steps.length - 1 ? (
                        <Image className='animate-spin' src={'/icons/Football-yellow.svg'} alt='ball' height={20} width={20} />
                      ) : (
                        <>
                          {attack.outcome === 'Goalkeeper saves the shot' && <Image src={'/icons/goalkeeper-green.svg'} alt='final' height={30} width={30} />}
                          {attack.outcome === 'Defender intercepts the ball' && <Image src={'/icons/shield-green.svg'} alt='final' height={35} width={35} />}
                          {attack.outcome === 'Forward caught offside' && <Image src={'/icons/offside-green.svg'} alt='final' height={35} width={35} />}
                          {attack.outcome === 'Midfield fouled by opponent' && <Image src={'/icons/whistle-green.svg'} alt='final' height={35} width={35} />}
                          {attack.outcome === 'Goal scored!' && <Image src={'/icons/Football-red.svg'} alt='final' height={25} width={25} />}
                          {attack.outcome === 'Midfield loses the ball' && <Image src={'/icons/x-green.svg'} alt='final' height={25} width={25} />}
                          {attack.outcome === 'Penalty scored!' && <Image src={'/icons/penalty-green.svg'} alt='final' height={30} width={30} />}
                          {attack.outcome === 'Penalty Missed' && <Image src={'/icons/penalty-red.svg'} alt='final' height={30} width={30} />}
                        </>
                      )}
                      <p className='text-yellow-500 font-semibold'>{attack.minute}</p>
                    </div>
                  </div>}
                {attack.player === 'Match' &&
                  <div className='text-center'>
                    {attack.outcome}
                  </div>}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </section>
  );
};
export default MatchPage