//Importamos los datos de la conexión
const mysqlConnection = require('../database');
//Creamos la conexión a nuestra base de datos con los datos almacenados en conn

 
//Creamos un objeto al que llamaremos usuarios
var ministerios = {};
 
//Obtenemos todos los usuarios
ministerios.getMinisterios = function(callback)
{
	if (mysqlConnection) 
	{
		mysqlConnection.query('SELECT * FROM ministerio', function(error, rows) {
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
ministerios.getMinisterioById = function(id,callback)
{
	
    if (mysqlConnection) 
	{    
    mysqlConnection.query('SELECT * FROM ministerio where ID_MINISTERIO = ?',[id],(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows[0]);
        }else{
            throw err;
        }
    });
}

}

//Añadir un nuevo usuario
ministerios.insertMinisterio = function(MinisterioData,callback)
{
        
    mysqlConnection.query('INSERT INTO ministerio SET ?', MinisterioData.body,(err, rows, fields) =>{
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
ministerios.updateMinisterio = function(req, callback)
{
    const {ID_MINISTERIO, NOMBRE} = req.body;
  
    const query ='UPDATE ministerio SET NOMBRE  = ? WHERE ID_MINISTERIO = ?';

    mysqlConnection.query(
        query, [NOMBRE, ID_MINISTERIO],(err, rows, fields) =>{
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
ministerios.deleteMinisterio = function(id, callback)
{
   
    mysqlConnection.query('DELETE FROM ministerio WHERE ID_MINISTERIO = ?',[id],(err, rows, fields) =>{
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
module.exports = ministerios;