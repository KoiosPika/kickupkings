import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Predictions, Quizzes } from '@/constants/Earnings';
import { IUserData } from '@/lib/database/models/userData.model';
import { addOrUpdatePrediction, addOrUpdateQuiz, getUserByUserID } from '@/lib/actions/user.actions';

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

  const handlePredictionChange = (matchId: string, score: number) => {
    setPredictions({
      ...predictions,
      [matchId]: score
    });
  };

  const handleQuizSubmit = async (quizId: string) => {
    try {
      await addOrUpdateQuiz('6699bfa1ba8348c3228f89ab', quizId, quizAnswers[quizId]);
      alert('Quiz answer submitted!');
    } catch (error) {
      alert('Error submitting quiz answer');
    }
  };

  const handlePredictionSubmit = async (matchId: string) => {
    try {
      await addOrUpdatePrediction('6699bfa1ba8348c3228f89ab', matchId, predictions[matchId]);
      alert('Prediction submitted!');
    } catch (error) {
      alert('Error submitting prediction');
    }
  };

  const saveAllPredictions = async () => {
    try {
      for (const matchId in predictions) {
        await handlePredictionSubmit(matchId);
      }
      alert('All predictions saved!');
    } catch (error) {
      alert('Error saving predictions');
    }
  };

  return (
    <div className='w-full h-screen'>
      <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
        <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] rounded-lg' />
        {user && <p className='font-semibold text-white text-[13px]'>{`Rami (${user.Rank})`}</p>}
        <p className='font-semibold text-white text-[13px]'>{`->`}</p>
      </div>
      <ScrollArea style={{ height: 'calc(100vh - 130px)' }}>
        <div className='w-full flex flex-col justify-center items-center'>
          <p className='font-semibold text-white text-[20px] mt-2 bg-slate-800 px-2 py-1 rounded-md'>Daily Quizzes</p>
          {Quizzes.map((quiz , index) => (
            <div key={quiz.id} className='gap-2 flex flex-col justify-center items-center my-2'>
              {index === 0 && <div className='my-2 flex flex-row items-center gap-2'>
                <p className='font-semibold text-white'>Find the quiz on Telegram Channel</p>
                <Image src={'/icons/telegram.svg'} alt='link' height={100} width={100} className='bg-white h-[30px] w-[30px] p-[2px] rounded-full' />
              </div>}
              {index === 1 && <div className='my-2 flex flex-row items-center gap-2 mt-6'>
                <p className='font-semibold text-white'>Find the quiz on X</p>
                <Image src={'/icons/x-twitter.svg'} alt='twitter' height={100} width={100} className='bg-white h-[30px] w-[30px] p-[3px] rounded-md' />
              </div>}
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
                  className='bg-white h-[30px] w-[30px] p-[3px] rounded-full rotate-45 absolute right-2'
                  onClick={() => handleQuizSubmit(quiz.id)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className='w-full flex flex-col justify-center items-center my-3'>
          <p className='font-semibold text-white text-[20px] mt-2 bg-slate-800 px-2 py-1 rounded-md'>Daily Predictions</p>
          {Predictions.map((prediction: any) => (
            <div key={prediction.id} className='w-10/12 flex flex-row gap-2 items-center justify-around my-4 relative'>
              <Image src={`/teams/${prediction.team1}.png`} alt={prediction.team1} height={50} width={50} className='h-[50px] w-[40px]' />
              <Input
                type='number'
                className='text-[16px] w-[40px] font-bold text-center'
                value={predictions[prediction.id]?.team1 || ''}
                onChange={(e) => handlePredictionChange(prediction.id, { ...predictions[prediction.id], team1: e.target.value })}
              />
              <p className='text-white font-bold'>-</p>
              <Input
                type='number'
                className='text-[16px] w-[40px] font-bold text-center'
                value={predictions[prediction.id]?.team2 || ''}
                onChange={(e) => handlePredictionChange(prediction.id, { ...predictions[prediction.id], team2: e.target.value })}
              />
              <Image src={`/teams/${prediction.team2}.png`} alt={prediction.team2} height={50} width={50} className='h-[50px] w-[40px]'  />
            </div>
          ))}
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
      <div className='h-[80px] bg-slate-700 mt-auto' />
    </div>
  );
};

export default EarnPage