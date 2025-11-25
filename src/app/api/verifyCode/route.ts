import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request:Request) {
    await dbConnect()
    try {
        const {username,code}=await request.json()
        const decodedUsername=decodeURIComponent(username)
        const user=await UserModel.findOne({
            username:decodedUsername
        })
        if(!user)
        {
            return Response.json({
                success:false,
                message:"User not found"
            })
        }
        const iscodeValid=user.verifyCode===code
        const isCodenotExpired=(user.verifyCodeExpiry)>new Date()
        if(!iscodeValid)
        {
            return Response.json({
                success:false,
                message:"Invalid code"
            })
        }
        else if(!isCodenotExpired)
        {
            return Response.json({
                success:false,
                message:"Verification code expired || Signup again to get new code"
            })
        }
        else if(iscodeValid && isCodenotExpired)
        {
            user.isVerified=true
            await user.save()
            return Response.json({
                success:true,
                message:"User verified successfully"
            },{
                status:200
            })
        }
    } catch (error) {
        console.error("Cannot verify Code")
        return Response.json({
            success:false,
            message:"Cannot verify Code"
        })
    }
}