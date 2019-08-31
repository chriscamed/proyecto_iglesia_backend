//Importamos los datos de la conexión
const mysqlConnection = require('../database');
//Creamos la conexión a nuestra base de datos con los datos almacenados en conn

 
//Creamos un objeto al que llamaremos usuarios
var ocupaciones = {};
 
//Obtenemos todos los usuarios
ocupaciones.getOcupaciones = function(callback)
{
	if (mysqlConnection) 
	{
		mysqlConnection.query('SELECT * FROM ocupaciones', function(error, rows) {
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
ocupaciones.getOcupacionById = function(id,callback)
{
	
    if (mysqlConnection) 
	{    
    mysqlConnection.query('SELECT * FROM ocupaciones where ID_OCUPACION = ?',[id],(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows[0]);
        }else{
            throw err;
        }
    });
}

}

//Añadir un nuevo usuario
ocupaciones.insertOcupacion = function(ocupacionData,callback)
{
        
    mysqlConnection.query('INSERT INTO ocupaciones SET ?', ocupacionData.body,(err, rows, fields) =>{
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
ocupaciones.updateOcupacion = function(req, callback)
{
    const {ID_OCUPACION, OCUPACION} = req.body;
  
    const query ='UPDATE ocupaciones SET OCUPACION  = ? WHERE ID_OCUPACION = ?';

    mysqlConnection.query(
        query, [OCUPACION, ID_OCUPACION],(err, rows, fields) =>{
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
ocupaciones.deleteOcupacion = function(id, callback)
{
   
    mysqlConnection.query('DELETE FROM ocupaciones WHERE ID_OCUPACION = ?',[id],(err, rows, fields) =>{
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
module.exports = ocupaciones;