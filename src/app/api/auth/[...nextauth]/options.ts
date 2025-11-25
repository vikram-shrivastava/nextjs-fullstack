import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
export const authOption:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:'Credentialsofguest',
            name: 'Credentialsofguest',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                if (credentials?.username === 'guest' && credentials?.password === 'guest') {
                    console.log("guest login")
                    return {
                        id: 'guest',
                        username: 'Guest'+Math.floor(Math.random()),
                        email: 'guest@example.com',
                    };
                }
                return null;
            },
        }),
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email" },
                password: { label: "Password", type: "password" }
              },
            async authorize(credentials:any):Promise<any>{
                await dbConnect()
                try {
                    const user=await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error('No user found with this email')
                    }
                    if(!user.isVerified)
                    {
                        throw new Error('Please verify your account first before login')
                    }
                    const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password)
                    if(!isPasswordCorrect)
                    {
                        throw new Error('Incorrect Password')
                    }
                    else{
                        return user;
                    }

                } catch (error:any) {
                    console.log("error in options",error)
                    throw new Error(error)
                }
            }
        })
    ],
    pages:{
        signIn:'/signin'
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXT_AUTH_SECRET,
    callbacks:{
        async jwt({ token, user}) {
          if (user) {
              token._id = user._id?.toString();
              token.isVerified = user.isVerified;
              token.isAcceptingmessages = user.isAcceptingmessages;
              token.username = user.username;
            }
            return token;
      
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingmessages = token.isAcceptingmessages;
                session.user.username = token.username;
              }
              return session;
        
          }
        }
}
