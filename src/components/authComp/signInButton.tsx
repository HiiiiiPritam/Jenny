"use client"
import { useSession,signIn } from "next-auth/react"
 
export default function SignIn() {

  let {data : session} = useSession();

  const handle = () => {
    console.log("google signin",session);
    signIn("google")
  }


  return (
    <div>
     <button onClick={handle}>Login</button>
    </div>
  )
} 