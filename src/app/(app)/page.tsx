'use client';
import Head from 'next/head';
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { User } from '@/model/User.model';

const Home = () => {
  const router=useRouter()
  const {data:session}=useSession()
  const user:User=session?.user as User
  return (
    <>
    <Head>
    <title>Unknown Feedback</title>
    </Head>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>
    {/* Carousel for Messages */}
    <Carousel
    plugins={[Autoplay({ delay: 2000 })]}
    className="w-full max-w-lg md:max-w-xl"
  >
    <CarouselContent>
      {messages.map((message, index) => (
        <CarouselItem key={index} className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>{message.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
              <Mail className="flex-shrink-0" />
              <div>
                <p>{message.content}</p>
                <p className="text-xs text-muted-foreground">
                  {message.received}
                </p>
              </div>
            </CardContent>
          </Card>
        </CarouselItem>
      ))}
    </CarouselContent>
  </Carousel>
  {session?(<Button onClick={(e)=>router.replace("/dashboard")}>View Dashboard</Button>):(<p className='border-red-200 border-2 p-2 text-center cursor-pointer' onClick={(e)=>router.replace('/signin')}>Please Login to access Dashboard</p>)}
  
</main>

{/* Footer */}
<footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
  © 2023 True Feedback. All rights reserved.
</footer>
</>
  )
}

export default Home