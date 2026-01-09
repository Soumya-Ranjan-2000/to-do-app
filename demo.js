const mysql = require("mysql2");


var con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'shopping'
})

con.connect((error)=>{ // Here if there is any error occured then it is going to collect it 
    if(!error){
        console.log('Connected with MySQL');
    } else {
        console.log(error);
    }
})

con.query('select * from tblproducts', (error,records, fields)=>{
    if(!error){
        console.log(records);
    }else {
        console.log(error);
    }
})

