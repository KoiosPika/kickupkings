import { formations } from '@/constants/Formations';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

const colors = [
  { 'Forward': '#EE2E0C' },
  { 'Midfield': '#EE9F0C' },
  { 'Defense': '#0090DE' },
  { 'Goalkeeper': '#09C609' },
]

const LineupPage = () => {
  const [height, setHeight] = useState<number>(window.innerHeight)
  const [selectedFormation, setSelectedFormation] = useState(formations[0].id);

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


  return (
    <section className='w-full h-screen'>
      <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
        <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] rounded-lg' />
        <p className='font-semibold text-white text-[13px]'>Rami (Amature)</p>
        <p className='font-semibold text-white text-[13px]'>{`->`}</p>
      </div>
      <div style={{ height: height - 220 }} className='relative'>
        <div className='h-full w-full absolute flex flex-col justify-evenly'>
          {currentFormation?.data.map((row, rowIndex) => (
            <div key={rowIndex} className='flex justify-around'>
              {row.positions.map((position, posIndex) => (
                <div key={posIndex} className='p-2 rounded-lg text-white font-semibold h-1/8' style={{ backgroundColor: getColor(row.type, row.positions[posIndex]), height: row.type === 'Spacer' ? '50%' : '100%' }}>
                  {position}
                </div>
              ))}
            </div>
          ))}
        </div>
        <Image src={'/Field.png'} alt='field' height={500} width={500} style={{ height: height - 220 }} />
      </div>
      <ScrollArea style={{ height: height - 790 }} className='py-2 px-2'>
        <div className='flex gap-2'>
          {formations.map((formation) => (
            <div key={formation.id} className='flex flex-col h-full justify-center items-center border-[1px] border-white rounded-lg' onClick={() => setSelectedFormation(formation.id)} style={{height:'100%', width: 80}}>
              <div style={{height:'80%'}} className='p-4'>
                <Image src={'/icons/Football-white.svg'} alt='football' height={30} width={30}/>
              </div>
              <div className='bg-white text-center w-full rounded-md'>{formation.id}</div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className='hidden' />
      </ScrollArea>
    </section>
  )
}

export default LineupPage