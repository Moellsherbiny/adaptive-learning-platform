import { getUserData } from '@/lib/getUserData';
import { redirect } from 'next/navigation';
import React from 'react'
export const dynamic = "force-dynamic";

async function layout({ children }: { children: React.ReactNode }) {
  const { name, image } = await getUserData();
  if (!name || !image) redirect("/")
  return (
    <>
      {children}
    </>

  )
}

export default layout