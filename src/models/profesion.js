//Importamos los datos de la conexión
const mysqlConnection = require('../database');
//Creamos la conexión a nuestra base de datos con los datos almacenados en conn

 
//Creamos un objeto al que llamaremos usuarios
var profesiones = {};
 
//Obtenemos todos los usuarios
profesiones.getprofesiones = function(callback)
{
	if (mysqlConnection) 
	{
		mysqlConnection.query('SELECT * FROM profesiones', function(error, rows) {
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
profesiones.getProfesionById = function(id,callback)
{
	
    if (mysqlConnection) 
	{    
    mysqlConnection.query('SELECT * FROM profesiones where ID_PROFESION = ?',[id],(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows[0]);
        }else{
            throw err;
        }
    });
}

}

//Añadir un nuevo usuario
profesiones.insertProfesion = function(ProfesionData,callback)
{
        
    mysqlConnection.query('INSERT INTO profesiones SET ?', ProfesionData.body,(err, rows, fields) =>{
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
profesiones.updateProfesion = function(req, callback)
{
    const {ID_PROFESION, PROFESION} = req.body;
  
    const query ='UPDATE profesiones SET PROFESION  = ? WHERE ID_PROFESION = ?';

    mysqlConnection.query(
        query, [PROFESION, ID_PROFESION],(err, rows, fields) =>{
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
profesiones.deleteProfesion = function(id, callback)
{
   
    mysqlConnection.query('DELETE FROM profesiones WHERE ID_PROFESION = ?',[id],(err, rows, fields) =>{
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
module.exports = profesiones;