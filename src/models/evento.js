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
		mysqlConnection.query("SELECT t.NOMBRE, e.ID_EVENTO, e.ID_TIPO_EVENTO, DATE_FORMAT(e.FECHA,'%Y-%m-%d') as FECHA, e.HORA_INICIO, e.HORA_FIN FROM EVENTOS e INNER JOIN TIPOS_EVENTOS t ON e.ID_TIPO_EVENTO = t.ID_TIPO_EVENTO ORDER BY FECHA DESC", function(error, rows) {
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

//Obtenemos todos los tipos de evento
eventos.getTiposEvento = function(callback)
{
	if (mysqlConnection) 
	{
		mysqlConnection.query('SELECT * FROM TIPOS_EVENTOS', function(error, rows) {
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

//Creamos un tipo de evento
eventos.insertTipoEvento = function(nombre,callback)
{
        
    mysqlConnection.query('INSERT INTO TIPOS_EVENTOS SET ?', [nombre],(err, rows, fields) =>{
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


 
//Obtenemos un usuario por su id
eventos.getEventoById = function(id,callback)
{
	
    if (mysqlConnection) 
	{    
    mysqlConnection.query("SELECT ID_EVENTO, ID_TIPO_EVENTO, DATE_FORMAT(FECHA,'%Y-%m-%d') as FECHA, HORA_INICIO, HORA_FIN FROM eventos where ID_EVENTO = ?",[id],(err, rows, fields) =>{
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
        
    mysqlConnection.query('INSERT INTO EVENTOS SET ?', eventoData.body,(err, rows, fields) =>{
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
    const {ID_EVENTO, FECHA, HORA_INICIO, HORA_FIN} = req.body;
  
    const query ='UPDATE eventos SET FECHA = ?, HORA_INICIO = ?, HORA_FIN = ? WHERE ID_EVENTO = ?';

    mysqlConnection.query(
        query, [FECHA, HORA_INICIO, HORA_FIN, ID_EVENTO],(err, rows, fields) =>{
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
