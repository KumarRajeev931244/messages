'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {Loader2, LoaderCircle} from 'lucide-react'

const page = () => {
    const [username, setUsername] = useState('')
    // username  available message 
    const [usernameMessage, setUsernameMessage] = useState('')
    // while checking username
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername, 300)
    const router = useRouter()
    // console.log("debounced Username:", debounced);

    // zod implementation
     // 1. Define your form.
    //  we use zod schema that we define in Schema
    const form = useForm<z.infer<typeof signUpSchema>>({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
         username: "", 
         email: "", 
         password: "" 
        },
    });

    useEffect(() => {
        const checkUsernameUnique = async() => {
            if(username){
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get<ApiResponse>(`/api/checkUsernameUnique?username=${username}`)
                    console.log("response:", response);
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "error checking username")
                } finally{
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique()
    },[username])

    const onSubmit = async(data: z.infer<typeof signUpSchema>) => {
        console.log("onSubmitData:",data);
        setIsSubmitting(true)
        try {
            const response = await axios.post(`/api/signUp`,data)
            toast.success(response.data.message)
            router.replace(`/verify/${username}`)
            
        } catch (error) {
            console.error("Error in signup of user",error)
            const axiosError = error as AxiosError<ApiResponse>
            console.log("axiosError:", axiosError);
            let errorMessage = axiosError.response?.data.message
            toast.error(errorMessage)     
        } finally{
            setIsSubmitting(false)
        }
    }

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join Mystery Message
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                      />
                      
                    </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin"/>}
                    
                    <p className={`text-sm ${usernameMessage === "username is unique" ? 'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field}/>
                    </FormControl>    
                    <FormMessage />
                  </FormItem>
                )} 
              />
               <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>password</FormLabel>
                    <FormControl>
                      <Input placeholder="password" {...field} type="password"/>
                    </FormControl>    
                    <FormMessage />
                  </FormItem>
                )} 
              />
              <Button type="submit" disabled={isSubmitting} className="cursor-pointer" onClick={() => {}}>
                {isSubmitting ? (
                    <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>Please wait
                    </>
                ) : ('Signup')}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
                Already a member?{' '}
                <Link href='/signIn' className="text-blue-600 hover:text-blue-800">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    );
}

export default page