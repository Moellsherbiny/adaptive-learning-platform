import { NextResponse } from "next/server";
import { getUserData } from "@/lib/getUserData";

export async function GET() {
  const user = await getUserData();
  
  return NextResponse.json({ data: user });
}
