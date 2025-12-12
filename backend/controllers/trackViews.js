import {pool} from '../db/database.js'

export const trackViews = async(req,res)=>{
    const {page} = req.body
    const ip = req.ip
    await pool.query(`
        INSERT INTO visits (page , user_ip) VALUES($1 , $2)
        `,[page , ip]) 
        res.json({success  : true})
}