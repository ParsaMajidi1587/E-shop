import {Pool} from 'pg'

export const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database:'shop',
    password:'sQbaseCode1864@1A',
    port:5432
})