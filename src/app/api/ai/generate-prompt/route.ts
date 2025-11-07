import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json()
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `
      You are an AI that generates detailed image prompts for educational courses.
      Create an English prompt for an educational course titled "${title}" with description: "${description}".
      The image should be professional, educational, and visually appealing.
      Include details about style, composition, and color scheme.
      Make it suitable for generating high-quality course thumbnails.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ 
      result: text || "Could not generate image prompt" 
    })
  } catch (error) {
    console.error('Error generating image prompt:', error)
    return NextResponse.json(
      { error: 'فشل إنشاء وصف الصورة' },
      { status: 500 }
    )
  }
}