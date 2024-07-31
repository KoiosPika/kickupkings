import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Predictions, Quizzes } from '@/constants/Earnings';
import { IUserData } from '@/lib/database/models/userData.model';
import { addOrUpdatePrediction, addOrUpdateQuiz, collectCoins, getUserByUserID } from '@/lib/actions/user.actions';
import { Ranks } from '@/constants';

const EarnPage = () => {

  const [height, setHeight] = useState<number>(window.innerHeight)
  const [user, setUser] = useState<IUserData>()

  const updateDimensions = () => {
    setHeight(window.innerHeight);
  }

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

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

  const [quizAnswers, setQuizAnswers] = useState<any>({});
  const [predictions, setPredictions] = useState<any>({});

  const handleQuizChange = (quizId: string, answer: string) => {
    setQuizAnswers({
      ...quizAnswers,
      [quizId]: answer
    });
  };

  const handlePredictionChange = (matchId: string, score: string, team: string) => {
    setPredictions({
      ...predictions,
      [matchId]: { ...predictions[matchId], [team]: score }
    });
  };

  const handleQuizSubmit = async (quizId: string) => {
    try {
      await addOrUpdateQuiz('6699bfa1ba8348c3228f89ab', quizId, quizAnswers[quizId]);

      const thisUser = await getUserByUserID('6699bfa1ba8348c3228f89ab')
      setUser(thisUser)
    } catch (error) {

    }
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
        <div className='w-full flex flex-col justify-center items-center'>
          <p className='font-semibold text-white text-[20px] mt-2 bg-slate-800 px-2 py-1 rounded-md'>Daily Quizzes</p>
          {Quizzes.map((quiz, index) => {
            const isAnswered = user && user.dailyQuizzes.some(q => q.quizId === quiz.id && q.answered);
            const rankData = Ranks.find(rank => rank.rank === user.Rank);
            return (
              <div key={quiz.id} className='gap-2 flex flex-col justify-center items-center my-2'>
                {index === 0 && (
                  <div className='my-2 flex flex-row items-center gap-2'>
                    <p className='font-semibold text-white'>Find the quiz on Telegram Channel</p>
                    <Image src={'/icons/telegram.svg'} alt='link' height={100} width={100} className='bg-white h-[30px] w-[30px] p-[2px] rounded-full' />
                  </div>
                )}
                {index === 1 && (
                  <div className='my-2 flex flex-row items-center gap-2 mt-6'>
                    <p className='font-semibold text-white'>Find the quiz on X</p>
                    <Image src={'/icons/x-twitter.svg'} alt='twitter' height={100} width={100} className='bg-white h-[30px] w-[30px] p-[3px] rounded-md' />
                  </div>
                )}
                {isAnswered ? (
                  <div className='flex flex-row items-center relative w-[300px]'>
                    <Input
                      className='font-bold text-center text-[18px] bg-green-600 text-white border-2 border-white h-[50px] rounded-full'
                      value={quiz.answer}
                      readOnly
                    />
                  </div>
                ) : (
                  <div className='flex flex-row items-center relative w-[300px]'>
                    <Input
                      className='font-bold text-center text-[18px] bg-slate-500 text-white border-2 border-white h-[50px] rounded-full'
                      value={quizAnswers[quiz.id] || ''}
                      onChange={(e) => handleQuizChange(quiz.id, e.target.value)}
                    />
                    <Image
                      src={'/icons/send.svg'}
                      alt='send'
                      height={100}
                      width={100}
                      className='bg-white h-[30px] w-[30px] p-[3px] rounded-full rotate-45 absolute right-2 cursor-pointer'
                      onClick={() => handleQuizSubmit(quiz.id)}
                    />
                  </div>
                )}
                <div className={`flex flex-row items-center justify-center gap-3 px-2 py-1 rounded-full ${isAnswered ? 'bg-green-600' : 'bg-white'}`}>
                  <Image src={'/icons/coin.svg'} alt='coin' height={25} width={25} />
                  <p className='font-bold text-white'>{rankData ? (rankData.quizPrize).toLocaleString() : 0}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className='w-full flex flex-col justify-center items-center my-3'>
          <p className='font-semibold text-white text-[20px] mt-2 bg-slate-800 px-2 py-1 rounded-md'>Daily Predictions</p>
          {Predictions.map((prediction: any) => {
            const isPredictionTimePassed = new Date() > new Date(prediction.lastTimeToPredict);
            const userPrediction = user && user.dailyPredictions.find((p: any) => p.matchId === prediction.id);
            const isCorrectPrediction = userPrediction &&
              userPrediction.predictedTeam1Score === prediction.team1Score &&
              userPrediction.predictedTeam2Score === prediction.team2Score;
            const isCollected = userPrediction && userPrediction.collected;
            const rankData = Ranks.find(rank => rank.rank === user.Rank);
            return (
              <div key={prediction.id} className='w-10/12 flex flex-col gap-2 items-center justify-around my-4 relative'>
                <div className='w-full flex flex-row gap-2 items-center justify-around my-4 relative'>
                  <Image src={`/teams/${prediction.team1}.png`} alt={prediction.team1} height={50} width={50} className='h-[50px] w-[40px]' />
                  <Input
                    type='number'
                    className='text-[16px] w-[40px] font-bold text-center'
                    value={predictions[prediction.id]?.team1 || (userPrediction ? userPrediction.predictedTeam1Score : '')}
                    onChange={(e) => handlePredictionChange(prediction.id, e.target.value, 'team1')}
                    disabled={isPredictionTimePassed}
                  />
                  <p className='text-white font-bold'>-</p>
                  <Input
                    type='number'
                    className='text-[16px] w-[40px] font-bold text-center'
                    value={predictions[prediction.id]?.team2 || (userPrediction ? userPrediction.predictedTeam2Score : '')}
                    onChange={(e) => handlePredictionChange(prediction.id, e.target.value, 'team2')}
                    disabled={isPredictionTimePassed}
                  />
                  <Image src={`/teams/${prediction.team2}.png`} alt={prediction.team2} height={50} width={50} className='h-[50px] w-[40px]' />
                </div>
                {prediction.finished && isCorrectPrediction && !isCollected ? (
                  <div
                    className='flex flex-row items-center justify-center gap-3 bg-green-600 px-2 py-1 rounded-full cursor-pointer'
                    onClick={() => handleCollectCoins(prediction.id)}
                  >
                    <Image src={'/icons/coin.svg'} alt='coin' height={25} width={25} />
                    <p className='font-bold'>{rankData ? (rankData.predictionPrize).toLocaleString() : 0}</p>
                  </div>
                ) : (
                  <div className='flex flex-row items-center justify-center gap-3 bg-red-500 px-2 py-1 rounded-full'>
                    <Image src={'/icons/coin.svg'} alt='coin' height={25} width={25} />
                    <p className='font-bold text-white'>{rankData ? (rankData.predictionPrize).toLocaleString() : 0}</p>
                  </div>
                )}
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