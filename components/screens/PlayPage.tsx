import Image from 'next/image'
import React from 'react'

const colors = [
  { 'Forward': '#EE2E0C' },
  { 'Midfield': '#EE9F0C' },
  { 'Defense': '#0090DE' },
  { 'Goalkeeper': '#41B815' },
]

const PlayPage = () => {

  const formation = {
    id: '4-1-2-1-2',
    data: [
        { positions: ['', 'LST', 'RST', ''], type: 'Forward' },
        { positions: [''], type: 'Forward' },
        { positions: ['CAM'], type: 'Midfield' },
        { positions: ['LM', '', 'RM'], type: 'Midfield' },
        { positions: ['CDM'], type: 'Midfield' },
        { positions: [''], type: 'Midfield' },
        { positions: ['LB', 'LCB', 'RCB', 'RB'], type: 'Defense' },
        { positions: [''], type: 'Goalkeeper' },
        { positions: ['GK'], type: 'Goalkeeper' }
    ]
}

  const getColor = (type: any, position: any) => {
    if (!position) {
      return '';
    }
    const colorObj: any = colors.find((color: any) => color[type]);
    return colorObj ? colorObj[type] : '';
  };

  return (
    <section className='w-full h-screen flex flex-col'>
      <div className='w-full ml-auto mb-auto p-2 flex flex-row items-center gap-2'>
        <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[30px] w-[30px] rounded-lg' />
        <p className='font-semibold text-white text-[13px]'>Rami (Amature)</p>
        <p className='font-semibold text-white text-[13px]'>{`->`}</p>
      </div>
      <div className='w-full flex justify-center items-center'>
        <div className='w-11/12 flex items-center gap-1'>
          <div className='w-2/5 flex flex-col h-[60px] sm:h-[80px] gap-[3px]'>
            <div className='w-full bg-slate-800 text-white text-center font-semibold rounded-tl-lg h-1/2 flex justify-center items-center'>
              <p className='text-[16px] sm:text-[20px]'>Form</p>
            </div>
            <div className='w-full bg-slate-800 text-white text-center font-semibold rounded-bl-lg flex flex-row items-center justify-center gap-1 h-1/2'>
              <p className='rounded-sm bg-green-500 w-1/6 text-[13px] sm:text-[18px]'>W</p>
              <p className='rounded-sm bg-red-500 w-1/6   text-[13px] sm:text-[18px]'>L</p>
              <p className='rounded-sm bg-green-500 w-1/6 text-[13px] sm:text-[18px]'>W</p>
              <p className='rounded-sm bg-green-500 w-1/6 text-[13px] sm:text-[18px]'>W</p>
              <p className='rounded-sm bg-red-500 w-1/6   text-[13px] sm:text-[18px]'>L</p>
            </div>
          </div>
          <div className='w-1/5 flex flex-col h-[60px] sm:h-[80px] gap-[3px]'>
            <div className='w-full bg-slate-800 text-white text-center font-semibold h-1/2 flex justify-center items-center'>
              <p className='text-[16px] sm:text-[20px]'>Played</p>
            </div>
            <div className='w-full bg-slate-800 text-white text-center font-semibold h-1/2 flex justify-center items-center'>
              <p className='text-[16px] sm:text-[20px]'>2340</p>
            </div>
          </div>
          <div className='w-1/5 flex flex-col h-[60px] sm:h-[80px] gap-[3px]'>
            <div className='w-full bg-slate-800 text-white text-center font-semibold h-1/2 flex justify-center items-center'>
              <p className='text-[16px] sm:text-[20px]'>Won</p>
            </div>
            <div className='w-full bg-slate-800 text-white text-center font-semibold h-1/2 flex justify-center items-center'>
              <p className='text-[16px] sm:text-[20px]'>2220</p>
            </div>
          </div>
          <div className='w-1/5 flex flex-col h-[60px] sm:h-[80px] gap-[3px]'>
            <div className='w-full bg-slate-800 text-white text-center font-semibold rounded-tr-lg h-1/2 flex justify-center items-center'>
              <p className='text-[16px] sm:text-[20px]'>Lost</p>
            </div>
            <div className='w-full bg-slate-800 text-white text-center font-semibold rounded-br-lg h-1/2 flex justify-center items-center'>
              <p className='text-[16px] sm:text-[20px]'>140</p>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full flex flex-col justify-center items-center mt-2'>
        <div className='w-11/12'>
          <p className='text-white font-semibold bg-slate-800 px-2 py-1 inline-flex rounded-lg'>History</p>
          <div className='flex flex-col gap-1 my-2'>
            <div className='text-white font-semibold bg-slate-800 p-2 rounded-lg flex flex-row items-center border-[1px] border-white'>
              <p className='h-[25px] w-[30px] text-center bg-red-500 rounded-sm'>L</p>
              <p className='ml-2'>4-1</p>
              <div className='ml-5 flex flex-row items-center bg-slate-900 px-2 py-1 rounded-lg'>
                <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[28px] w-[28px] rounded-lg' />
                <p className='ml-2 max-w-[100px] overflow-hidden'>username</p>
              </div>
              <p className='bg-purple-700 px-2 text-[14px] py-[2px] rounded-lg ml-auto shadow-md shadow-purple-500'>Rematch</p>
            </div>
            <div className='text-white font-semibold bg-slate-800 p-2 rounded-lg flex flex-row items-center border-[1px] border-white'>
              <p className='h-[25px] w-[30px] text-center bg-green-500 rounded-sm'>W</p>
              <p className='ml-2'>4-2</p>
              <div className='ml-5 flex flex-row items-center bg-slate-900 px-2 py-1 rounded-lg'>
                <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[28px] w-[28px] rounded-lg' />
                <p className='ml-2 max-w-[100px] overflow-hidden'>username</p>
              </div>
              <p className='bg-purple-700 px-2 text-[14px] py-[2px] rounded-lg ml-auto shadow-md shadow-purple-500'>Rematch</p>
            </div>
            <div className='text-white font-semibold bg-slate-800 p-2 rounded-lg flex flex-row items-center border-[1px] border-white'>
              <p className='h-[25px] w-[30px] text-center bg-red-500 rounded-sm'>L</p>
              <p className='ml-2'>5-3</p>
              <div className='ml-5 flex flex-row items-center bg-slate-900 px-2 py-1 rounded-lg'>
                <Image src={'/icons/user.svg'} alt='user' height={50} width={50} className='bg-slate-500 p-1 h-[28px] w-[28px] rounded-lg' />
                <p className='ml-2 max-w-[100px] overflow-hidden'>username</p>
              </div>
              <p className='bg-purple-500 px-2 text-[14px] py-[2px] rounded-lg ml-auto shadow-md'>Rematched</p>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full flex flex-col justify-center items-center mt-2'>
        <div className='bg-blue-500 px-3 py-2 font-semibold text-white rounded-xl shadow-blue-600 shadow-lg border-b-[4px] border-blue-800'>
          <p className='text-[22px]'>Find Match</p>
        </div>
      </div>
      <div className='w-full flex flex-col h-full justify-center items-center flex-grow mt-2'>
        <div className='w-11/12 grid grid-cols-2 h-full'>
          <div className='h-full w-full flex flex-col justify-around rounded-md' style={{ backgroundImage: `url('/Field-dark.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {formation?.data.map((row, rowIndex) => (
              <div key={rowIndex} className='flex justify-around'>
                {row.positions.map((position, posIndex) => (
                  <div key={posIndex} className='p-[7px] rounded-full text-white font-semibold border-white sm:p-[15px]' style={{ backgroundColor: getColor(row.type, row.positions[posIndex]), borderWidth: row.positions[posIndex] ? 2 : 0, boxShadow: position ? `-8px -8px 10px -4px ${getColor(row.type, row.positions[posIndex])},-8px 8px 10px -4px ${getColor(row.type, row.positions[posIndex])},8px -8px 10px -4px ${getColor(row.type, row.positions[posIndex])},8px 8px 10px -4px ${getColor(row.type, row.positions[posIndex])}` : '' }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='h-[260px]' />
    </section>
  )
}

export default PlayPage