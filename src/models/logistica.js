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
		mysqlConnection.query('SELECT concat(c.PRIMER_NOMBRE,c.SEGUND_NOMBRE,c.PRIMER_APELLIDO,c.SEGUND_APELLIDO) as persona, b.ACTIVIDAD, d.NOMBRE, a.FECHA, a.HORA_INICIO, a.HORA_FIN from eventos as a join logisticas as b on a.ID_EVENTO = b.id_evento JOIN personas as c on b.id_persona = c.id_persona JOIN tipos_eventos as d on a.ID_TIPO_EVENTO = d.ID_TIPO_EVENTO', function(error, rows) {
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
    mysqlConnection.query('SELECT concat(c.PRIMER_NOMBRE,c.SEGUND_NOMBRE,c.PRIMER_APELLIDO,c.SEGUND_APELLIDO) as persona, b.ACTIVIDAD, d.NOMBRE, a.FECHA, a.HORA_INICIO, a.HORA_FIN from eventos as a join logisticas as b on a.ID_EVENTO = b.id_evento JOIN personas as c on b.id_persona = c.id_persona JOIN tipos_eventos as d on a.ID_TIPO_EVENTO = d.ID_TIPO_EVENTO where a.ID_EVENTO = ?',[id],(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows[0]);
        }else{
            throw err;
        }
    });
}

}



//Métodos para actualizar logisticas

//Agregar logisticas a evento
logisticas.insertLogistica = function(logisticaData,callback)
{
        
    mysqlConnection.query('INSERT INTO LOGISTICAS SET ?', logisticaData.body,(err, rows, fields) =>{
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

//Metodo para borrar persona de logistica
logisticas.updateLogistica = function(id, callback)
{
    
    mysqlConnection.query('DELETE FROM LOGISTICAS WHERE ID_EVENTO = ?',[id],(err, rows, fields) =>{
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