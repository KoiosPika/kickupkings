
import IconsPage from '@/components/screens/IconsPage'
import React from 'react'

const page = ({ params: { id } }: any) => {
  return (
    <IconsPage userId={id} />
  )
}

export default page