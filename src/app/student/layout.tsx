import DashboardNav from '@/components/DashboardNav';
import { getUserData } from '@/lib/getUserData';
import { redirect } from 'next/navigation';
import React from 'react'

async function layout({ children }: { children: React.ReactNode }) {
  const user = await getUserData();
  if (!user) redirect("/")
  
  return (
    <>
      <DashboardNav name={user.name || ''} image={user.image || ''} role={'student'} />
      {children}
    </>

  )
}

export default layout