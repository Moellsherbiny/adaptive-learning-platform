import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

function Logo() {
  return (
    <Link href="/" >
      <Image src="/spe-logo.png" alt='Logo' height={50} width={50}/>
    </Link>
  )
}

export default Logo