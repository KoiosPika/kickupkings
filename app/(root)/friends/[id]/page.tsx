import FriendsPage from '@/components/screens/FriendsPage'
import React from 'react'

const page = ({ params: { id } }: any) => {
  return (
    <FriendsPage userId={id} />
  )
}

export default page