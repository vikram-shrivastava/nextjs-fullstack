"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { messageSchema } from "@/schemas/messageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { Send, Sparkles, MessageSquare } from "lucide-react"
import { useState } from "react"

export default function Page(){
    const params = useParams<{username:string}>();
    const { toast } = useToast()
    const [isSuggesting, setIsSuggesting] = useState(false)
    const [isSending, setIsSending] = useState(false)

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ""
        }
    })
    
    const { setValue } = form;

    const suggestMessage = async () => {
        setIsSuggesting(true)
        try {
            // Optional: Clear before fetching or keep current text
            // setValue("content", "") 
            const response = await axios.get("/api/suggestmessages")
            // Assuming the API returns a string or we pick one from a list
            // If it returns a list, you might need response.data[0] or similar logic
            // based on your backend. For now, using response.data directly as per your snippet.
            let suggestion = response.data;
            if (typeof response.data === 'object' && response.data.message) {
                 suggestion = response.data.message; // Handle potential object response
            }
             
            setValue("content", suggestion)
            toast({
                title: "AI Suggestion Generated",
                description: "Feel free to edit it before sending.",
            })
        } catch (error) {
            console.error("Error Fetching Suggestion")
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message ?? "Failed to fetch suggestion"; 
            toast({
                title: "Suggestion Failed",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsSuggesting(false)
        }
    }

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsSending(true)
        try {
            const response = await axios.post('/api/sendMessage', {
                username: params.username,
                content: data.content
            })

            toast({
                title: "Message Sent!",
                description: "Your secret message has been delivered safely.",
                className: "bg-emerald-500 border-none text-white"
            })
            form.reset()
        } catch (error) {
            console.error("Error Sending Message")
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message ?? "Failed to send message"; 
            toast({
                title: "Delivery Failed",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-950 relative overflow-hidden p-4">
            
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-lg p-8 space-y-8 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl relative z-10">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                        <MessageSquare className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                        Send Anonymous Message
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base">
                        To <span className="text-indigo-400 font-semibold">@{params.username}</span>. Your identity will remain hidden.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Your Feedback</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Write your honest feedback here..." 
                                            className="min-h-[150px] bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500 resize-none"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className="flex flex-col gap-3">
                            <Button 
                                type="submit" 
                                disabled={isSending}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 h-11"
                            >
                                {isSending ? (
                                    "Sending..." 
                                ) : (
                                    <>Send Message <Send className="ml-2 w-4 h-4" /></>
                                )}
                            </Button>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-slate-800"></div>
                                <span className="flex-shrink-0 mx-4 text-slate-600 text-xs uppercase">Or use AI</span>
                                <div className="flex-grow border-t border-slate-800"></div>
                            </div>

                            <Button 
                                type="button"
                                onClick={(e) => suggestMessage()}
                                disabled={isSuggesting}
                                variant="outline"
                                className="w-full bg-slate-700 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white h-11"
                            >
                                {isSuggesting ? (
                                    "Generating..."
                                ) : (
                                    <>Suggest a Message <Sparkles className="ml-2 w-4 h-4 text-amber-400" /></>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            
            <div className="absolute bottom-4 text-center w-full">
                 <p className="text-slate-600 text-xs">
                    Powered by TrueFeedback · 100% Anonymous
                 </p>
            </div>
        </div>
    )
}