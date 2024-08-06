import React from 'react'

const page = ({ params: { id } }: any) => {
  return (
    <div className='flex justify-center items-center h-screen'>{id}</div>
  )
}

export default page