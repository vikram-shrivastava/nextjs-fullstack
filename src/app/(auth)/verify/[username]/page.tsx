'use client'
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/schemas/verifySchema";
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { FormControl, Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export default function VerifyAccount(){
    const router = useRouter();
    const params = useParams<{username:string}>();
    const { toast } = useToast()
    
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async(data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post('/api/verifyCode', {
                username: params.username,
                code: data.code
            })
            toast({
                title: "Success",
                description: response.data.message
            })
            if(response.data.message) {
                router.replace('/signin')
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message; 
            toast({
                title: "Verification Failed",
                description: errorMessage,
                variant: "destructive"
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-950 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>
            </div>

            <div className="w-full max-w-md p-8 space-y-8 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl relative z-10">
                <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                        <ShieldCheck className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                        Verify Account
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Enter the verification code sent to your email
                    </p>
                </div>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-300">Verification Code</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Enter code" 
                                        {...field} 
                                        className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500 text-center tracking-widest text-lg"
                                    />
                                </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                            Verify
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}