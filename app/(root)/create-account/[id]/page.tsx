'use client'

import React, { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { createUser } from '@/lib/actions/user.actions'
import { useRouter } from 'next/navigation'

const Page = ({ params: { id } }: any) => {

  const [loading, setLoading] = useState(false)
  const router = useRouter();


  const createNewAccount = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    const [telegramId, chatId] = id.split(' - ');
    const newUser = await createUser(telegramId, chatId)

    router.push('/')

  }

  return (
    <section className='w-full h-screen flex flex-col justify-center items-center bg-gradient-to-b from-slate-900 to-gray-700'>
      <div className="items-top flex space-x-2 w-3/4 justify-center items-center text-white">
        <Checkbox id="terms1" className='border-white' />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms1"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>
        </div>
      </div>
      <div className='bg-slate-900 text-white font-semibold px-3 py-2 rounded-lg mt-4' onClick={createNewAccount}>{loading ? 'Please wait...' : 'Create Account'}</div>
    </section>
  )
}

export default Page