
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import validator from 'validator'
import { pool } from './database.js'
import { sendEmailReset } from '../middleware/mail.js'
export const authController = async (req,res)=>{
    
    let{fullname , username , email, password} = req.body
    const existing = await pool.query('SELECT * FROM users WHERE email = $1 OR username =$2',[email,username])
    if(!fullname || !username || !email || !password){
       return res.status(400).json({message:'لطفا تمام فیلد هارا پر کنید'})
    }
    username = username.trim()
    email = email.trim()
    fullname = fullname.trim()
    if(!/^[a-zA-Z0-9_-]{1,20}$/.test(username)){
        return res.status(400).json({message:'نام کاربری نباید ۱ تا ۲۰ کاراکتر باشد و شامل حروف، اعداد، _ یا - باشد.'})
    }
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\-!@#$%^&*])[A-Za-z\d_\-!@#$%^&*]{8,20}$/.test(password)){
        return res.status(400).json({message:'رمز عبور باید ۱ تا ۲۰ کاراکتر باشد و شامل حروف، اعداد، _ یا - باشد.'})
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({message:'ایمیل شما معتبر نیست'})
    }
    if(existing.rows.length>0){
        return res.status(400).json({message:"کاربر با اطلاعات مورد نظر در دسترس است"})
    }
    try {
        const hashed = await bcrypt.hash(password , 10)
        const result = await pool.query('INSERT INTO users(fullname,username,email,password)VALUES($1,$2,$3,$4) RETURNING *',
            [fullname,username,email,hashed])

       let user = result.rows[0]
        req.session.user={
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
        }
        req.session.save(() => {
        res.json({ success: 'با موفقیت ثبت نام شدید', user: req.session.user });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'مشکلی پیش آمد، لطفا دوباره تلاش کنید' });

    }
    
}

export const authLogin =async(req,res)=>{
    try{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({message:"لطفا ایمیل و پسورد را وارد کنید"})
    }
    const result = await pool.query('SELECT * FROM users WHERE email =$1',[email])
    if(result.rows.length === 0 ){
       return res.status(400).json({message:"کاربر با اطلاعات مورد نظر یافت نشد"})
    }
    const user = result.rows[0]
    console.log(user)

    const isMatch = await bcrypt.compare(password , user.password)
    if(!isMatch){
       return res.status(400).json({message:"رمز عبور اشتباه است"})
    }
    console.log("isMatch:", isMatch);

     req.session.user = {
    id: user.id,
    fullname:user.fullname,
    username: user.username,
    email: user.email,
  };
  req.session.save(() => {
  console.log("SESSION AFTER LOGIN:", req.session);
  res.json({ success: "ورود با موفقیت انجام شد", user: req.session.user });
});
}
catch(error){
    console.log(error);
    res.json({message : 'مشکلی پیش امده'})
}
}

export const authLogOut = async(req,res)=>{
    req.session.destroy( ()=>{
        res.json({message:'از سیستم خارج شدید'})
    })
}

export const authDelete = async(req,res)=>{
    try {
        const userId = await req.session.user.id
        await pool.query('DELETE  FROM users WHERE id =$1',[userId])
        req.session.destroy((err)=>{
            if(err){
                console.log(err);
                return res.status(400).json({message:'خطا در حذف سشن دوباره امتحان کنید'})
            }
            res.clearCookie('connect.sid')
            return res.json({success:'اکانت با موفقیت حذف شد'})
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "مشکلی هنگام حذف اکانت پیش آمد" });

    }
}

export const forgotPassword = async(req,res)=>{
    const {email} = req.body

    const user = await pool.query(
        `
        SELECT * FROM users WHERE email = $1
        `,[email]
    )
    if(!email){
        return res.status(400).json({message:'لطفا ایمیل خود را وارد کنید'})
    }
    if(user.rows.length === 0){
        return res.status(404).json({ message: "کاربری با این ایمیل پیدا نشد" });
    }
    const token = crypto.randomBytes(32).toString('hex')
    const expireTime = new Date(Date.now() + 15 * 60 * 1000); 

    await pool.query(`
        UPDATE users
        SET reset_token = $1 , reset_token_expire = $2
        WHERE email=$3
        `,[token,expireTime,email])

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    sendEmailReset(email , resetLink)
    res.json({ success: "لینک بازیابی رمز به ایمیل ارسال شد" });

}

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE reset_token=$1 AND reset_token_expire > NOW()",
    [token]
  );
  if(!password){
    return res.status(400).json({message:'لطفا رمز خود را وارد کنید'})
  }
  if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\-!@#$%^&*])[A-Za-z\d_\-!@#$%^&*]{8,20}$/.test(password)){
        return res.status(400).json({message:'رمز عبور باید ۱ تا ۲۰ کاراکتر باشد و شامل حروف، اعداد، _ یا - باشد.'})
    }
  if (user.rows.length === 0) {
    return res.status(400).json({ message: "توکن نامعتبر یا منقضی شده" });
  }

  const hashed = await bcrypt.hash(password, 10);

  await pool.query(
    `UPDATE users 
     SET password=$1, reset_token=NULL, reset_token_expire=NULL 
     WHERE reset_token=$2`,
    [hashed, token]
  );

  res.json({ success:  "  رمز عبور با موفقیت تغییر کرد" });
};
