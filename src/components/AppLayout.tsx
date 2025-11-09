import React from 'react'
import Navbar from './Navbar'
import DashboardNavbar from './DashboardNav'
import { getUserData } from '@/lib/getUserData'


async function AppLayout() {
  const user = await getUserData()

  if(!user.error)
    return <DashboardNavbar name={user.name ?? ""} image={user.image ?? ""} role={user.role ?? ""} />
  return <Navbar />
}

export default AppLayout
