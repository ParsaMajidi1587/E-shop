
export const meController=(req,res)=>{
    try {
        if(!req.session.user){
           return res.status(400).json({message:"شما وارد سیستم نشده اید"})
        }
        console.log('user info',req.session.user);
        console.log("SESSION AFTER REGISTER:", req.session);
        
        res.json({user:req.session.user})

    } catch (error) {
        console.log(error);
        res.json({message:'مشکلی پیش امده لطفا مجددا تلاش کنید'})
    }
}