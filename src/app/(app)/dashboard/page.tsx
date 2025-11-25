'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User.model';
import { acceptMessagesSchema } from '@/schemas/acceptMessagesSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Copy, BarChart3, MessageSquare, AlertCircle, Smile, Frown, Meh, Search } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import MessageCards from '@/components/MessageCards'; // Keeping your original card component

// --- Sentiment Analysis Helper (Client Side Simulation) ---
type Sentiment = 'positive' | 'negative' | 'neutral';

const analyzeSentiment = (text: string): Sentiment => {
  const positiveWords = ['good', 'great', 'awesome', 'excellent', 'love', 'happy', 'best', 'thanks', 'helpful', 'amazing', 'cool', 'nice'];
  const negativeWords = ['bad', 'worst', 'terrible', 'hate', 'sad', 'slow', 'ugly', 'stupid', 'boring', 'angry', 'useless', 'bug'];
  
  const lowerText = text.toLowerCase();
  let score = 0;

  positiveWords.forEach(word => { if (lowerText.includes(word)) score++; });
  negativeWords.forEach(word => { if (lowerText.includes(word)) score--; });

  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
};

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'analytics'>('messages');
  const [searchTerm, setSearchTerm] = useState('');

  const { toast } = useToast();
  const { data: session } = useSession();

  // --- Derived State for Analysis ---
  const processedMessages = useMemo(() => {
    return messages.map(msg => ({
      ...msg,
      sentiment: analyzeSentiment(msg.content)
    }));
  }, [messages]);

  const stats = useMemo(() => {
    const total = processedMessages.length;
    const positive = processedMessages.filter(m => m.sentiment === 'positive').length;
    const negative = processedMessages.filter(m => m.sentiment === 'negative').length;
    const neutral = total - positive - negative;
    return { total, positive, negative, neutral };
  }, [processedMessages]);

  const filteredMessages = processedMessages.filter(m => 
    m.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/acceptmessages');
      setValue('acceptMessages', response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>('/api/getMessages');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: 'Refreshed Messages',
          description: 'Showing latest messages',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to fetch messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages, toast]);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/acceptmessages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Please Login</div>;
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-slate-400 mt-1">Welcome back, {username}. Here's your feedback overview.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-xl border border-slate-800">
             <div className="flex items-center gap-2 px-3">
                <Switch
                  {...register('acceptMessages')}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                  className="data-[state=checked]:bg-indigo-600"
                />
                <span className={`text-sm font-medium ${acceptMessages ? 'text-indigo-400' : 'text-slate-500'}`}>
                  {acceptMessages ? 'Accepting Messages' : 'Messages Paused'}
                </span>
             </div>
          </div>
        </div>

        {/* --- Quick Actions --- */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Your Public Link</h2>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-grow w-full">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-lg p-3 pr-10 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
              />
              <div className="absolute right-3 top-3 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <Button onClick={copyToClipboard} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Copy className="h-4 w-4" /> Copy Link
            </Button>
          </div>
        </div>

        {/* --- Navigation Tabs --- */}
        <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800 w-fit">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'messages' 
              ? 'bg-slate-800 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-4 w-4" /> Messages
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'analytics' 
              ? 'bg-slate-800 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="h-4 w-4" /> Analytics
          </button>
        </div>

        {/* --- Tab Content --- */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 w-full bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                  }}
                  className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <div key={message._id as string} className="relative group">
                       {/* Sentiment Indicator Strip */}
                       <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl z-10 
                          ${message.sentiment === 'positive' ? 'bg-emerald-500' : 
                            message.sentiment === 'negative' ? 'bg-rose-500' : 'bg-slate-600'}`} 
                       />
                       {/* Using your existing component, but wrapping it to fit the theme if needed */}
                       <div className="pl-1 h-full">
                           <MessageCards
                             message={{ ...message, _id: String(message._id) }}
                             onMessageDelete={handleDeleteMessage}
                           />
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-2 text-center py-20 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                    <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-3 opacity-50" />
                    <p className="text-slate-500">No messages found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Feedback</p>
                              <h3 className="text-3xl font-bold text-white mt-2">{stats.total}</h3>
                           </div>
                           <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                              <MessageSquare className="h-5 w-5" />
                           </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-xs text-emerald-400/80 uppercase font-bold tracking-wider">Positive</p>
                              <h3 className="text-3xl font-bold text-white mt-2">{stats.positive}</h3>
                           </div>
                           <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                              <Smile className="h-5 w-5" />
                           </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-xs text-rose-400/80 uppercase font-bold tracking-wider">Negative</p>
                              <h3 className="text-3xl font-bold text-white mt-2">{stats.negative}</h3>
                           </div>
                           <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                              <Frown className="h-5 w-5" />
                           </div>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Neutral</p>
                              <h3 className="text-3xl font-bold text-white mt-2">{stats.neutral}</h3>
                           </div>
                           <div className="p-2 bg-slate-700/30 rounded-lg text-slate-400">
                              <Meh className="h-5 w-5" />
                           </div>
                        </div>
                    </div>
                </div>

                {/* Sentiment Bar */}
                {stats.total > 0 && (
                    <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                        <h3 className="text-lg font-semibold text-white mb-6">Sentiment Distribution</h3>
                        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
                            <div style={{ width: `${(stats.positive / stats.total) * 100}%` }} className="h-full bg-emerald-500" />
                            <div style={{ width: `${(stats.neutral / stats.total) * 100}%` }} className="h-full bg-slate-600" />
                            <div style={{ width: `${(stats.negative / stats.total) * 100}%` }} className="h-full bg-rose-500" />
                        </div>
                        <div className="flex justify-between mt-4 text-xs text-slate-400">
                            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Positive</div>
                            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-600"></span> Neutral</div>
                            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Negative</div>
                        </div>
                    </div>
                )}

                {/* Detailed Analysis List */}
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                   <div className="p-4 border-b border-slate-800 bg-slate-900">
                      <h3 className="font-semibold text-white">Recent Analysis</h3>
                   </div>
                   <div className="divide-y divide-slate-800">
                      {processedMessages.slice(0, 5).map((msg, idx) => (
                          <div key={idx} className="p-4 flex items-start gap-4 hover:bg-slate-800/30 transition-colors">
                              <div className={`mt-1 p-1.5 rounded-full 
                                ${msg.sentiment === 'positive' ? 'bg-emerald-500/20 text-emerald-400' : 
                                  msg.sentiment === 'negative' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700/50 text-slate-400'}`}>
                                  {msg.sentiment === 'positive' ? <Smile className="h-4 w-4" /> : 
                                   msg.sentiment === 'negative' ? <Frown className="h-4 w-4" /> : <Meh className="h-4 w-4" />}
                              </div>
                              <div className="flex-1">
                                  <p className="text-slate-300 text-sm line-clamp-2">{msg.content}</p>
                                  <div className="flex gap-2 mt-2">
                                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                      <span className={`text-[10px] uppercase tracking-wider font-bold 
                                        ${msg.sentiment === 'positive' ? 'text-emerald-500' : 
                                          msg.sentiment === 'negative' ? 'text-rose-500' : 'text-slate-500'}`}>
                                          {msg.sentiment}
                                      </span>
                                  </div>
                              </div>
                          </div>
                      ))}
                      {processedMessages.length === 0 && (
                          <div className="p-8 text-center text-slate-500 text-sm">No data to analyze yet.</div>
                      )}
                   </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;