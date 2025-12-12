export const requireAuth = (req ,res,next)=>{
    if(!req.session.user || !req.session.user.id){
        console.log('Access denied');
        return res.status(401).json({error:'لطفا وارد سایت شوید!!'})
    }
    next()
}