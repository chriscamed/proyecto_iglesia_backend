//Importamos los datos de la conexión
const mysqlConnection = require('../database');
//Creamos la conexión a nuestra base de datos con los datos almacenados en conn

//Creamos un objeto al que llamaremos usuarios
var user = {};
 
var bcrypt = require( 'bcrypt');
//Obtenemos login

user.getUserById = function(id,callback)
{
	
    if (mysqlConnection) 
	{    
    mysqlConnection.query('SELECT * FROM user where id = ?',[id],(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows[0]);
        }else{
            throw err;
        }
    });
}

}




user.getUserLogin = async function(usuario, callback)
{
	
    if (mysqlConnection) 
	{
           
    mysqlConnection.query('SELECT * FROM user where USUARIO = ? ',[usuario],(err, rows, fields) =>{
        if(!err){
            
                            callback(null, rows[0]);
            
        }else{
            throw err;
        }
    });
}

}

user.getListUser = async function( callback)
{
	
    if (mysqlConnection) 
	{
           
    mysqlConnection.query('SELECT * FROM user',(err, rows, fields) =>{
        if(!err){
            callback(null, rows);
            
        }else{
            throw err;
        }
    });
}

}


//Añadir un nuevo usuario
user.insertUsuario = async function(UsuarioData,callback)
{
    const hashPassword =  await bcrypt.hashSync(UsuarioData.body.PASS, 10);
       
    mysqlConnection.query('INSERT INTO user SET USUARIO = ?, PASS = ?, ROL = ?', [UsuarioData.body.USUARIO, hashPassword,UsuarioData.body.ROL],(err, rows, fields) =>{
        if(!err){
            callback(null, {
                success: true,
                errors: null
            });
           
        }else{
            callback(null, {
                success: false,
                errors: {err}
            });
        }
    });

}

user.updateUsuario = async function(UsuarioData,callback)
{
    const hashPassword =  await bcrypt.hashSync(UsuarioData.body.PASS, 10);
       
    mysqlConnection.query('UPDATE user SET USUARIO = ?, PASS = ?, ROL = ? where id = ?', [UsuarioData.body.USUARIO, hashPassword,UsuarioData.body.ROL,UsuarioData.body.id],(err, rows, fields) =>{
        if(!err){
            callback(null, {
                success: true,
                errors: null
            });
           
        }else{
            callback(null, {
                success: false,
                errors: {err}
            });
        }
    });

}


module.exports = user;