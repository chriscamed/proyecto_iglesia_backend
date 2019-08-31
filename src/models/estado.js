//Importamos los datos de la conexión
const mysqlConnection = require('../database');
//Creamos la conexión a nuestra base de datos con los datos almacenados en conn

 
//Creamos un objeto al que llamaremos usuarios
var estados = {};
 
//Obtenemos todos los usuarios
estados.getestados = function(callback)
{
	if (mysqlConnection) 
	{
		mysqlConnection.query('SELECT * FROM estado', function(error, rows) {
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null, rows);
			}
		});
	}
}
 
//Obtenemos un usuario por su id
estados.getEstadoById = function(id,callback)
{
	
    if (mysqlConnection) 
	{    
    mysqlConnection.query('SELECT * FROM estado where ID_ESTADO = ?',[id],(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows[0]);
        }else{
            throw err;
        }
    });
}

}

//Añadir un nuevo estado
estados.insertEstado = function(EstadoData,callback)
{
        
    mysqlConnection.query('INSERT INTO estado SET ?', EstadoData.body,(err, rows, fields) =>{
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

//Actualizar un usuario
estados.updateEstado = function(req, callback)
{
    const {ID_Estado, Estado} = req.body;
  
    const query ='UPDATE estado SET ESTADO  = ? WHERE ID_ESTADO = ?';

    mysqlConnection.query(
        query, [Estado, ID_Estado],(err, rows, fields) =>{
        if(!err){
            callback(null, {
                success: true,
                errors: null
            });
        }else{
            callback(null, {
                success:false,
                errors:{err}
            });
        }
    });

    
}

//Eliminar un usuario por su id
estados.deleteEstado = function(id, callback)
{
   
    mysqlConnection.query('DELETE FROM estado WHERE ID_ESTADO = ?',[id],(err, rows, fields) =>{
    if(!err){
        callback(null, {
            success:true,
            errors: null
        });
    }else{
        callback(null, {
            success:false,
            errors: err
        });
    }
});

			
}
module.exports = estados;