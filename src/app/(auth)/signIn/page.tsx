'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {  useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {signIn} from "next-auth/react"
import { signInSchema } from "@/schemas/signInSchema"
import Link from "next/link"
import { useLoadingBar} from 'react-top-loading-bar'

const page = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof signInSchema>>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
         identifier: "", 
         password: "" 
        },
    });
    const onSubmit = async(data: z.infer<typeof signInSchema>) => {
        console.log("onSubmitData:",data);
        const result = await signIn('credentials',{
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })
        // console.log("signin result:",result);
        if(result?.error){
            toast.error("Login failed")
        }
        if(result?.url){
            toast.success("login successfully")
            router.replace('dashboard',{scroll:false})
        }   
    }
    const { start, complete } = useLoadingBar({ color: "blue", height: 2 });

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join Mystery Message
            </h1>
            <p className="mb-4">Sign in to start your anonymous adventure</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email/username</FormLabel>
                    <FormControl>
                      <Input placeholder="email/username" {...field} />
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
                      <Input
                        placeholder="password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> 
              <Button type="submit" className= "hover:cursor-pointer" onClick={() => {start()}}>
                Submit
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Not a member?{" "}
              <Link
                href="/signUp"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
}

export default page