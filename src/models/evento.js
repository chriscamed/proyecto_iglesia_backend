//Importamos los datos de la conexión
const mysqlConnection = require('../database');
//Creamos la conexión a nuestra base de datos con los datos almacenados en conn

 
//Creamos un objeto al que llamaremos usuarios
var eventos = {};
 
//Obtenemos todos los usuarios
eventos.getEventos = function(callback)
{
	if (mysqlConnection) 
	{
		mysqlConnection.query('SELECT * FROM eventos ORDER BY FECHA_EVENTO DESC', function(error, rows) {
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
eventos.getEventoById = function(id,callback)
{
	
    if (mysqlConnection) 
	{    
    mysqlConnection.query('SELECT * FROM eventos where ID_EVENTO = ?',[id],(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows[0]);
        }else{
            throw err;
        }
    });
}

}


eventos.getTotalEventos = function(callback)
{
	
    if (mysqlConnection) 
	{    
    mysqlConnection.query('SELECT count(*) as total FROM eventos',(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows[0]);
        }else{
            throw err;
        }
    });
}

}

eventos.getEventoPaginate = function(offset, limit, callback)
{
	
    if (mysqlConnection) 
	{    
    mysqlConnection.query('SELECT * FROM eventos ORDER BY FECHA_EVENTO DESC LIMIT  ? , ?  ',[offset,limit],(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows);
        }else{
            throw err;
        }
    });
}

}

//Añadir un nuevo usuario
eventos.insertEvento = function(eventoData,callback)
{
        
    mysqlConnection.query('INSERT INTO eventos SET ?', eventoData.body,(err, rows, fields) =>{
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
eventos.updateEventos = function(req, callback)
{
    const {ID_EVENTO, NOMBRE, FECHA_EVENTO, HORA_INICIO, HORA_FIN} = req.body;
  
    const query ='UPDATE eventos SET NOMBRE  = ?, FECHA_EVENTO = ?, HORA_INICIO = ?, HORA_FIN = ? WHERE ID_EVENTO = ?';

    mysqlConnection.query(
        query, [NOMBRE, FECHA_EVENTO, HORA_INICIO, HORA_FIN, ID_EVENTO],(err, rows, fields) =>{
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
eventos.deleteEventos = function(id, callback)
{
   
    mysqlConnection.query('DELETE FROM eventos WHERE ID_EVENTO = ?',[id],(err, rows, fields) =>{
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

module.exports = eventos;