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
                  <IconDisplay player={mainScenario.player} scenario={mainScenario.scenario.scenario} />
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
                  <IconDisplay player={mainScenario.player} scenario={mainScenario.scenario.scenario} />
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
                    <IconDisplay player={scenario.player} scenario={scenario.scenario.scenario} />
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
                    <IconDisplay player={scenario.player} scenario={scenario.scenario.scenario} />
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
  const shadingColor = isPlayer ? 'rgba(0, 255, 0, 0.45)' : 'rgba(243, 25, 25, 0.55)';
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

const IconDisplay = ({ scenario, player }: { scenario: string, player: string }) => {
  return (
    <>
      {scenario === 'Goal Scored' && <Image src={'/icons/football-green.svg'} alt='ball' height={30} width={30} />}
      {scenario === 'Defense has the ball' && <Image src={'/icons/football-yellow.svg'} alt='ball' height={30} width={30} />}
      {scenario === 'Forward has the ball' && <Image src={'/icons/football-yellow.svg'} alt='ball' height={30} width={30} />}
      {scenario === 'Defense losses the ball to the opposing forward' && <Image src={'/icons/shield-broken-red.svg'} alt='ball' height={40} width={40} />}
      {scenario === 'Defense plays a long ball to the forward' && <Image src={'/icons/cross-yellow.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Defense plays a through pass to the front line of midfield' && <Image src={'/icons/pass-yellow.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Defense plays a short pass to the back line of midfield' && <Image src={'/icons/pass-yellow.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Ball passed to the front line of midfield' && <Image src={'/icons/pass-yellow.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Ball passed to the forward' && <Image src={'/icons/pass-yellow.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Midfield is fouled' && <Image src={'/icons/whistle-green.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Free kick awarded' && <Image src={'/icons/free-kick-yellow.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Player ready to take the penalty' && <Image src={'/icons/penalty-yellow.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Player comes forward' && <Image src={'/icons/penalty-yellow.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Player shoots' && <Image src={'/icons/penalty-yellow.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Penalty awarded' && <Image src={'/icons/penalty-yellow.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Penalty Missed' && <Image src={'/icons/penalty-red.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Penalty is off target' && <Image src={'/icons/off-target-red.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Shot is off target' && <Image src={'/icons/off-target-red.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Goalkeeper saves the penalty' && <Image src={'/icons/goalkeeper-red.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Goalkeeper saves the shot' && <Image src={'/icons/goalkeeper-red.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Penalty hits the woodwork' && <Image src={'/icons/woodwork-red.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Penalty Scored' && <Image src={'/icons/penalty-green.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Goalkeeper catches the ball' && <Image src={'/icons/catch-green.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Defender clears the ball' && <Image src={'/icons/shield-green.svg'} alt='ball' height={50} width={50} />}
      {scenario === 'Forward shoots from the rebound' && <Image src={'/icons/football-shoots-yellow.svg'} alt='ball' height={40} width={40} />}
      {scenario === 'Forward shoots' && <Image src={'/icons/football-shoots-yellow.svg'} alt='ball' height={40} width={40} />}
      {scenario === 'Ball goes out for a corner' && <Image src={'/icons/corner-green.svg'} alt='ball' height={45} width={45} />}
      {scenario === 'Corner is taken' && <Image src={'/icons/cross-yellow.svg'} alt='ball' height={100} width={100} />}
      {scenario === 'Ball hits the woodwork' && <Image src={'/icons/woodwork-red.svg'} alt='ball' height={45} width={45} />}
      {scenario === 'Shot hits the woodwork' && <Image src={'/icons/woodwork-red.svg'} alt='ball' height={45} width={45} />}
      {scenario === 'Forward is caught offside' && <Image src={'/icons/offside-red.svg'} alt='ball' height={45} width={45} />}
      {scenario === 'Defender commits a handball' && <Image src={'/icons/handball-red.svg'} alt='ball' height={45} width={45} />}
      {scenario === 'Corner kick is too high and goes out of play' && <Image src={'/icons/x-red.svg'} alt='ball' height={45} width={45} />}
      {scenario === 'Defender Intercepts the ball' && <Image src={'/icons/shield-green.svg'} alt='ball' height={45} width={45} />}
      {scenario === 'Midfielder takes a direct shot at goal' && <Image src={'/icons/football-shoots-yellow.svg'} alt='ball' height={45} width={45} />}
    </>
  )
}