import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"
import AuthProvider from "@/context/authProvider";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mystry Feedback",
  description: "Your One Stop solution for collecting valuable feedbacks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
