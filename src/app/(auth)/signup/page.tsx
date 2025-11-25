'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import {useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormItem,FormLabel,FormControl,FormDescription,FormMessage} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export default function SignUp(){
  const [username,setUsername]=useState('')
  const [usernameMessage,setUsernamemessage]=useState('')
  const [isCheckingusername,setisCheckingusername]=useState(false)
  const [isSubmitting,setIssubmitting]=useState(false)
  const debounced = useDebounceCallback(setUsername, 500)
  const { toast } = useToast()
  const router=useRouter()//navigation wala
  //zod implementation
  const form=useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username: '',
      email:'',
      password:'',
    }
  })
  useEffect(()=>{
    const checkisUsernameunique=async()=>{

      if(username){
        setisCheckingusername(true)
        setUsernamemessage('')
        try {
          const response=await axios.get(`/api/checkusernameunique?username=${username}`)
          setUsernamemessage(response.data.message)
        } catch (error) {
          const axiosError=error as AxiosError<ApiResponse>;
          setUsernamemessage(axiosError.response?.data.message ?? "Error checking username")
        }finally{
          setisCheckingusername(false)
        }
      }
    }
    checkisUsernameunique();
  },[username])
    const onSubmit=async(data:z.infer<typeof signUpSchema>)=>{
      setIssubmitting(true)
      try {
        const response=await axios.post<ApiResponse>('/api/signup',data)
          toast({
            title:"Success",
            description:response.data.message
          })
          router.replace(`/verify/${username}`)
        setIssubmitting(false)
      } catch (error) {
          const axiosError=error as AxiosError<ApiResponse>;
          let errorMessage=axiosError.response?.data.message; 
          toast({
            title:"SignUp Failed",
            description:errorMessage,
            variant:"destructive"
          })
          setIssubmitting(false)
      }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 ">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md sm:mt-4">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} 
                  onChange={(e:any)=>
                    {field.onChange(e)
                      debounced(e.target.value)
                    }}
                />
              </FormControl>
              {isCheckingusername && <Loader2 className="animate-spin"/>}
              {!isCheckingusername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === "Username is available"
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ?(<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait..</>
                ):("SignUp")
              }
            </Button>
            </form>
        </Form>
        <div>
          <p>
            Already a member?{' '}
            <Link href='/signin' className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

