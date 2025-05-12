'use client'
import  Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {
    const {data:session, status} = useSession()
    console.log("session status:",status)
    const user:User = session?.user as User
    return(
        <nav className="p-4 md:p-6 shadow-md" >
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="#" className="text-xl font-bold mb-4 md:mb-0  ">Mystry Message</a>
                {/* agar session hai toh user authneticated hai */}
               {session ? (
                <>
                <span className="mr-4">Welcome, {user?.username || user?.email} </span>
                <Button onClick={() => signOut()} className="w-full md:w-auto cursor-pointer">Logout</Button>
                </>
               ) : (
                <>
                <Link href= '/signIn'>
                    <Button className="w-full md:w-auto cursor-pointer" >Login</Button>
                </Link>
                </>
               )} 
            </div>
        </nav>

    )
}

export default Navbar