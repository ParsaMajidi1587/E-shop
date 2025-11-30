import { pool } from "../db/database.js";

export const cartController = async (req,res)=>{
    const userId = req.session.user.id;
    const { product_id , quantity = 1} = req.body
     try {
        const existing = await pool.query('SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',[userId,product_id])
        if( existing.rows.length > 0){
            const newQuantity = existing.rows[0].quantity + quantity
            await pool.query(
                'UPDATE cart SET quantity = $1 , updated_at = NOW() WHERE id =$2'
            ,[newQuantity, existing.rows[0].id])
            return res.json({message:'سبد خرید اپدیت شد' , quantity:newQuantity})
        }
        await pool.query('INSERT INTO cart (user_id ,product_id,quantity)VALUES($1,$2,$3)'
            ,[userId,product_id,quantity]
        )
        res.json({message:"به سبد خرید اضافه شد"})
     } catch (error) {
        console.log(error);
        res.status(400).json({message:'مشکل از سرور'})
     }
}

export const getCartInfo=async(req,res)=>{
    try {
      console.log("Session In Cart:", req.session);
           const userId = req.session.user.id
        const result = await pool.query(`
            SELECT p.id ,p.title , p.price ,p.brand,p.image,
            SUM(c.quantity) as quantity
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id =$1
            GROUP BY p.id, p.title, p.price, p.image, p.brand
            `,[userId])
        res.json(result.rows)    
    } catch (error) {
        console.log(error);
        res.status(400).json({message:'مشکلی پیش امد'})
    }
}

export const deleteCart=async(req,res)=>{
   try {
    const userId = req.session.user.id;
    const { product_id } = req.body;

    if (!userId || !product_id) {
      return res.status(400).json({ message: "اطلاعات ناقص است" });
    }

    const result = await pool.query(`
      DELETE FROM cart
      WHERE user_id = $1 AND product_id = $2
    `, [userId, product_id]);

    res.status(200).json({ message: "محصول با موفقیت حذف شد" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "خطا در حذف محصول" });
  }
}