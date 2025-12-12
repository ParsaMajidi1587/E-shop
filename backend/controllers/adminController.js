import bcrypt, { hash } from 'bcryptjs'
import { pool } from '../db/database.js'
import validator from 'validator'

export const activities = async(req,res)=>{
    try {
        const page = req.query.page
        const products = await pool.query('SELECT COUNT (*) FROM products')
        const user = await pool.query('SELECT COUNT(*) FROM users')
        const allPrices = await pool.query('SELECT SUM (price) AS total_price FROM products ')
        const viewStats = await pool.query(`
            SELECT DATE(created_at)AS day , COUNT(*) AS views
            FROM visits
            WHERE page = $1
            GROUP BY DATE(created_at)
            ORDER BY day ASC
            `,[page])
        res.json({
            totalProducts:products.rows[0].count,
            totalUsers:user.rows[0].count,
            totalPrices: allPrices.rows[0].total_price,
            views : viewStats.rows
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({message:'خطای سرور'})
    }
}

export const adminProducts = async(req,res)=>{
    let page = parseInt(req.query.page)||1
    let limit = parseInt(req.query.limit)|| 5
    let offset = (page-1)*limit
    try {
        const result = await pool.query(`
            SELECT * FROM products
            ORDER BY id DESC
            LIMIT $1 OFFSET $2
            `,[limit,offset])
        const ProductCount = await pool.query(`
            SELECT COUNT(*)FROM products    
        `)
        const totalItems = parseInt(ProductCount.rows[0].count)
        const totalPage = Math.ceil( totalItems / limit)
     res.json({
        products:result.rows,
        pagination:{
            totalItems,
            totalPage,
            currentPage: page,
            limit
        }
    })
    } catch (error) {
        console.log(error);
        
    }
}
export const adminProductsDelete = async (req,res)=>{
    try {
        const {id} = req.params
        const check = await pool.query(`
        SELECT * FROM products WHERE id = $1  `,
        [id])
        
        if(check.rowCount === 0){
           return res.status(401).json({message: 'محصول پیدا نشد '})
        }
        const deleted = await pool.query(`
      DELETE FROM products WHERE id = $1 RETURNING *
    `, [id]);
       
        res.json({message:'محصول با موفقیت حذف شد',deleted: deleted.rows[0]})
    } catch (error) {
        console.log(error);
           
    }
}

export const adminUsers = async(req,res)=>{
    let page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit)||5
    let offset = (page - 1)*limit
    try {
        const result = await pool.query(`
            SELECT * FROM users 
            ORDER BY id DESC
            LIMIT $1 OFFSET $2
            `,[limit , offset])
        const userCount = await pool.query(`
            SELECT COUNT (*) FROM users
            `)
        const totalItems = parseInt(userCount.rows[0].count)
        const totalPage = Math.ceil( totalItems / limit)
        res.json({users : result.rows,
            pagination:{
            totalItems,
            totalPage,
            currentPage: page,
            limit
        }
        })
    } catch (error) {
        console.log(error);
        
    }
}
export const adminUsersDelete = async (req,res)=>{
    try {
        const {id} = req.params
        const check = await pool.query(`
        SELECT * FROM users WHERE id = $1  `,
        [id])
        
        if(check.rowCount === 0){
           return res.status(401).json({message: 'کاربر پیدا نشد '})
        }
        const deleted = await pool.query(`
      DELETE FROM users WHERE id = $1 RETURNING *
    `, [id]);
       
        res.json({message:'کاربر با موفقیت حذف شد',deleted: deleted.rows[0]})
    } catch (error) {
        console.log(error);
           
    }
}

export const addProducts=async(req,res)=>{
    const {title , description , image , category , price , brand} = req.body
    try {
        if(!title || !description || !image || !category || !price || !brand){
           return res.status(400).json({message : 'تمام فیلد ضروری است'})
        }
        const newProducts = await pool.query(`
            INSERT INTO products (title , description , image , category , price,brand)
            VALUES ($1 , $2 , $3 , $4 , $5 , $6)
            `,[title,description,image,category,price,brand])
        res.json({success : 'محصول با موفقیت اضافه شد',product:newProducts.rows[0]})
        
    } catch (error) {
        console.log(error);
        res.json({message :'مشکلی پیش امد'})
    }
    
}

export const addUsers = async(req,res)=>{
    let {fullname ,email, username , avatar,password , role}=req.body
    const existing = await pool.query('SELECT * FROM users WHERE email = $1 OR username =$2',[email,username])
    username = username.trim()
    email = email.trim()
    fullname = fullname.trim()
    if(!fullname || !username  || !email || !password ){
        return res.status(400).json({message:'تمام فیل ها ضروری است'})
    }
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\-!@#$%^&*])[A-Za-z\d_\-!@#$%^&*]{8,20}$/.test(password)){
        return res.status(400).json({message:'رمز عبور باید ۱ تا ۲۰ کاراکتر باشد و شامل حروف، اعداد، _ یا - باشد.'})
    }
     if(!/^[a-zA-Z0-9_-]{1,20}$/.test(username)){
        return res.status(400).json({message:'نام کاربری نباید ۱ تا ۲۰ کاراکتر باشد و شامل حروف، اعداد، _ یا - باشد.'})
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({message:'ایمیل نامعتبر است'})
    }
    if(existing.rows.length>0){
        return res.status(400).json({message:"کاربر با اطلاعات مورد نظر در دسترس است"})
    }
    try {
        const hashed = await bcrypt.hash(password , 10)
        const newUser = await pool.query(`
            INSERT INTO users(fullname , username , avatar , password , role,email)
            VALUES($1 , $2 , $3 , $4, $5 , $6)
            `,[fullname , username , avatar , hashed , role,email ])
            res.json({success:'کاربر جدید اضافه شد' , user: newUser.rows[0]})
    } catch (error) {
        console.log(error);
        
    }

}