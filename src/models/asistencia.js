
//Importamos los datos de la conexión
const mysqlConnection = require('../database');
//Creamos la conexión a nuestra base de datos con los datos almacenados en conn

 
//Creamos un objeto al que llamaremos asistencias
var asistencias = {};
 
//Obtenemos todos los asistencias
asistencias.getAsistencias = function(callback)
{
	if (mysqlConnection) 
	{
		mysqlConnection.query('SELECT * FROM asistencia', function(error, rows) {
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
asistencias.getAsistenciaById = function(id,callback)
{
	
    if (mysqlConnection) 
	{    
    mysqlConnection.query('SELECT * FROM asistencia where ID_ASISTENCIA = ?',[id],(err, rows, fields) =>{
        if(!err){
           
            callback(null, rows[0]);
        }else{
            throw err;
        }
    });
}

}

//Añadir un nuevo asistencia
asistencias.insertAsistencia = function(asistenciaData,callback)
{
    try{
        if(asistenciaData.body.INVITADO_POR==0){
            asistenciaData.body.INVITADO_POR=null;
        }    
    
    }catch(e){

    }
    try{
        if(asistenciaData.body.ASISTENTE==0){
            asistenciaData.body.ASISTENTE=null;
        }    
    
    }catch(e){

    }

    mysqlConnection.query('INSERT INTO asistencia SET ?', asistenciaData.body,(err, rows, fields) =>{
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
asistencias.deleteAsistencia = function(id, callback)
{
   
    mysqlConnection.query('DELETE FROM asistencia WHERE ID_ASISTENCIA = ?',[id],(err, rows, fields) =>{
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
module.exports = asistencias;