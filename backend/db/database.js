import dotenv from 'dotenv'
dotenv.config()
import {Pool} from 'pg'

export const pool = new Pool({
    user:process.env.DATABASE_USERNAME,
    host:process.env.DATABASE_HOST,
    database:process.env.DATABASE_DB,
    password: process.env.DATABASE_PASSWORD ,
    port:process.env.DATABASE_PORT
})