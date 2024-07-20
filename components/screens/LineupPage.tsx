import { formations } from '@/constants/Formations';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { saveFormation } from '@/lib/actions/user.actions';

const colors = [
  { 'Forward': '#EE2E0C' },
  { 'Midfield': '#EE9F0C' },
  { 'Defense': '#0090DE' },
  { 'Goalkeeper': '#41B815' },
]

const LineupPage = () => {
  const [height, setHeight] = useState<number>(window.innerHeight)
  const [selectedFormation, setSelectedFormation] = useState(formations[0].id);
  const [saving, setSaving] = useState(false)

  const updateDimensions = () => {
    setHeight(window.innerHeight);
  }

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const currentFormation = formations.find(f => f.id === selectedFormation);

  const getColor = (type: any, position: any) => {
    if (!position) {
      return '';
    }
    const colorObj: any = colors.find((color: any) => color[type]);
    return colorObj ? colorObj[type] : '';
  };

  const getUserData = (position: string) => {
    const user: any = userData.find((data: any) => data[position] !== undefined);
    return user ? user[position] : '';
  }

  const changeFormation = async () => {
    if (saving) {
      return;
    }

    setSaving(true);
    await saveFormation('6699bfa1ba8348c3228f89ab', selectedFormation);
    setSaving(false);
  }

  const userData = [
    { 'GK': 5 },
    { 'LWB': 7 },
    { 'LB': 3 },
    { 'LCB': 9 },
    { 'CB': 6 },
    { 'RCB': 6 },
    { 'RB': 5 },
    { 'RWB': 1 },
    { 'LDM': 7 },
    { 'RDM': 2 },
    { 'CDM': 5 },
    { 'LCM': 1 },
    { 'CM': 9 },
    { 'RCM': 7 },
    { 'LM': 5 },
    { 'RM': 3 },
    { 'CAM': 9 },
    { 'LAM': 6 },
    { 'RAM': 2 },
    { 'LWM': 7 },
    { 'RWM': 3 },
    { 'LST': 8 },
    { 'RST': 1 },
    { 'ST': 7 },
    { 'CF': 5 },
    { 'LF': 7 },
    { 'RF': 0 },
    { 'LW': 4 },
    { 'RW': 8 },
  ]

  const calculateOverallScore = (formation: any) => {
    let totalScore = 0;
    let positionCount = 0;

    formation.data.forEach((row: any) => {
      row.positions.forEach((position: any) => {
        if (position) {
          const score = getUserData(position);
          if (score !== '') {
            totalScore += score;
            positionCount++;
          }
        }
      });
    });

    return positionCount > 0 ? (totalScore / positionCount).toFixed(1) : '0.0';
  };

  const overallScore = calculateOverallScore(currentFormation);

  const findBestFormation = () => {
    const formationWithHighestOverall = formations.reduce((highest: any, formation) => {
      const overallScore = parseFloat(calculateOverallScore(formation));
      return highest && parseFloat(highest.score) > overallScore
        ? highest
        : { formation, score: overallScore };
    }, null);

    setSelectedFormation(formationWithHighestOverall.formation.id);
  };

  return (
    <section className='w-full h-screen'>
      <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
        <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] sm:h-[40px] sm:w-[40px] rounded-lg' />
        <p className='font-semibold text-white text-[13px] sm:text-[17px]'>Rami (Amature)</p>
        <p className='font-semibold text-white text-[13px] sm:text-[17px]'>{`->`}</p>
      </div>
      <div style={{ height: height - 200 }} className='relative'>
        <div className='h-full w-full absolute flex flex-col justify-around'>
          {currentFormation?.data.map((row, rowIndex) => (
            <div key={rowIndex} className='flex justify-around'>
              <div className='absolute bg-[#DE1848] bottom-2 right-3 border-2 border-white text-white px-3 rounded-sm font-semibold'>
                <p className='text-center'>{currentFormation.id}</p>
              </div>
              <div className='absolute bg-[#DE1848] bottom-2 left-3 border-2 border-white text-white px-3 rounded-sm font-semibold'>
                <p className='text-center'>{overallScore}</p>
              </div>
              {row.positions.map((position, posIndex) => (
                <div key={posIndex} className='px-2 py-[5px] rounded-lg text-white font-semibold border-white w-[50px] sm:w-[70px] sm:py-[10px]' style={{ backgroundColor: getColor(row.type, row.positions[posIndex]), borderWidth: row.positions[posIndex] ? 2 : 0, boxShadow: position ? `-8px -8px 10px -4px ${getColor(row.type, row.positions[posIndex])},-8px 8px 10px -4px ${getColor(row.type, row.positions[posIndex])},8px -8px 10px -4px ${getColor(row.type, row.positions[posIndex])},8px 8px 10px -4px ${getColor(row.type, row.positions[posIndex])}` : '' }}>
                  {row.positions[posIndex] && <p className='text-[11px] sm:text-[18px] text-center'>{position}</p>}
                  {position && <p className='text-center text-[13px] sm:text-[23px]'>{getUserData(position)}</p>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <Image src={'/Field-dark.png'} alt='field' height={2000} width={2000} style={{ height: height - 200 }} className='w-full max-w-[700px]' />
      </div>
      <ScrollArea style={{ height: height - 620 }} className='py-2 px-2'>
        <div className='flex gap-2'>
          <>
            <div className='flex flex-col h-full justify-center items-center border-[1px] border-white bg-slate-800 rounded-lg' onClick={() => findBestFormation()} style={{ height: '100%', width: 95 }}>
              <div className=' text-center w-full rounded-md font-semibold bg-white' >Find Best</div>
            </div>
            {formations.map((formation) => (
              <div key={formation.id} className='flex flex-col h-full justify-center items-center border-[1px] rounded-lg bg-white' onClick={() => setSelectedFormation(formation.id)} style={{ height: '100%', width: 95, borderColor: currentFormation?.id == formation.id ? '#EE9F0C' : 'white' }}>

                <div className=' text-center w-full rounded-md font-semibold' style={{ backgroundColor: currentFormation?.id == formation.id ? '#EE9F0C' : 'white', color: currentFormation?.id == formation.id ? 'white' : 'black' }}>{formation.id}</div>
              </div>
            ))}
          </>
        </div>
        <ScrollBar orientation="horizontal" className='hidden' />
      </ScrollArea>
      <div className='w-full flex justify-center items-center'>
        <p className='bg-green-600 text-white font-bold px-3 py-1 rounded-md' onClick={changeFormation}>{saving ? 'Saving...' : 'Save Formation'}</p>
      </div>
    </section>
  )
}

export default LineupPage