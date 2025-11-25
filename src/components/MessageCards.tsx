'use client'

import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X, Trash2, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
  message: {
    _id?: string;
    content: string;
    createdAt?: string | Date;
    sentiment?: 'positive' | 'negative' | 'neutral' | string;
    [key: string]: any;
  };
  onMessageDelete: (messageId: any) => void;
};

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/deletemessage/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="bg-slate-950/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-sm relative overflow-hidden group h-full flex flex-col justify-between">
      
      {/* Background gradient for subtle depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/0 via-slate-900/0 to-slate-900/40 pointer-events-none" />

      <CardHeader className="relative z-10 p-5 pb-2">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg font-medium text-slate-100 leading-relaxed break-words">
            &quot;{message.content}&quot;
          </CardTitle>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant='ghost' 
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 -mr-2 -mt-2 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            
            {/* Styled Alert Content for Dark Mode */}
            <AlertDialogContent className="bg-slate-950 border-slate-800 text-slate-200">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Delete Message?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  This action cannot be undone. This will permanently delete this feedback from your dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800 hover:text-white">
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} className="bg-rose-600 hover:bg-rose-700 text-white border-0">
                    Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="p-0"></CardContent>

      <CardFooter className="p-5 pt-4 relative z-10">
        <div className="flex items-center text-xs text-slate-500 font-mono gap-1 bg-slate-900/50 px-2 py-1 rounded-md border border-slate-800/50">
           <Clock className="w-3 h-3" />
           {dayjs(message.createdAt).format('MMM D, YYYY · h:mm A')}
        </div>
      </CardFooter>
    </Card>
  );
}