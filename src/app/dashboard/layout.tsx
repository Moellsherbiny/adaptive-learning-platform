import { getUserData } from '@/lib/getUserData';
import React from 'react'
export const dynamic = "force-dynamic";

async function layout({ children }: { children: React.ReactNode }) {
  const user = await getUserData()
  return (
    <main>
      {children}
    </main>
  )
}

export default layout