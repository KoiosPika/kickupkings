import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Predictions } from '@/constants/Earnings';
import { IUserData } from '@/lib/database/models/userData.model';
import { addOrUpdatePrediction, collectCoins, getUserByUserID } from '@/lib/actions/user.actions';
import { Ranks } from '@/constants';

const EarnPage = () => {

  const [user, setUser] = useState<IUserData>()
  const [predictions, setPredictions] = useState<any>({});

  useEffect(() => {
    const getUser = async () => {
      const userData = await getUserByUserID('6699bfa1ba8348c3228f89ab')
      setUser(userData)

      const initialPredictions: any = {};
      userData.dailyPredictions.forEach((prediction: any) => {
        initialPredictions[prediction.matchId] = {
          team1: prediction.predictedTeam1Score,
          team2: prediction.predictedTeam2Score
        };
      });
      setPredictions(initialPredictions);
    }

    getUser()
  }, [])


  const handlePredictionChange = (matchId: string, score: string, team: string) => {
    setPredictions({
      ...predictions,
      [matchId]: { ...predictions[matchId], [team]: score }
    });
  };

  const handlePredictionSubmit = async (matchId: string) => {
    const { team1: predictedTeam1Score, team2: predictedTeam2Score } = predictions[matchId];
    if (predictedTeam1Score === undefined || predictedTeam2Score === undefined) {
      return;
    }
    try {
      await addOrUpdatePrediction('6699bfa1ba8348c3228f89ab', matchId, parseInt(predictedTeam1Score), parseInt(predictedTeam2Score));
    } catch (error) {

    }
  };

  const saveAllPredictions = async () => {
    try {
      for (const matchId in predictions) {
        await handlePredictionSubmit(matchId);
      }

    } catch (error) {

    }
  };

  const handleCollectCoins = async (matchId: string) => {
    try {
      await collectCoins('6699bfa1ba8348c3228f89ab', matchId);
      alert('Coins collected!');
      // Fetch user data again to update the state
      const updatedUser = await getUserByUserID('6699bfa1ba8348c3228f89ab');
      setUser(updatedUser);
    } catch (error) {
      alert('Error collecting coins');
    }
  };

  if (!user) {
    return (<Image src={'/icons/spinner.svg'} alt='spinner' height={30} width={30} className='animate-spin' />)
  }

  return (
    <div className='w-full h-screen bg-gradient-to-b from-slate-900 to-gray-600'>
      <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
        <Image src={'/PFP.jpg'} alt='user' height={50} width={50} className='bg-slate-500 h-[30px] w-[30px] rounded-lg' />
        <p className='font-semibold text-white text-[13px]'>{user?.User.username} ({user?.Rank})</p>
      </div>
      <ScrollArea style={{ height: 'calc(100vh - 130px)' }}>
        <div className='w-full flex flex-col justify-center items-center my-3'>
          <p className='font-semibold text-white text-[20px] mt-2 bg-slate-800 border-b-[5px] border-white px-2 py-1 rounded-md'>Daily Predictions</p>
          {Predictions.map((prediction: any) => {
            const isPredictionTimePassed = new Date() > new Date(prediction.lastTimeToPredict);
            const userPrediction = user && user.dailyPredictions.find((p: any) => p.matchId === prediction.id);
            const isCorrectPrediction = userPrediction &&
              userPrediction.predictedTeam1Score === prediction.team1Score &&
              userPrediction.predictedTeam2Score === prediction.team2Score;
            const isCollected = userPrediction && userPrediction.collected;
            const rankData = Ranks.find(rank => rank.rank === user.Rank);
            return (
              <div key={prediction.id} className='w-10/12 flex flex-col gap-1 items-center justify-around relative'>
                <div className='w-full flex flex-row gap-2 items-center justify-around my-4 relative bg-slate-600 px-2 py-4 rounded-lg text-white'>
                  <div className='flex flex-col justify-center items-center gap-2 font-semibold w-1/3'>
                    <Image src={`/flags/${prediction.team1Country}.svg`} alt='es' height={40} width={40} className='rounded-full border-2 border-white' />
                    <p>{prediction.team1}</p>
                  </div>
                  <div className='flex flex-col gap-3 justify-center items-center'>
                    <div className='flex flex-row items-center gap-2'>
                      <Input
                        type='number'
                        className='text-[16px] w-[40px] font-bold text-center text-black'
                        value={predictions[prediction.id]?.team1 || (userPrediction ? userPrediction.predictedTeam1Score : '')}
                        onChange={(e) => handlePredictionChange(prediction.id, e.target.value, 'team1')}
                        disabled={isPredictionTimePassed}
                      />
                      <p className='text-white font-bold'>-</p>
                      <Input
                        type='number'
                        className='text-[16px] w-[40px] font-bold text-center text-black'
                        value={predictions[prediction.id]?.team2 || (userPrediction ? userPrediction.predictedTeam2Score : '')}
                        onChange={(e) => handlePredictionChange(prediction.id, e.target.value, 'team2')}
                        disabled={isPredictionTimePassed}
                      />
                    </div>
                    {prediction.finished && isCorrectPrediction && !isCollected ? (
                      <div
                        className='flex flex-row items-center justify-center gap-3 bg-green-600 px-2 py-1 rounded-md cursor-pointer'
                        onClick={() => handleCollectCoins(prediction.id)}
                      >
                        <Image src={'/icons/coin.svg'} alt='coin' height={20} width={20} />
                        <p className='font-bold'>{rankData ? (rankData.predictionPrize).toLocaleString() : 0}</p>
                      </div>
                    ) : (
                      <div className='flex flex-row items-center justify-center gap-3 bg-red-500 px-2 py-1 rounded-md'>
                        <Image src={'/icons/coin.svg'} alt='coin' height={20} width={20} />
                        <p className='font-bold text-white'>{rankData ? (rankData.predictionPrize).toLocaleString() : 0}</p>
                      </div>
                    )}
                  </div>
                  <div className='flex flex-col justify-center items-center gap-2 font-semibold w-1/3'>
                    <Image src={`/flags/${prediction.team2Country}.svg`} alt='es' height={40} width={40} className='rounded-full  border-2 border-white' />
                    <p>{prediction.team2}</p>
                  </div>
                </div>
              </div>
            )
          })}
          <div className='w-full flex justify-center items-center'>
            <div
              className='bg-green-700 flex flex-row items-center gap-2 px-4 py-1 rounded-full'
              onClick={saveAllPredictions}
            >
              <Image src={'/icons/save.svg'} alt='save' height={20} width={20} />
              <p className='font-bold text-white'>Save All Predictions</p>
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className='h-[80px] mt-auto' />
    </div>
  );
};

export default EarnPage