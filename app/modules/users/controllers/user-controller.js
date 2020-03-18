import db from '../../../helpers/db'
import fs from 'fs'
import path from 'path'
import csvjson from 'csvjson'

const options = {
  delimiter : ',',
  quote     : '"'
}

export default {
  async getall(ctx){
    const client = await db.pool.connect()
    if(!client){
      throw Error('Отсутствует клиент подключения к бд')
    }
    try{
      const {rows} = await client.query('select * from users')      
      console.log(rows);
      return ctx.body = {data: rows}
    }
    finally{
      client.release()
    }
  },

  async uploadCsv(ctx){
    const client = await db.pool.connect()
    if(!client){
      throw Error('Отсутствует клиент подключения к бд')
    }
    try{

      let data_csv = fs.readFileSync(path.join(`${path.resolve('users.csv')}`),{encoding : 'utf8'})
      
      let data_json = csvjson.toObject(data_csv, options)

      console.log( path.resolve('users.csv')  )

      // data_json.map( el=> { 
      //    client.query('INSERT INTO users (age, firstname, lastname, username) VALUES ($1, $2, $3, $4)', [el.Age, el.FirstName, el.LastName, el.UserName])
      //   }
      // )

      const table_data = await client.query('select * from users').then(res => res.rows)
      
      return ctx.body = { data_csv, data_json, table_data }
    
    }catch (e){
      ctx.throw(e)
    }
    finally{
      client.release()
    }
  },

  async downloadUsersJSON(ctx){
    
    const read =  fs.createReadStream(path.join(`${path.resolve('users.csv')}`))
    
    const write =  fs.createWriteStream(path.join('users.json'))
    
    const toObject =  csvjson.stream.toObject();
    
    const stringify =  csvjson.stream.stringify();
    
    read.pipe(toObject).pipe(stringify).pipe(write)

    let u_js = fs.readFileSync(path.join('users.json'))
    console.log(JSON.parse(u_js));
    // return ctx.body = {d_js}
  }
}