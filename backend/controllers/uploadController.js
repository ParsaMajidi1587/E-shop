import { pool } from "../db/database.js"
import cloudinary from "../utils/cloudinary.js"
export const uploadController = async(req,res)=>{
    try {
        if(!req.file){
            res.status(400).json({message:'هیچ فایلی ارسال نشده '})
        }
        const avatarUrl = req.file.path
        const userId = req.session.user.id
        await pool.query('UPDATE users SET avatar = $1 WHERE id =$2',[avatarUrl,userId])
        req.session.user.avatar = avatarUrl
        console.log("SESS:", req.session);
console.log("SESSION USER67:", req.session.user);

        res.json({
      message: 'عکس پروفایل با موفقیت بروزرسانی شد',
      avatar: avatarUrl
    })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'خطا در آپلود عکس' })

    }
}

export const deleteUploadController = async(req,res)=>{
    try {
        if(!req.session.user || !req.session.user.id){
            return status(401).json({message:" لطفا وارد شوید "})
        }
        const userId = req.session.user.id
        const result = await pool.query('SELECT avatar FROM users WHERE id = $1',[userId])
        const avatarUrl = result.rows[0].avatar
        if (avatarUrl) {
      const parts = avatarUrl.split('/')
      const fileName = parts[parts.length - 1].split('.')[0]
      const folder = 'avatar' 
      const publicId = `${folder}/${fileName}`

      await cloudinary.uploader.destroy(publicId)
    }
    await pool.query('UPDATE users SET avatar = NULL WHERE id =$1',[userId])
    req.session.user.avatar = null 
    res.json({ message: 'عکس پروفایل حذف شد', avatar: null })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'خطا در حذف عکس' })
    }
}