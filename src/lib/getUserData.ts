import { authOptions } from "@/nextAuth";
import { getServerSession } from "next-auth";
import prisma from "./prisma";
import { Session } from "next-auth";

export async function getUserData() {
  try {
    const session: Session | null = await getServerSession(authOptions);
    if (!session) return { error: "No Session Found" };

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return { error: "User Not Found" };
    }
    return {
      id: user.id,
      name: user.name ?? "User",
      email: user.email,
      image: user.image ?? "/default-avatar.png",
      role: user.role,
      contentPreferences: user.contentPreferences
    };
  } catch (error) {
    console.error(error);
    return { error: "Internal server error" };
  }
}
