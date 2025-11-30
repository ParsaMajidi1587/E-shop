import { pool } from "../database.js";

export const productMobileController = async (req, res) => {
  try {
    let query = 'SELECT * FROM products WHERE category = $1'
    const { minPrice, maxPrice, sort } = req.query;
    const {category} =  req.params
    const values = [category];
    let index = 2;
    if (minPrice) {
      query += `AND price >= $${index}`;
      values.push(minPrice);
      index++;
    }
    if (maxPrice) {
      query += ` AND price <= $${index}`;
      values.push(maxPrice);
      index++;
    }

    if (sort === "cheap") {
      query += ` ORDER BY price ASC`;
    }

    if (sort === "expensive") {
      query += ` ORDER BY price DESC`;
    }
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.json("there was an error please try again");
  }
}

export const productsById=async(req,res)=>{
  try{
  const {id , category} = await req.params
  const result = await pool.query('SELECT * FROM products WHERE category = $1 AND id = $2',[category,id])
  if(!result){
    return res.status(400).json({message:'مشکلی پیش امد لطفا مجددا تلاش کنید'})
  }
  res.json(result.rows[0])
}catch(err){
 console.log(err);
 res.json({message:'مشکل سرور'})
}
}

export const getRelatedProducts = async(req,res)=>{
  try {
    const {id} = await req.params
     const product = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );
    const category = product.rows[0].category;
    const related = await pool.query('SELECT * FROM products WHERE category =$1 AND id != $2 LIMIT 8',
      [category,id]) 
    res.json(related.rows)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "خطای سرور" });
  }
}

export const bestProducts = async(req,res)=>{
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY sold DESC LIMIT 8 ')
    res.json(result.rows)
    
    
  } catch (error) {
    console.log(error);
    res.status(400).json('مشکلی پیش امد')
  }
}
export const highRatedProducts = async(req,res)=>{
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY reviews DESC LIMIT 8 ')
    res.json(result.rows)
  } catch (error) {
    console.log(error);
    res.status(400).json({message:'مشکلی پیش امد'})
  }
}
export const searchProducts =async(req,res)=>{
  try{
  const {search} = req.query
  if(!search){

    res.status(400).json({message:'کالا مورد نظر پیدا نشد'})

  }
  const result = await pool.query(
    `
      SELECT * FROM products 
      WHERE title  ILIKE $1
      OR description ILIKE $1
      OR category ILIKE $1 
    `,[`%${search}%`]
    )
    console.log("SEARCH CALLED ✅");
console.log("query:", req.query.search);

    res.json(result.rows)
  }catch(err){
    console.log(err);
    res.json({message:'خطا در جستجو'})
    
  }
}