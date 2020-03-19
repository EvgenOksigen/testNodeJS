import db from '../../../helpers/db'
import fs from 'fs'
import path from 'path'
import csvjson from 'csvjson'

const options = {
  delimiter : ',',
  quote     : '"'
}

const options_CSV = {
  delimiter   : ",",
  wrap        : false
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

      console.log(ctx.request.body);

      let data_csv = fs.readFileSync(path.join('users.csv'),{encoding : 'utf8'})
      
      let data_json = csvjson.toObject(data_csv, options)

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
    const read =  fs.createReadStream(path.join('users.csv'))
    
    const write =  fs.createWriteStream(path.join('users.json'))
    
    const toObject =  csvjson.stream.toObject();
    
    const stringify =  csvjson.stream.stringify();
    
    read.pipe(toObject).pipe(stringify).pipe(write)
    
    ctx.body = fs.createReadStream('users.json')
  },
  async test(ctx){
    const client = await db.pool.connect()


    let data = await client.query('select * from users').then(res => res.rows)


    data.map(obj=> delete obj.id_user)

    let jsn = csvjson.toCSV(data, options_CSV)
    fs.writeFileSync(`${path.resolve('users.csv')}`, jsn)
    let content = fs.readFileSync(path.resolve('users.csv'), "utf8")
    console.log('content:',content);
    
    const fileName = `${path.join('users.csv')}`;

    try {
      if (fs.existsSync(fileName)) {
        ctx.body = fs.createReadStream(fileName);
        ctx.attachment(fileName);
      } else {
        ctx.throw(400, "Requested file not found on server");
      }
    } catch(error) {
      ctx.throw(500, error);
    } finally{
      client.release()
    }
  }
}

/*
 const clickHandle = () => {
    window.open("http://localhost:4010/api/users/djs");
  };
  <button className="nav-link" type="button" onClick={clickHandle}>
              Get CSV
            </button>
            */