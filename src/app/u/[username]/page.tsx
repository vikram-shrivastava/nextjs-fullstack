"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { messageSchema } from "@/schemas/messageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import *as z from 'zod'
export default function Page(){
    const params=useParams<{username:string}>();
    const {toast}=useToast()
    const form=useForm<z.infer<typeof messageSchema>>({
        resolver:zodResolver(messageSchema),
      })
      const { setValue } = form;
    const suggestMessage=async()=>{
        try {
                // setValue("content"," ")
                const response=await axios.get("/api/suggestmessages")
                setValue("content",response.data)
        } catch (error) {
            console.error("Error Verification")
            const axiosError=error as AxiosError<ApiResponse>;
            let errorMessage=axiosError.response?.data.message; 
            toast({
                title:"Suggest message not working",
                description:errorMessage,
                variant:"destructive"
            })
        }
    }
    const onSubmit=async(data:z.infer<typeof messageSchema>)=>{
        try {
            const response=await axios.post('/api/sendMessage',{
                username:params.username,
                content:data.content
            })

            toast({
                title:"Success",
                description:response.data.message
            })
        } catch (error) {
            console.error("Error Verification")
            const axiosError=error as AxiosError<ApiResponse>;
            let errorMessage=axiosError.response?.data.message; 
            toast({
                title:"Message not sent",
                description:errorMessage,
                variant:"destructive"
            })
        }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Your True Feedback Matters
                    </h1>
                    <p className="mb-4">We are waiting for your True Feedback</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enter your feedback </FormLabel>
                                <FormControl>
                                    <Input  {...field} />
                                </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex justify-between ">
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </Form>
                <Button onClick={(e)=>suggestMessage()}>Suggest Message</Button>
            </div>
        </div>
  )
}
