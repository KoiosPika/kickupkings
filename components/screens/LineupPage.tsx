import { formations } from '@/constants/Formations';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

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

  const getColor = (type: any) => {
    const colorObj: any = colors.find((color: any) => color[type]);
    return colorObj ? colorObj[type] : '#000';
  };


  return (
    <section className='w-full h-screen'>
      <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
        <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] rounded-lg' />
        <p className='font-semibold text-white text-[13px]'>Rami (Amature)</p>
        <p className='font-semibold text-white text-[13px]'>{`->`}</p>
      </div>
      <div style={{ height: height - 220 }} className='relative'>
        <div className='h-full w-full absolute flex flex-col justify-around'>
          {currentFormation?.data.map((row, rowIndex) => (
            <div key={rowIndex} className='flex justify-around'>
              {row.positions.map((position, posIndex) => (
                <div key={posIndex} className='p-2 rounded-lg text-white font-semibold' style={{ backgroundColor: getColor(row.type) }}>
                  {position}
                </div>
              ))}
            </div>
          ))}
        </div>
        <Image src={'/Field.png'} alt='field' height={500} width={500} style={{ height: height - 220 }} />
      </div>
      <div className='p-4'>
        <label htmlFor='formation-select' className='mr-2'>Select Formation:</label>
        <select
          id='formation-select'
          value={selectedFormation}
          onChange={(e) => setSelectedFormation(e.target.value)}
          className='p-2 border rounded'
        >
          {formations.map((formation) => (
            <option key={formation.id} value={formation.id}>
              {formation.id}
            </option>
          ))}
        </select>
      </div>
    </section>
  )
}

export default LineupPage