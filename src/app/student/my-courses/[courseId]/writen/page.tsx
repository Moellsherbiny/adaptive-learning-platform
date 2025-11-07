import React from 'react'
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { getUserData } from '@/lib/getUserData';

interface Props{
    params: Promise<{courseId?: string}>
};
interface Content {
  title: string;
  content: string
}
async function page({params}:Props) {
    const {courseId  } = await params
    const course = await prisma.course.findUnique({where: {id:courseId} })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any = course?.generatedContent ;
    const user = await getUserData();
  return (
    <div>
      <div className="container flex justify-between py-4 my-2 shadow-lg">
        <div>
        أهلا بك يا {user.name}
        </div>
        <h1>{course?.title} | محتوي مقروء</h1>
      </div>
      <Image className='w-1/2 mx-auto shadow-md rounded-lg my-4 aspect-auto' src={`https://res.cloudinary.com/dzk9wr2p6/image/upload/${course?.generatedImage}`} width={400} height={400} alt={'image'} /> 
      {content?.map((section: Content, index: number) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-right"> {index + 1} - {section.title}</h2>
          <p className="text-right text-gray-700 whitespace-pre-line">{section.content}</p>
        </div>
      ))}
      <hr />
      <object className='w-full aspect-video ' data='/file.pdf' width={800} height={500} ></object>
    </div>
  )
}

export default page
