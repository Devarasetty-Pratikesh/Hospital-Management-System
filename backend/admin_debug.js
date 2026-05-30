const mysql=require('mysql2/promise'); 
async function run() { 
  const c = await mysql.createConnection({host:'localhost', user:'root', password:'Dp@23456', database:'hospitalmanagementsystem'}); 
  const [tables] = await c.query('SHOW TABLES'); 
  for (let t of tables) { 
    const tName = Object.values(t)[0]; 
    const [schema] = await c.query('SHOW CREATE TABLE `' + tName + '`'); 
    console.log(schema[0]['Create Table']); 
  } 
  c.destroy(); 
} 
run();
