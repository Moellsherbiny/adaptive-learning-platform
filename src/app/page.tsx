import HomePage from "@/components/home";
import HomePage2 from "@/components//home/home2";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  console.log(session?.user);
  
  if (session){
    return <HomePage2 name={session.user.name ?? ""} image={session.user.image ?? ""} role={session.user.role ?? "" }/>
  }
  // otherwise display the home page <landing page || index || entrypoint>
  return <HomePage />;

}
