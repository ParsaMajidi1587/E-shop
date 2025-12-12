export const isAdmin = (req,res,next)=>{
    if(!req.session.user || req.session.user.role !== 'admin' ){
      return  res.status(400).json({message:'شما ادمین نیستید '})
    }
    next()
}