//Importamos los datos de la conexión
const mysqlConnection = require('../database');
//Creamos la conexión a nuestra base de datos con los datos almacenados en conn

 
//Creamos un objeto al que llamaremos asistencias
var logisticas = {};
 
//Obtenemos todos los asistencias
logisticas.getLogisticas = function(callback)
{
	if (mysqlConnection) 
	{
		mysqlConnection.query('SELECT l.*, CONCAT(m.PRIMER_NOMBRE," ",m.SEGUND_NOMBRE,m.PRIMER_APELLIDO , m.SEGUND_APELLIDO) as NOMBRE, e.NOMBRE as EVENTO_NOMBRE, DATE_FORMAT(e.FECHA_EVENTO,"%Y %m %d") as EVENTO_FECHA, e.HORA_INICIO  FROM logistica l, persona m, eventos e WHERE l.RESPONSABLE = m.ID_MIEMBRO AND e.ID_EVENTO = l.EVENTO ORDER BY EVENTO_FECHA', function(error, rows) {
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
 
//Obtenemos un asistencia por su id
logisticas.getLogisticaById = function(id,callback)
{
	
    if (mysqlConnection) 
	{    
    mysqlConnection.query('SELECT * FROM logistica where ID_LOGISTICA = ?',[id],(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows[0]);
        }else{
            throw err;
        }
    });
}

}

//Añadir un nuevo asistencia
logisticas.insertLogistica = function(asistenciaData,callback)
{
        
    mysqlConnection.query('INSERT INTO logistica SET ?', asistenciaData.body,(err, rows, fields) =>{
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

//Eliminar un asistencia por su id
logisticas.deleteLogistica = function(id, callback)
{
   
    mysqlConnection.query('DELETE FROM logistica WHERE ID_LOGISTICA = ?',[id],(err, rows, fields) =>{
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
module.exports = logisticas;