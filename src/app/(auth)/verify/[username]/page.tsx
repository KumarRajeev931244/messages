'use client'
import { verifySchema } from "@/schemas/verifySchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { useForm} from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const page = () => {
    const router = useRouter()
    const param = useParams<{username: string}>()
    const form = useForm<z.infer<typeof verifySchema>>({
      resolver: zodResolver(verifySchema),
    });
    const onSubmit = async(data: z.infer<typeof verifySchema>) =>{
        try {
            console.log('verify code data:',data);
            
            const response = await axios.post('/api/verify-code',{
                username: param.username,
                code: data.code
            })
            console.log("verify response:", response);
            
            toast.success(response.data.message)
            router.replace(`/signIn`)
        } catch (error) {
            console.error("Error in verify code", error);
            const axiosError = error as AxiosError<ApiResponse>;
            console.log("axiosError:", axiosError);
            let errorMessage = axiosError.response?.data.message;
            toast.error(errorMessage);
        }
        return (
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
              <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                  Verify your account
                </h1>
                <p className="mb-4">
                  Enter the verification code sent to your email
                </p>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>verification code</FormLabel>
                        <FormControl>
                          <Input placeholder="code" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="cursor-pointer"
                    onClick={() => {}}
                  >
                    submit
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        );
        
    }
}
export default page