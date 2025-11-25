'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, UserPlus } from "lucide-react"

export default function SignUp(){
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernamemessage] = useState('')
  const [isCheckingusername, setisCheckingusername] = useState(false)
  const [isSubmitting, setIssubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 500)
  const { toast } = useToast()
  const router = useRouter()

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  })

  useEffect(() => {
    const checkisUsernameunique = async () => {
      if(username){
        setisCheckingusername(true)
        setUsernamemessage('')
        try {
          const response = await axios.get(`/api/checkusernameunique?username=${username}`)
          setUsernamemessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernamemessage(axiosError.response?.data.message ?? "Error checking username")
        } finally {
          setisCheckingusername(false)
        }
      }
    }
    checkisUsernameunique();
  }, [username])

  const onSubmit = async(data: z.infer<typeof signUpSchema>) => {
    setIssubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/signup', data)
      toast({
        title: "Success",
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
      setIssubmitting(false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message; 
      toast({
        title: "SignUp Failed",
        description: errorMessage,
        variant: "destructive"
      })
      setIssubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md p-8 space-y-8 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl relative z-10">
        <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6 text-indigo-400" />
            </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Join True Feedback
          </h1>
          <p className="text-slate-400 text-sm">
            Start your anonymous journey today
          </p>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300">Username</FormLabel>
              <FormControl>
                <div className="relative">
                    <Input 
                        placeholder="username" 
                        {...field} 
                        className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                        onChange={(e) => {
                            field.onChange(e)
                            debounced(e.target.value)
                        }}
                    />
                     {isCheckingusername && <Loader2 className="animate-spin absolute right-3 top-3 h-4 w-4 text-slate-400"/>}
                </div>
              </FormControl>
             
              {!isCheckingusername && usernameMessage && (
                    <p className={`text-sm mt-1 ${
                        usernameMessage === "Username is available"
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}>
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
              <FormLabel className="text-slate-300">Email</FormLabel>
              <FormControl>
                <Input 
                    placeholder="email@example.com" 
                    {...field} 
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
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
              <FormLabel className="text-slate-300">Password</FormLabel>
              <FormControl>
                <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field} 
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait..
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-slate-400 text-sm">
            Already a member?{' '}
            <Link href='/signin' className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}