'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { getMatchByID } from '@/lib/actions/match.actions';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';
import RollingNumber from '../shared/RollingNumber';
import { IMatch } from '@/lib/database/models/match.model';
import { matchPositions } from '@/constants';

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
  const [mainScenario, setMainScernario] = useState<{ minute: number; player: string; scenario: any }>()
  const [currentAttackIndex, setCurrentAttackIndex] = useState<number>(0);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [currentScenario, setCurrentScenario] = useState({ line: 4, player: 'Player' });
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
          const scenario = currentAttack.scenario[currentScenarioIndex];

          setMainScernario({ minute: currentAttack.minute, player: currentAttack.player, scenario: currentAttack.scenario[currentScenarioIndex] })

          setCurrentScenario({
            line: scenario.line,
            player: currentAttack.player
          });

          const scenarioText = currentAttack.scenario[currentScenarioIndex].scenario;
          if (scenarioText === 'Goal Scored' || scenarioText === 'Penalty Scored') {
            if (currentAttack.player === 'Player') {
              setPlayerScore(prevScore => prevScore + 1);
            } else if (currentAttack.player === 'Opponent') {
              setOpponentScore(prevScore => prevScore + 1);
            }
          }

          setDisplayedScenarios(prev => [
            { minute: currentAttack.minute, player: currentAttack.player, scenario: currentAttack.scenario[currentScenarioIndex] },
            ...prev
          ]);

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
    }, (match && match.attacks[currentAttackIndex]?.scenario[currentScenarioIndex]?.wait) || 2200);

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
      <ScrollArea className='h-[85%]'>
        {mainScenario &&
          <div className='w-full text-center text-white font-semibold rounded-md place-self-center h-[80px] flex flex-row justify-center items-center'>
            {mainScenario.player === 'Player' &&
              <div className='w-5/6 rounded-md flex flex-row items-center justify-center py-3 mr-auto px-2'>
                <div className='w-1/4 flex flex-col justify-center items-center gap-2'>
                  <IconDisplay scenario={mainScenario.scenario.scenario} />
                  <p className='text-yellow-500 font-semibold '>{mainScenario.minute}{`'`}</p>
                </div>
                <div className='w-3/4 flex flex-col justify-center items gap-2 text-[15px]'>
                  <p>{mainScenario.scenario.scenario}</p>
                </div>
              </div>}
            {mainScenario.player === 'Opponent' &&
              <div className='w-5/6 rounded-md flex flex-row items-center justify-center py-3 ml-auto px-2'>
                <div className='w-3/4 flex flex-col justify-center items gap-2 text-[15px]'>
                  <p>{mainScenario.scenario.scenario}</p>
                </div>
                <div className='w-1/4 flex flex-col justify-center items-center gap-2'>
                  <IconDisplay scenario={mainScenario.scenario.scenario} />
                  <p className='text-yellow-500 font-semibold'>{mainScenario.minute}{`'`}</p>
                </div>
              </div>}
            {mainScenario.player === 'Match' &&
              <div className='text-center'>
                {mainScenario.scenario.scenario}
              </div>}
          </div>}
        <div className='flex justify-center items-center my-4'>
          <Field currentLine={currentScenario.line} player={currentScenario.player} />
        </div>
        <div className='w-full flex justify-center items-center'>
          <p className='place-self-center text-white font-semibold mb-2'>All Highlights</p>
        </div>
        <div className='flex flex-col justify-center items-center gap-3'>
          {displayedScenarios.map((scenario: any, index: number) => (
            <div className='bg-gradient-to-b from-slate-700 to-slate-800 w-5/6 text-center py-2 text-white font-semibold rounded-md shadow-md shadow-slate-800' key={index}>
              {scenario.player === 'Player' &&
                <div className='w-5/6 rounded-md flex flex-row items-center justify-center py-3 px-2'>
                  <div className='w-1/4 flex flex-col justify-center items-center gap-2'>
                    <IconDisplay scenario={scenario.scenario.scenario} />
                    <p className='text-yellow-500 font-semibold'>{scenario.minute}{`'`}</p>
                  </div>
                  <div className='w-3/4 flex flex-col justify-center items gap-2 text-[15px]'>
                    <p>{scenario.scenario.scenario}</p>
                  </div>
                </div>}
              {scenario.player === 'Opponent' &&
                <div className='w-5/6 rounded-md flex flex-row items-center justify-center py-3 ml-auto px-2'>
                  <div className='w-3/4 flex flex-col justify-center items gap-2 text-[15px]'>
                    <p>{scenario.scenario.scenario}</p>
                  </div>
                  <div className='w-1/4 flex flex-col justify-center items-center gap-2'>
                    <IconDisplay scenario={scenario.scenario.scenario} />
                    <p className='text-yellow-500 font-semibold'>{scenario.minute}{`'`}</p>
                  </div>
                </div>}
              {scenario.player === 'Match' &&
                <div className='text-center'>
                  {scenario.scenario.scenario}
                </div>}
            </div>
          ))}
        </div>
      </ScrollArea>
    </section >
  );
};
export default MatchPage

const Field = ({ currentLine, player }: { currentLine: number, player: string }) => {

  const fieldHeight = 190;
  const fieldWidth = 290;
  const lines = 10;

  const shadingWidth = (fieldWidth / lines) * currentLine;
  const isPlayer = player === 'Player';
  const shadingColor = player === 'Player'
    ? 'rgba(0, 255, 0, 0.45)'
    : player === 'Opponent'
      ? 'rgba(243, 25, 25, 0.55)'
      : 'transparent';
  const shadingLeft = isPlayer ? '0' : 'auto';
  const shadingRight = isPlayer ? 'auto' : '0';

  const borderRadiusStyle = isPlayer
    ? { borderTopRightRadius: '50%', borderBottomRightRadius: '50%' }
    : { borderTopLeftRadius: '50%', borderBottomLeftRadius: '50%' };

  return (
    <div className="field" style={{ width: fieldWidth, height: fieldHeight, position: 'relative' }}>
      <div
        className="shading"
        style={{
          width: `${shadingWidth}px`,
          height: '100%',
          backgroundColor: shadingColor,
          position: 'absolute',
          left: shadingLeft,
          right: shadingRight,
          transform: !isPlayer ? 'none' : 'scale(-1)'
        }}
      />
    </div>
  );
};

const IconDisplay = ({ scenario }: { scenario: string }) => {
  const { src, alt, size } = getIconProps(scenario);
  return <img src={src} alt={alt} height={size} width={size} />;
};

const getIconProps = (scenario: string) => {
  switch (scenario) {
    case 'Play kicks-off':
      return { src: '/icons/whistle-green.svg', alt: 'whistle', size: 30 }
    case 'Goal Scored':
      return { src: '/icons/football-green-1.svg', alt: 'Goal Scored', size: 35 };
    case 'Defense has the ball':
    case 'Forward has the ball':
    case `Forward's chance`:
    case `Midfield has the ball`:
    case `Keeper has the ball`:
      return { src: '/icons/football-yellow-1.svg', alt: 'Has the ball', size: 35 };
    case 'Defense loses possession':
      return { src: '/icons/shield-broken-red.svg', alt: 'Loses the ball', size: 40 };
    case 'Long ball to forward':
    case 'Corner kick cross':
    case 'Keeper plays long pass':
      return { src: '/icons/cross-yellow.svg', alt: 'Long ball to forward', size: 50 };
    case 'Defense plays a through pass to the front line of midfield':
    case 'Pass to backline midfield':
    case 'Ball passed to the forward':
    case 'Pass to frontline midfield':
    case 'GoalKeeper plays short pass':
    case `Midfielder's pass`:
      return { src: '/icons/pass-yellow.svg', alt: 'Pass to forward', size: 50 };
    case 'Midfield is fouled':
    case 'Defender fouls the forward':
      return { src: '/icons/whistle-red.svg', alt: 'Fouled', size: 50 };
    case 'Free kick awarded':
      return { src: '/icons/free-kick-yellow.svg', alt: 'Free kick awarded', size: 50 };
    case 'Player ready to take the penalty':
    case 'Player comes forward':
    case 'Player shoots':
    case 'Penalty committed':
      return { src: '/icons/penalty-yellow.svg', alt: 'Penalty preparation', size: 50 };
    case 'Penalty awarded':
      return { src: '/icons/penalty-yellow.svg', alt: 'Penalty awarded', size: 50 };
    case 'Penalty Missed':
      return { src: '/icons/penalty-red.svg', alt: 'Penalty missed', size: 50 };
    case 'Penalty is off target':
    case 'Shot is off target':
      return { src: '/icons/off-target-red.svg', alt: 'Off target', size: 50 };
    case 'Goalkeeper saves the penalty':
    case 'Goalkeeper saves the shot':
      return { src: '/icons/goalkeeper-red.svg', alt: 'Goalkeeper saves', size: 50 };
    case 'Penalty hits the woodwork':
    case 'Shot hits the woodwork':
    case 'Ball hits the woodwork':
    case 'Header hits the woodwork':
      return { src: '/icons/woodwork-red.svg', alt: 'Hits woodwork', size: 45 };
    case 'Penalty Scored':
      return { src: '/icons/penalty-green.svg', alt: 'Penalty scored', size: 50 };
    case 'Goalkeeper catches the ball':
      return { src: '/icons/catch-green.svg', alt: 'Goalkeeper catches', size: 50 };
    case 'Defender clears the ball':
      return { src: '/icons/shield-green.svg', alt: 'Clears ball', size: 50 };
    case 'Defender blocks the shot':
      return { src: '/icons/shield-green.svg', alt: 'Clears ball', size: 50 };
    case 'Forward shoots from the rebound':
    case 'Forward shoots':
    case 'Midfielder takes a direct shot at goal':
    case 'Forward heads the ball':
      return { src: '/icons/football-shoots-yellow.svg', alt: 'Shoots', size: 40 };
    case 'Ball goes out for a corner':
      return { src: '/icons/corner-green.svg', alt: 'Out for a corner', size: 45 };
    case 'Forward is caught offside':
      return { src: '/icons/offside-red.svg', alt: 'Caught offside', size: 45 };
    case 'Defender commits a handball':
      return { src: '/icons/handball-red.svg', alt: 'Handball committed', size: 45 };
    case 'Cross is too high':
      return { src: '/icons/x-red.svg', alt: 'Out of play', size: 45 };
    case 'Defender Intercepts the ball':
    case 'Midfield backline interception':
    case 'Midfield frontline interception':
      return { src: '/icons/shield-green.svg', alt: 'Intercepts', size: 45 };
    default:
      return { src: '/icons/default-icon.svg', alt: 'Default icon', size: 45 }; // Fallback
  }
}