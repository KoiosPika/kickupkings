import HistoryPage from '@/components/screens/HistoryPage'
import React from 'react'

const page = ({ params: { id } }: any) => {
    return (
        <HistoryPage id={id} />
    )
}

export default page